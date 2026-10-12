import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import net from 'node:net';
import { mkdir, mkdtemp } from 'node:fs/promises';
import mongoose from '../backend/node_modules/mongoose/index.js';
import { app, Submission } from '../backend/app.js';
import { loadDraft, saveSubmission } from '../frontend/src/submissions.js';

let mongo, server, base, mongoUri;
function ciDatabaseUri(value, ci) {
  if (!value) return null;
  let uri;
  try { uri = new URL(value); } catch { throw new Error('Invalid isolated CI database URI.'); }
  if (ci !== 'true' || uri.protocol !== 'mongodb:' || !['127.0.0.1', 'localhost'].includes(uri.hostname)
    || !/^\/client_briefing_test_[a-z\d_-]+$/i.test(uri.pathname)
    || uri.username || uri.password || uri.search || uri.hash) {
    throw new Error('External test MongoDB requires CI, loopback and a named fixture database.');
  }
  return value;
}
const serviceUri = ciDatabaseUri(process.env.TEST_MONGODB_URI, process.env.CI);
const token = 'synthetic-test-admin-token-32-characters';
const payload = {
  guideId: 'brief', title: 'Synthetic test brief', senderEmail: 'test@example.invalid',
  date: '12 October 2026', questions: [{ id: 'A1', section: 'Overview', question: 'Business?', answer: 'Synthetic business' }],
  summary: 'Synthetic business — API test only',
};

before(async () => {
  process.env.ADMIN_TOKEN = token;
  await mkdir('.audit', { recursive: true });
  mongoUri = serviceUri;
  if (serviceUri) {
    await mongoose.connect(serviceUri, { serverSelectionTimeoutMS: 5000 });
  } else {
    const dbpath = await mkdtemp(`${process.cwd()}/.audit/api-mongo-`);
    const socket = net.createServer();
    socket.listen(0, '127.0.0.1');
    await once(socket, 'listening');
    const port = socket.address().port;
    await new Promise(resolve => socket.close(resolve));
    mongo = spawn('mongod', ['--dbpath', dbpath, '--bind_ip', '127.0.0.1', '--port', String(port), '--wiredTigerCacheSizeGB', '0.25', '--logpath', `${dbpath}/mongod.log`], { stdio: 'ignore' });
    mongo.on('error', () => {});
    mongoUri = `mongodb://127.0.0.1:${port}/briefing_test`;
    for (let attempt = 0; ; attempt++) {
      try { await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 300 }); break; }
      catch { if (attempt === 150 || mongo.exitCode !== null) throw new Error('Isolated MongoDB could not start. Install mongod; no existing database is used.'); }
    }
  }
  server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server) await new Promise(resolve => server.close(resolve));
  await mongoose.disconnect();
  if (mongo && mongo.exitCode === null) { const exited = once(mongo, 'exit'); mongo.kill('SIGTERM'); await exited; }
});

function post(body, headers = { 'Content-Type': 'application/json' }) {
  return fetch(`${base}/api/submissions`, { method: 'POST', headers, body: JSON.stringify(body) });
}

test('CI fixture guard rejects application databases, remote hosts and credentials', () => {
  const fixture = 'mongodb://127.0.0.1:27017/client_briefing_test_api_123';
  assert.equal(ciDatabaseUri(fixture, 'true'), fixture);
  for (const [uri, ci] of [[fixture, 'false'], ['mongodb://127.0.0.1:27017/pb_client_briefing', 'true'],
    ['mongodb://example.invalid/client_briefing_test_api_123', 'true'],
    ['mongodb://test:fake@127.0.0.1:27017/client_briefing_test_api_123', 'true']]) {
    assert.throws(() => ciDatabaseUri(uri, ci), /requires CI/);
  }
});

