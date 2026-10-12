"""Synthetic browser regression; owns app servers and uses isolated MongoDB fixtures."""
import json
import os
from pathlib import Path
import socket
import signal
import subprocess
import tempfile
import time
import urllib.request
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright, expect
expect.set_options(timeout=20000)

ROOT = Path(__file__).resolve().parents[1]
AUDIT = ROOT / '.audit'
AUDIT.mkdir(exist_ok=True)
os.environ.setdefault('PLAYWRIGHT_BROWSERS_PATH', str(AUDIT / 'browsers'))
TOKEN = 'synthetic-browser-admin-token-32-characters'
AXE = ROOT / 'frontend/node_modules/axe-core/axe.min.js'


def ci_database_uri(value, ci):
    if not value:
        return None
    try:
        uri = urlsplit(value)
        valid = ci == 'true' and uri.scheme == 'mongodb' and uri.hostname in ('127.0.0.1', 'localhost')
        valid = valid and uri.path.startswith('/client_briefing_test_') and len(uri.path) > len('/client_briefing_test_')
        valid = valid and all(c.isascii() and (c.isalnum() or c in '_-') for c in uri.path[1:])
        valid = valid and not (uri.username or uri.password or uri.query or uri.fragment)
    except ValueError:
        valid = False
    if not valid:
        raise ValueError('External test MongoDB requires CI, loopback and a named fixture database.')
    return value


fixture_uri = 'mongodb://127.0.0.1:27017/client_briefing_test_browser_guard'
assert ci_database_uri(fixture_uri, 'true') == fixture_uri
for unsafe_uri, ci in [(fixture_uri, 'false'), ('mongodb://127.0.0.1:27017/pb_client_briefing', 'true'),
                       ('mongodb://example.invalid/client_briefing_test_browser_guard', 'true'),
                       ('mongodb://test:fake@127.0.0.1:27017/client_briefing_test_browser_guard', 'true')]:
    try:
        ci_database_uri(unsafe_uri, ci)
    except ValueError:
        pass
    else:
        raise AssertionError('Unsafe CI fixture URI accepted')
SERVICE_URI = ci_database_uri(os.environ.get('TEST_MONGODB_URI'), os.environ.get('CI'))


def unused_port():
    with socket.socket() as sock:
        sock.bind(('127.0.0.1', 0))
        return sock.getsockname()[1]


def wait_ready(port, child, path='/'):
    for _ in range(100):
        if child.poll() is not None:
            raise RuntimeError(f'Test server exited before readiness: port {port}')
        try:
            urllib.request.urlopen(f'http://127.0.0.1:{port}{path}', timeout=.5)
            return
        except Exception:
            time.sleep(.5)
    raise RuntimeError(f'Test server readiness timed out: port {port}')


children = []
logs = []
results = []
def deadline(*_):
    raise TimeoutError('Browser regression exceeded 300 seconds.')
