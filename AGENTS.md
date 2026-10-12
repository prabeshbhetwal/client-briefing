# Client Briefing

- React 18/Vite frontend in `frontend/`; Express/Mongoose API in `backend/`.
- Routes: `/`, `/client-question-guide`, `/bayview-question-guide`; preserve existing briefing questions and browser draft keys.
- Run commands from this repository root. Install with `npm ci --prefix frontend` and `npm ci --prefix backend`.
- Keep database credentials and admin tokens server-side in ignored `backend/.env`; never use `VITE_` variables for secrets.
- Verify submission, validation, failure recovery and accessible keyboard/mobile flows before claiming readiness.
- Tests must use an isolated MongoDB instance and synthetic submissions. Never clear an existing database or browser profile.
- CI uses MongoDB 7 with separate `client_briefing_test_` databases for API/browser steps. `TEST_MONGODB_URI` is CI-only and must never point at application data. `Readiness` runs exact-head acceptance and post-merge checks.
- No CodeGraph index or Graphify report exists at initial audit; do not generate an index just for review.
- Do not send live emails during tests. Existing client-specific guide content requires confirmed publication permission.
