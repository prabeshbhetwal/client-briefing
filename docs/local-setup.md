# Local setup and verification

Requires Node 22+, npm and `mongod` on PATH. Run every command from the repository root:

```bash
cd '/Users/prabeshbhetwal/Desktop/Files/Development/Project/Client-Briefing'
npm ci --prefix frontend
npm ci --prefix backend
cp -n backend/.env.example backend/.env
```

Preserve an existing `.env`. Generate a random token using `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`, paste it into `ADMIN_TOKEN`. A missing token or fewer than 32 characters disables admin access. Tokens must remain server-side, never in `VITE_` variables, source or Git. Atlas is optional only when its account and costs are already approved.

## Run and stop

Check port ownership before starting. Use your configured MongoDB, or start a new dedicated local instance in a separate terminal:

```bash
mkdir -p .local-data
mongod --dbpath "$PWD/.local-data" --bind_ip 127.0.0.1 --port 27017
```

Never clear existing database files. Start the app in another terminal:

```bash
npm run dev
```

Open `http://127.0.0.1:5173`. Routes: `/`, `/client-question-guide`, `/bayview-question-guide`, `/admin`. API health: `http://127.0.0.1:5001/api/health`. Startup fails when MongoDB is unavailable; Vite fails on port conflicts. `Ctrl+C` stops both application children. Stop your separately started MongoDB with `Ctrl+C` in its own terminal. No data is removed.

For an isolated alternate port, set `FRONTEND_PORT` and `PORT`; set `API_PROXY_TARGET` to the corresponding backend URL. Tests use this route to avoid occupying another project's ports.

Review tokens stay in page memory. Use a trusted device and sign out after review. The admin list supports older-record pagination; it cannot edit or delete submissions.

## Automated checks

```bash
npm test
npm run build
```

API tests start an isolated MongoDB instance on a temporary port, with synthetic data in ignored `.audit/`. No existing database is used. They cover persistence, auth, pagination, invalid/oversized requests, corrupt drafts and outages. Initial MongoDB setup can take 30–50 seconds on a busy machine.

Browser checks use test-only Python Playwright and frontend axe-core:

```bash
python3 -m venv .audit-venv
.audit-venv/bin/pip install playwright==1.63.0
PLAYWRIGHT_BROWSERS_PATH="$PWD/.audit/browsers" .audit-venv/bin/python -m playwright install chromium
npm run test:browser
```

Browser tests own isolated MongoDB/API/Vite processes, browser storage and dynamic ports. They check forms, mobile/desktop layouts, complete exports, admin review, email validation, dialogs, blocked pop-ups, outages and axe WCAG rules. Evidence stays in `.audit/`; fixtures are retained, ignored by Git. External image requests use offline placeholders, so screenshots represent layout and live image availability is not certified.

## Hosting and privacy

`npm run build` creates `frontend/dist`. Static preview alone cannot save submissions: deployed sites need `/api` routed to the backend, MongoDB, HTTPS, a server-only admin token and an explicit `FRONTEND_ORIGIN`. Use `HOST=0.0.0.0` only behind a configured host/proxy. Configure backup/retention and abuse controls before public intake. No hosting or deployment is included.

Drafts stay in unencrypted browser local storage. Submitted answers remain in MongoDB for authorised review. No email is sent automatically; confirmation means database persistence, not developer notification. A timed-out request may have saved before its response was lost; avoid repeated submissions without checking admin review.

Unsplash images load from a third party. Bayview guide retains existing client-specific planning content: confirm publication permission before using it as a public example. Older public Git history contains client contact/configuration details; this audit does not rewrite history or certify consent. Shared-device use and public intake require an appropriate data-handling policy.
