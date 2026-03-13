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

---

# Task Plan - Card Footer Fixes

## Bug List

- [x] **BUG 1**: "Yo Oro" count and heart icon overlap
  - [x] Reduce gap in button content (6px → 4px)
  - [x] Change min-width from 100px to 0 for flex shrinking
  - [x] Reduce font sizes for better fit
  - [x] Add flex-shrink properties

- [x] **BUG 2**: RippleShareButton renders invisible (ghost button)
  - [x] Add width: 100% to all Ripple buttons
  - [x] Ensure display: flex (not inline-flex) in footer context
  - [x] Add proper min-width: 0 for flex containers
  - [x] Ensure ripple-button-content fills width

- [x] **BUG 3**: Ripple buttons animations not visible
  - [x] Added purple CSS variables (--color-accent-purple, --color-accent-purple-hover, etc.)
  - [x] Added green CSS variables (--color-accent-green, --color-accent-green-hover, etc.)
  - [x] Verified @keyframes rippling exists in RippleButton.css and index.css

- [x] **BUG 4**: Full responsive audit of footer buttons
  - [x] Desktop (≥1024px): Equal flex distribution with gap: 8px
  - [x] Tablet (769px–1023px): Reduced gap: 6px
  - [x] Small tablet (601px–768px): Proper padding and font sizes
  - [x] Mobile (≤600px): Grid layout with proper spanning
  - [x] All buttons maintain min-height: 44px minimum

## Implementation Summary

**Files Modified:**
1. `prayer-board/src/components/PrayerRequestCard.css` - Main footer layout and responsive styles
2. `prayer-board/src/components/PrayedButton.css` - Removed absolute positioning, added flex layout
3. `prayer-board/src/components/RipplePrayedButton.css` - Fixed overlap, improved responsive text
4. `prayer-board/src/components/RippleShareButton.css` - Added full width, responsive text
5. `prayer-board/src/components/RippleCommentButton.css` - Added full width, responsive text
6. `prayer-board/src/components/RippleMarkAnsweredButton.css` - Added full width, responsive text
7. `prayer-board/src/styles/themes.css` - Added purple/green theme variables

**Commit:** 9cae603e6bccaeb6abd083d79caec9c411d8a87f
