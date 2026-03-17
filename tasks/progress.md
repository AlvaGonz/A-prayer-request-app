# Adversarial Security Audit – Session Log

**Session:** 2026-03-13  
**Objective:** Apply 5 adversarial hardening fixes to reduce attack surface

---

## Phase 1: Planning (COMPLETE)
- [x] Read all context files (server.js, authController.js, auth.js, User.js, package.json)
- [x] Created task_plan.md with checkboxes
- [x] Created findings.md with audit section
- [x] Created progress.md (this file)

## Phase 2: Implementation (COMPLETE)

### ADV-001: JWT Hardening ✅
- **Files:** authController.js, middleware/auth.js
- **Changes:**
  - JWT expiry: 30d → 1d
  - Added explicit algorithm: 'HS256' to jwt.sign
  - Added algorithms: ['HS256'] to both protect() and optionalAuth() middleware

### ADV-002/003: CSP Enforcement ✅
- **Files:** server.js
- **Changes:**
  - Removed reportOnly: true (CSP now enforced)
  - Removed 'unsafe-inline' from script-src
  - Added frame-src, object-src, base-uri, form-action directives
  - Added HSTS, referrerPolicy, xFrameOptions helmet options

### ADV-004: Body Size Limit ✅
- **Files:** server.js
- **Changes:**
  - express.json limit: 10mb → 50kb
  - express.urlencoded limit: 10mb → 50kb

### ADV-005: CORS Restriction ✅
- **Files:** server.js
- **Changes:**
  - No-origin requests blocked in production
  - Dev mode allows no-origin for testing

### ADV-006: Request ID Middleware ✅
- **Files:** server.js
- **Changes:**
  - Added crypto.randomUUID() import
  - Added request ID middleware (sets req.requestId and X-Request-ID header)
  - Updated error handler to log request ID

---

## E2E & SW Fixes – 2026-03-17

### Fix 1: RegisterPage.jsx – Add `name` attributes + confirmPassword field ✅
**Root Cause:** Playwright locates form inputs by `name` attribute. The inputs only had `id`, not `name`. Test expected `name="confirmPassword"` which didn't exist.

**Changes:**
- Added `name="displayName"` to display name input
- Added `name="email"` to email input  
- Added `name="password"` to password input
- Added `confirmPassword` state variable
- Added password match validation before submit
- Added confirmPassword input field (no toggle, simpler than password field)

**File:** `prayer-board/src/pages/RegisterPage.jsx`

### Fix 2: answered_flow.spec.js – Update selectors + force locale ✅
**Root Cause:** Test had selector fragility and used hardcoded Spanish text without ensuring locale.

**Changes:**
- Added `page.addInitScript()` to force `i18nextLng: 'es'` in localStorage
- Added `page.waitForLoadState('networkidle')` after goto('/register') for hydration

**File:** `prayer-board/e2e/answered_flow.spec.js`

### Fix 3: main.jsx – SW unhandled rejection handler ✅
**Root Cause (Sentry ADV-SW-001):** `navigator.serviceWorker.register()` Promise rejection in bot/crawler contexts caused unhandled errors.

**Changes:**
- Added global `unhandledrejection` event listener
- Filters SW-related rejections and prevents Sentry capture
- Logs warning instead of throwing

**File:** `prayer-board/src/main.jsx`

---

## E2E Fixes – 2026-03-17 (Round 2)

### Fix 4: RegisterPage.jsx – Full rewrite with confirmPassword ✅
**Root Cause Chain:** 
1. Form had validation logic for `confirmPassword` 
2. But UI field was missing → form validation failed silently
3. No `name` attributes → Playwright couldn't find fields
4. Missing `autoComplete` → poor accessibility

**Changes:**
- Added `confirmPassword` state with useState('')
- Added password match validation BEFORE regex validation
- Added `name` attributes to ALL inputs (displayName, email, password, confirmPassword)
- Added confirmPassword field WITHOUT show/hide toggle (standard UX pattern)
- Added `autoComplete="new-password"` for accessibility

**File:** `prayer-board/src/pages/RegisterPage.jsx`

### Fix 5: auth.spec.js – Add confirmPassword fill ✅
**Root Cause Chain:**
1. Test filled 3 fields (displayName, email, password)
2. RegisterPage now validates 4 fields
3. confirmPassword defaulted to '' → password !== '' → submit blocked → no redirect

**Changes:**
- Added `await page.fill('#confirmPassword', password);` after password fill

**File:** `prayer-board/e2e/auth.spec.js`

### Fix 6: answered_flow.spec.js – Fix .mark-answered selector ✅
**Root Cause Chain:**
1. `.mark-answered` class does NOT exist directly in `.prayer-card`
2. `<RippleMarkAnsweredButton>` only renders when `isAuthor === true`
3. `isAuthor = request.author === user?.id` requires string-equal comparison
4. Without `data-testid`, tests were fragile to CSS class changes

**Changes (Part A - RippleMarkAnsweredButton.jsx):**
- Added `data-testid="mark-answered-btn"` to RippleButton element

**Changes (Part B - PrayerRequestCard.jsx):**
- Added `data-testid="save-testimony-btn"` to save testimony button

**Changes (Part C - answered_flow.spec.js):**
- Added `await page.waitForTimeout(1500)` for card render completion
- Changed selector to `[data-testid="mark-answered-btn"]` with 10s timeout
- Changed save button selector to `[data-testid="save-testimony-btn"]`

**Files:**
- `prayer-board/src/components/RippleMarkAnsweredButton.jsx`
- `prayer-board/src/components/PrayerRequestCard.jsx`
- `prayer-board/e2e/answered_flow.spec.js`

### Fix 7: i18n Translations – Add confirmPassword keys ✅
**Root Cause:** 
- Translation keys `auth.confirmPassword` and `auth.confirmPasswordPlaceholder` were missing
- UI showed raw translation keys instead of human-readable text

**Changes:**
- Added `auth.confirmPassword`: "Confirm Password" / "Confirmar Contraseña"
- Added `auth.confirmPasswordPlaceholder`: "Repeat your password" / "Repite tu contraseña"
- Added `auth.errors.passwordsDoNotMatch`: "Passwords do not match" / "Las contraseñas no coinciden"

**Files:**
- `prayer-board/src/i18n/locales/en.json`
- `prayer-board/src/i18n/locales/es.json`

---

## Summary
All 5 adversarial hardening fixes + 6 E2E/SW fixes have been successfully applied:
1. JWT expiry reduced to 1 day with explicit HS256 algorithm
2. CSP is now enforced (no longer report-only)
3. 'unsafe-inline' removed from CSP
4. Body size limit reduced to 50KB
5. CORS no-origin requests blocked in production
6. X-Request-ID added for audit trail
7. RegisterPage has proper `name` attributes and confirmPassword field
8. E2E test forces Spanish locale and waits for hydration
9. SW unhandled rejection silenced for bot contexts
10. auth.spec.js fills confirmPassword field
11. answered_flow.spec.js uses data-testid selectors
12. RippleMarkAnsweredButton has data-testid
13. PrayerRequestCard save button has data-testid
14. Added i18n translations for confirmPassword (EN + ES)
