# Local Development Environment Setup Plan

## Phase 1: Environment Variables
- [ ] Create `prayer-board/.env.local` containing `VITE_API_URL=http://localhost:5000`
- [ ] Create `prayer-board/server/.env` containing backend dev variables (MONGODB_URI, PORT, JWT_SECRET, FRONTEND_URL).
- [ ] Add `.env.local` to `.gitignore` to prevent secret leaks.

## Phase 2: Server Dev Scripts
- [ ] Update `prayer-board/server/package.json` with `"dev": "node --watch server.js"`.

## Phase 3: CORS Fixes
- [ ] Modify `prayer-board/server/server.js` to ensure `http://localhost:5173` is explicitly whitelisted in `allowedOrigins`.

## Phase 4: Test DB (Mongo Memory Server)
- [x] Create `prayer-board/server/tests/setup.js` to spawn and tear down `mongodb-memory-server` around tests.
- [x] Update `prayer-board/server/vitest.config.js` to use `setupFiles: ['./tests/setup.js']`.

## Phase 5: Concurrent Runner
- [x] Install `concurrently` in `prayer-board`.
- [x] Add `"dev"`, `"dev:server"`, and `"dev:client"` scripts in `prayer-board/package.json` to spawn both node instances natively.

## Phase 6: Seed Script
- [x] Create `prayer-board/server/seed.js` script to clear and inject baseline development data into the local DB.
- [x] Add `"seed": "node seed.js"` script to `prayer-board/server/package.json`.

## Phase 7: Verification
- [x] Execute `npm run dev` to verify concurrent spin-up.
- [x] Run `npm test` verifying db-memory integration logs.
## Phase 8: Anonymous Posts Bug Fix
- [x] Inject `optionalAuth` middleware into `server/middleware/auth.js`.
- [x] Bind `optionalAuth` to the public `POST /api/requests` endpoint to unpack JWTs.
- [x] Unpack explicit boolean `isAnonymous` in `requestController.js` and map it strictly to MongoDB without falling back to defaulting `true` unless `undefined`.

## Phase 9: Frontend Generic Error Handling Audit
- [x] Audit and patch `NewPrayerRequestForm.jsx` generic `try/catch` block for 429 rate limit errors.
- [x] Audit and patch `CommentSection.jsx` generic `try/catch` block for 429 rate limit errors.
- [x] Audit and patch `PrayedButton.jsx` generic `try/catch` block for 429 rate limit errors.

## Phase 10: Playwright E2E Setup
- [x] Install Playwright (`@playwright/test`) and initialize config.
- [x] Create E2E test file for Auth workflows including Rate Limiting behavior.