test('health reflects connected database', async () => {
  const response = await fetch(`${base}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ready' });
});

test('valid submission persists; public response exposes only receipt', async () => {
  const response = await post({ ...payload, createdAt: '1990-01-01', unexpected: 'ignore' });
  assert.equal(response.status, 201);
  const receipt = await response.json();
  assert.deepEqual(Object.keys(receipt).sort(), ['id', 'message']);
  const saved = await Submission.findById(receipt.id).lean();
  assert.equal(saved.summary, payload.summary);
  assert.equal(saved.questions[0].answer, payload.questions[0].answer);
  assert.ok(saved.createdAt.getFullYear() > 1990);
  assert.equal(saved.unexpected, undefined);
});

test('admin denies missing, incorrect and Unicode tokens', async () => {
  for (const headers of [{}, { Authorization: 'Bearer wrong' }, { Authorization: 'Bearer é'.repeat(20) }]) {
    assert.equal((await fetch(`${base}/api/submissions`, { headers })).status, 401);
  }
});

test('admin reads persisted records with bounded cursor pagination', async () => {
  await post({ ...payload, title: 'Synthetic second record' });
  const headers = { Authorization: `Bearer ${token}` };
  const response = await fetch(`${base}/api/submissions?limit=1`, { headers });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  const page = await response.json();
  assert.equal(page.submissions.length, 1);
  assert.equal(page.submissions[0].title, 'Synthetic second record');
  const next = await (await fetch(`${base}/api/submissions?limit=1&before=${page.next}`, { headers })).json();
  assert.notEqual(next.submissions[0]._id, page.submissions[0]._id);
  for (const query of ['limit=0', 'limit=51', 'limit=no', 'before=invalid']) {
    assert.equal((await fetch(`${base}/api/submissions?${query}`, { headers })).status, 400);
  }
});

test('unconfigured admin fails closed', async () => {
  process.env.ADMIN_TOKEN = '';
  assert.equal((await fetch(`${base}/api/submissions`)).status, 503);
  process.env.ADMIN_TOKEN = token;
});

test('rejects invalid guides, email, malformed questions, blank answers and duplicate ids', async () => {
  const invalid = [null, {}, { ...payload, guideId: 'admin' }, { ...payload, senderEmail: 'not-email' },
    { ...payload, title: 'x'.repeat(201) }, { ...payload, questions: [] },
    { ...payload, questions: [{ ...payload.questions[0], answer: {} }] },
    { ...payload, questions: [{ ...payload.questions[0], answer: ' ' }] },
    { ...payload, questions: [payload.questions[0], payload.questions[0]] }];
  for (const body of invalid) assert.equal((await post(body)).status, 400);
});

test('rejects wrong content type, malformed JSON and oversized body', async () => {
  assert.equal((await post(payload, { 'Content-Type': 'text/plain' })).status, 415);
  assert.equal((await fetch(`${base}/api/submissions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' })).status, 400);
  assert.equal((await post({ ...payload, summary: 'x'.repeat(300000) })).status, 413);
});

test('stored drafts ignore invalid field types and recover from malformed JSON', () => {
  const initial = { text: '', choices: [], checked: false };
  globalThis.localStorage = { getItem: () => '{"text":123,"choices":"bad","checked":{},"extra":"ignore"}' };
  assert.deepEqual(loadDraft('test', initial), initial);
  localStorage.getItem = () => 'null';
  assert.deepEqual(loadDraft('test', initial), initial);
  localStorage.getItem = () => '{';
  assert.deepEqual(loadDraft('test', initial), initial);
  localStorage.getItem = () => '{"text":"restored","choices":["one"],"checked":true}';
  assert.deepEqual(loadDraft('test', initial), { text: 'restored', choices: ['one'], checked: true });
  delete globalThis.localStorage;
});

test('frontend surfaces failed save responses', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: false, json: async () => ({ error: 'Database unavailable.' }) });
  try { await assert.rejects(saveSubmission(payload), /Database unavailable/); }
  finally { globalThis.fetch = original; }
});

test('documented development manager starts both servers and stops its children', async () => {
  const ports = [];
  for (let i = 0; i < 2; i++) {
    const socket = net.createServer();
    socket.listen(0, '127.0.0.1');
    await once(socket, 'listening');
    ports.push(socket.address().port);
    await new Promise(resolve => socket.close(resolve));
  }
  const manager = spawn(process.execPath, ['scripts/dev.js'], { stdio: 'ignore', env: {
    ...process.env, MONGODB_URI: mongoUri, PORT: String(ports[0]), FRONTEND_PORT: String(ports[1]),
    API_PROXY_TARGET: `http://127.0.0.1:${ports[0]}`,
  } });
  try {
    for (const [index, path] of ['/api/health', '/'].entries()) {
      let ready = false;
      for (let attempt = 0; attempt < 80; attempt++) {
        try { ready = (await fetch(`http://127.0.0.1:${ports[index]}${path}`, { signal: AbortSignal.timeout(500) })).ok; } catch { /* starting */ }
        if (ready) break;
        await new Promise(resolve => setTimeout(resolve, 250));
      }
      assert.ok(ready, `Development server on port ${ports[index]} must start`);
    }
  } finally {
    if (manager.exitCode === null) {
      const exited = once(manager, 'exit');
      manager.kill('SIGTERM');
      await exited;
    }
  }
  for (const port of ports) await assert.rejects(fetch(`http://127.0.0.1:${port}/`, { signal: AbortSignal.timeout(1000) }));
});

test('database disconnect returns immediate 503 without accepting a write', async () => {
  await mongoose.disconnect();
  assert.equal((await fetch(`${base}/api/health`)).status, 503);
  assert.equal((await post(payload)).status, 503);
});