signal.signal(signal.SIGALRM, deadline)
signal.alarm(300)
try:
    mongo_port, api_port, web_port = unused_port(), unused_port(), unused_port()
    env = {**os.environ, 'PORT': str(api_port), 'HOST': '127.0.0.1', 'ADMIN_TOKEN': TOKEN,
           'MONGODB_URI': SERVICE_URI or f'mongodb://127.0.0.1:{mongo_port}/browser_test',
           'API_PROXY_TARGET': f'http://127.0.0.1:{api_port}'}
    commands = [
        ['node', 'backend/index.js'],
        ['node', 'frontend/node_modules/vite/bin/vite.js', 'frontend', '--config', 'frontend/vite.config.js', '--port', str(web_port)],
    ]
    if not SERVICE_URI:
        dbpath = Path(tempfile.mkdtemp(prefix='browser-mongo-', dir=AUDIT))
        commands.insert(0, ['mongod', '--dbpath', str(dbpath), '--bind_ip', '127.0.0.1', '--port', str(mongo_port),
                            '--wiredTigerCacheSizeGB', '0.25', '--logpath', str(dbpath / 'mongod.log')])
    for index, command in enumerate(commands):
        log = open(AUDIT / f'browser-server-{index}.log', 'w')
        logs.append(log)
        child = subprocess.Popen(command, cwd=ROOT, env=env, stdout=log, stderr=log)
        children.append(child)
        if command[0] == 'mongod':
            for _ in range(100):
                if child.poll() is not None:
                    raise RuntimeError('Isolated MongoDB exited. See .audit/browser-server-0.log.')
                try:
                    with socket.create_connection(('127.0.0.1', mongo_port), timeout=.5):
                        break
                except OSError:
                    time.sleep(.5)
            else:
                raise RuntimeError('Isolated MongoDB startup timed out.')
        elif command[1] == 'backend/index.js':
            wait_ready(api_port, child, '/api/health')
        else:
            wait_ready(web_port, child)

    base = f'http://127.0.0.1:{web_port}'
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 900}, reduced_motion='reduce', has_touch=True)
        page = context.new_page()
        errors = []
        def record_error(error):
            errors.append(str(error))
            print('RUNTIME_ERROR:', error, flush=True)
        page.on('pageerror', record_error)
        page.on('console', lambda message: print('CONSOLE_ERROR:', message.text[:300], flush=True) if message.type == 'error' else None)
        page.on('response', lambda response: print('HTTP_ERROR:', response.status, response.url[:180], flush=True) if response.status >= 500 else None)
        def offline_assets(route):
            if route.request.url.startswith(base) or route.request.url.startswith('data:'):
                route.continue_()
            elif route.request.resource_type == 'image':
                route.fulfill(content_type='image/svg+xml', body='<svg xmlns="http://www.w3.org/2000/svg" width="760" height="430"><rect width="760" height="430" fill="#d9d5cb"/></svg>')
            else:
                route.abort()
        context.route('**/*', offline_assets)

        def visit(path):
            page.goto(base + path, wait_until='domcontentloaded')
            page.wait_for_load_state('networkidle')

        def audit(label):
            print('CHECK:', label, flush=True)
            page.add_script_tag(path=str(AXE))
            violations = page.evaluate("async () => (await axe.run(document, {runOnly: {type: 'tag', values: ['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v => ({id:v.id, impact:v.impact, nodes:v.nodes.map(n => n.target)}))")
            results.append({'check': label, 'axe_violations': violations})
            assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth + 1'), f'{label}: horizontal overflow'

        visit('/')
        page.get_by_role('button', name='Get started').click()
        page.locator('#a1').fill('Synthetic </title><script>window.auditXss=1</script>')
        page.locator('#a2').fill('Synthetic briefing browser test')
        page.locator('#a3').fill('Collect clear requirements')
        page.reload(wait_until='commit')
        page.get_by_role('button', name='Get started').click()
        expect(page.locator('#a2')).to_have_value('Synthetic briefing browser test')
        visual = page.locator('.visual-aid').first
        visual.focus()
        page.keyboard.press('Space')
        expect(page.get_by_role('dialog', name='Enlarged infographic')).to_be_visible()
        page.keyboard.press('Escape')
        expect(visual).to_be_focused()
        audit('brief-desktop-overview')
        page.screenshot(path=str(AUDIT / 'brief-desktop-viewport.png'))
        page.screenshot(path=str(AUDIT / 'brief-desktop.png'), full_page=True)
        page.get_by_role('button', name='Go to Q & A', exact=True).click()
        expect(page.locator('.brief-action-bar')).to_contain_text('6 sections remaining')
        page.get_by_role('button', name='Go to Overview', exact=True).click()
        results.append({'check': 'brief-navigation-counts-actual-visits', 'pass': True})
        for step in range(1, 8):
            page.get_by_role('button', name='Next →', exact=True).click()
            if step == 2:
                audit('brief-goals-labelled')
            text = page.locator('.section-body textarea').first
            if text.count():
                text.fill(f'Synthetic section {step+1} answer')
        page.get_by_role('button', name='Submit answers ✓', exact=True).click()
        expect(page.locator('#submitterEmail')).to_be_focused()
        page.locator('#submitterEmail').fill('invalid-email')
        page.get_by_role('button', name='Send my answers').click()
        expect(page.get_by_role('dialog')).to_be_visible()
        page.locator('#submitterEmail').fill('browser@example.invalid')
        audit('brief-submit-dialog')
        with page.expect_response(lambda response: response.url.endswith('/api/submissions') and response.request.method == 'POST') as receipt, context.expect_page() as popup:
            print('CHECK: brief-send-click', flush=True)
            page.get_by_role('button', name='Send my answers').click(no_wait_after=True)
        assert receipt.value.status == 201
        summary = popup.value
        expect(summary.locator('#mdContent')).to_contain_text('Synthetic section 8 answer')
        assert summary.evaluate('window.auditXss') is None, 'Summary HTML injection'
        summary.close()
        expect(page.get_by_role('heading', name='Brief submitted successfully!')).to_be_visible()
        results.append({'check': 'brief-submit-persistence-and-complete-escaped-summary', 'pass': True})

        for path, label in [('/client-question-guide', 'general'), ('/bayview-question-guide', 'bayview')]:
            visit(path)
            textarea = page.locator('textarea').first
            textarea.fill(f'Synthetic {label} guide answer')
            page.reload(wait_until='commit')
            page.wait_for_load_state('networkidle')
            try:
                expect(page.locator('textarea').first).to_have_value(f'Synthetic {label} guide answer')
            except AssertionError:
                print('RELOAD_STATE:', page.evaluate("({ready:document.readyState,url:location.href,text:document.body.innerText.slice(0,1200)})"), flush=True)
                raise
            if label == 'bayview':
                visual = page.locator('.visual-card').first
                visual.focus()
                page.keyboard.press('Space')
                expect(page.locator('.gif-lightbox')).to_be_visible()
                page.keyboard.press('Escape')
                expect(visual).to_be_focused()
                measurements = []
                for width in (320, 375):
                    page.set_viewport_size({'width': width, 'height': 812})
                    measurements.append(page.locator('#brief-summary').evaluate("""panel => {
                      const grid = panel.querySelector('.intro-grid');
                      const table = panel.querySelector('table');
                      const box = el => { const r=el.getBoundingClientRect(); return {left:r.left,right:r.right,width:r.width}; };
                      const cells = [...table.querySelectorAll('th,td')].map(cell => {
                        const range=document.createRange(); range.selectNodeContents(cell);
                        return {box:box(cell), text:[...range.getClientRects()].map(r => ({left:r.left,right:r.right}))};
                      });
                      const text=cells.flatMap(cell=>cell.text);
                      return {viewport:innerWidth, panel:box(panel), grid:box(grid),
                        columns:getComputedStyle(grid).gridTemplateColumns, firstChild:box(grid.firstElementChild),
                        table:box(table), textLeft:Math.min(...text.map(r=>r.left)), textRight:Math.max(...text.map(r=>r.right)),
                        textInsideCells:cells.every(cell=>cell.text.every(r=>r.left>=cell.box.left-1 && r.right<=cell.box.right+1))};
                    }"""))
                    table_area = page.get_by_role('region', name='Brief confirmation answers')
                    table_area.focus()
                    expect(table_area).to_be_focused()
                    top = table_area.bounding_box()['y']
                    page.keyboard.press('PageDown')
                    page.wait_for_function("before => document.querySelector('.brief-confirmation').getBoundingClientRect().top < before - 1", arg=top)
                    last_answer = table_area.locator('tbody td').last
                    last_answer.scroll_into_view_if_needed()
                    last_answer.tap()
                    expect(last_answer).to_contain_text('Projects section to be editable')
                    table_area.screenshot(path=str(AUDIT / f'bayview-brief-{width}.png'))
                    results.append({'check': f'bayview-brief-keyboard-touch-{width}', 'pass': True})
                print('BAYVIEW_GEOMETRY:', json.dumps(measurements), flush=True)
                assert all(m['panel']['right'] <= m['viewport'] + 1 and m['table']['left'] >= 0
                           and m['textRight'] <= m['viewport'] + 1 and m['textInsideCells'] for m in measurements), 'Brief confirmation text clips outside mobile viewport or cells'
                page.set_viewport_size({'width': 1280, 'height': 900})
            audit(f'{label}-desktop')
            page.screenshot(path=str(AUDIT / f'{label}-desktop-viewport.png'))
            page.screenshot(path=str(AUDIT / f'{label}-desktop.png'), full_page=True)
            page.set_viewport_size({'width': 375, 'height': 812})
            audit(f'{label}-mobile')
            page.screenshot(path=str(AUDIT / f'{label}-mobile-viewport.png'))
            page.screenshot(path=str(AUDIT / f'{label}-mobile.png'), full_page=True)
            page.get_by_role('button', name='Submit answers', exact=True).click()
            audit(f'{label}-dialog-mobile')
            page.keyboard.press('Escape')
            expect(page.get_by_role('dialog')).to_have_count(0)
            expect(page.get_by_role('button', name='Submit answers', exact=True)).to_be_focused()
            page.get_by_role('button', name='Submit answers', exact=True).click()
            page.locator('#guideSubmitterEmail').fill('browser@example.invalid')
            with page.expect_response(lambda response: response.url.endswith('/api/submissions') and response.request.method == 'POST') as receipt, context.expect_page() as popup:
                page.get_by_role('button', name='Send my answers').click(no_wait_after=True)
            assert receipt.value.status == 201
            expect(popup.value.locator('body')).to_contain_text(f'Synthetic {label} guide answer')
            popup.value.close()
            expect(page.locator('.guide-success')).to_be_visible()

            page.route('**/api/submissions', lambda route: route.fulfill(status=503, content_type='application/json', body='{"error":"Synthetic database outage."}'))
            page.evaluate('window.open = () => null')
            page.get_by_role('button', name='Submit answers', exact=True).click()
            with page.expect_download() as download:
                page.get_by_role('button', name='Send my answers').click()
            download.value.save_as(str(AUDIT / f'{label}-failed-summary.txt'))
            expect(page.locator('.guide-action-status')).to_contain_text('Submission not confirmed')
            expect(page.locator('.guide-action-status')).to_contain_text('downloaded')
            expect(page.locator('textarea').first).to_have_value(f'Synthetic {label} guide answer')
            page.unroute('**/api/submissions')
            page.set_viewport_size({'width': 1280, 'height': 900})
            results.append({'check': f'{label}-submit-reload-outage-and-blocked-popup-backup', 'pass': True})

        visit('/admin')
        page.locator('#admin-token').fill('wrong-token')
        page.get_by_role('button', name='Load submissions').click()
        expect(page.get_by_role('status')).to_contain_text('Admin token required')
        page.locator('#admin-token').fill(TOKEN)
        page.get_by_role('button', name='Load submissions').click()
        expect(page.locator('details')).to_have_count(3)
        audit('admin-desktop')
        page.screenshot(path=str(AUDIT / 'admin-desktop.png'), full_page=True)
        page.locator('summary').first.click()
        expect(page.locator('pre').first).to_contain_text('Synthetic')
        page.get_by_role('button', name='Sign out').click()
        expect(page.locator('details')).to_have_count(0)
        pending = []
        page.route('**/api/submissions', lambda route: pending.append(route))
        page.locator('#admin-token').fill(TOKEN)
        page.get_by_role('button', name='Load submissions').click(no_wait_after=True)
        expect(page.get_by_role('status')).to_contain_text('Loading submissions')
        for _ in range(20):
            if pending:
                break
            page.wait_for_timeout(50)
        assert pending, 'Delayed admin request must reach test route'
        page.get_by_role('button', name='Sign out').click()
        pending[0].fulfill(status=200, content_type='application/json', body=json.dumps({'submissions': [{
            '_id': 'synthetic-stale-response', 'title': 'Stale synthetic result', 'createdAt': '2026-10-12T00:00:00Z',
            'senderEmail': '', 'guideId': 'brief', 'summary': 'Synthetic stale result', 'questions': [],
        }], 'next': None}))
        page.wait_for_timeout(100)
        expect(page.locator('details')).to_have_count(0)
        expect(page.get_by_role('status')).to_contain_text('Signed out')
        page.unroute('**/api/submissions')
        results.append({'check': 'admin-signout-discards-pending-response', 'pass': True})
        page.set_viewport_size({'width': 375, 'height': 812})
        audit('admin-mobile')
        visit('/')
        page.get_by_role('button', name='Get started').click()
        audit('brief-mobile')
        page.screenshot(path=str(AUDIT / 'brief-mobile-viewport.png'))
        page.screenshot(path=str(AUDIT / 'brief-mobile.png'), full_page=True)
        assert not errors, f'Browser runtime errors: {errors}'
        failures = [r for r in results if r.get('axe_violations')]
        assert not failures, f'Accessibility failures: {json.dumps(failures)}'
        browser.close()
    print(json.dumps({'status': 'passed', 'checks': results, 'runtime_errors': errors}, indent=2))
finally:
    signal.alarm(0)
    (AUDIT / 'browser-results.json').write_text(json.dumps(results, indent=2))
    for child in reversed(children):
        if child.poll() is None:
            child.terminate()
            try:
                child.wait(timeout=10)
            except subprocess.TimeoutExpired:
                child.kill()
                child.wait()
    for log in logs:
        log.close()
