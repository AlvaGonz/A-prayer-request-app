# Findings - Overlap Analysis

## Source Repository
https://github.com/addyosmani/web-quality-skills

## Skills Installed
1. accessibility
2. core-web-vitals
3. performance
4. seo
5. best-practices
6. web-quality-audit

---

## Overlap Analysis

### Pair A: accessibility vs radix-ui-a11y

**Existing:** `radix-ui-a11y`
- Focus: Radix UI primitives (Dialog, Dropdown, Tabs, etc.)
- Scope: Component-level accessibility for specific library
- Content: Implementation patterns for Radix components

**New:** `accessibility`
- Focus: Global WCAG 2.2 compliance
- Scope: Site-wide accessibility principles
- Content: POUR principles, contrast ratios, keyboard navigation, screen readers

**Decision:** ✅ KEEP both - Complementary, not overlapping
- radix-ui-a11y = Component-specific (Radix primitives)
- accessibility = Global/site-wide (WCAG guidelines)

---

### Pair B: core-web-vitals vs pwa-runtime-caching

**Existing:** `pwa-runtime-caching`
- Focus: Vite PWA configuration
- Scope: Service Worker registration, manifest, offline behavior
- Content: Caching strategies, Workbox configuration

**New:** `core-web-vitals`
- Focus: Performance metrics measurement
- Scope: LCP, INP, CLS optimization
- Content: Metric thresholds, measurement techniques, optimization patterns

**Decision:** ✅ KEEP both - Complementary, not overlapping
- pwa-runtime-caching = SW implementation and caching
- core-web-vitals = Performance metrics and measurement

---

### Pair C: performance vs pwa-runtime-caching

**Existing:** `pwa-runtime-caching`
- Focus: Service Worker and runtime caching
- Scope: SW registration, cache strategies, offline experience
- Content: Cache-first, network-first strategies

**New:** `performance`
- Focus: General web performance optimization
- Scope: Bundle size, image optimization, critical CSS, font loading
- Content: Code splitting, lazy loading, compression

**Decision:** ✅ KEEP both - Complementary, not overlapping
- pwa-runtime-caching = Caching layer (SW)
- performance = Asset optimization and delivery

---

### Pair D: web-quality-audit vs planning-with-files

**Existing:** `planning-with-files`
- Focus: File-based planning architecture
- Scope: Project planning methodology
- Content: Task planning, session logs, Manus-style workflows

**New:** `web-quality-audit`
- Focus: Lighthouse-based quality auditing
- Scope: Performance, accessibility, SEO, best practices checks
- Content: Audit categories, severity levels, reporting structure

**Decision:** ✅ KEEP both - Completely different domains
- planning-with-files = Project management methodology
- web-quality-audit = Technical quality assessment

---

### Pair E: best-practices vs express-api-hardening

**Existing:** `express-api-hardening`
- Focus: Express.js API security
- Scope: Backend route and middleware hardening
- Content: Input validation, rate limiting, helmet configuration

**New:** `best-practices`
- Focus: General web development best practices
- Scope: Frontend security, browser compatibility, code quality
- Content: CSP headers, HTTPS, modern APIs, deprecated features

**Decision:** ✅ KEEP both - Different scopes
- express-api-hardening = Backend API security
- best-practices = Frontend/general web standards

---

### Pair F: seo vs i18n-translation-integrity

**Existing:** `i18n-translation-integrity`
- Focus: i18next dictionary management
- Scope: Translation key validation, integrity checks
- Content: Translation workflows, key parity

**New:** `seo`
- Focus: Search engine optimization
- Scope: Meta tags, structured data, crawlability
- Content: robots.txt, sitemaps, JSON-LD, hreflang

**Decision:** ✅ KEEP both - Completely different domains
- i18n-translation-integrity = Translation management
- seo = Search visibility optimization

---

## Summary

| New Skill | Existing Skills | Overlap? | Decision |
|-----------|-----------------|----------|----------|
| accessibility | radix-ui-a11y | No | Keep both |
| core-web-vitals | pwa-runtime-caching | No | Keep both |
| performance | pwa-runtime-caching | No | Keep both |
| seo | i18n-translation-integrity | No | Keep both |
| best-practices | express-api-hardening | No | Keep both |
| web-quality-audit | planning-with-files | No | Keep both |

**Conclusion:** No duplicate skills detected. All 6 new skills address different concerns and complement the existing skill set.

---

# Findings - Bug Fixes

## [BUG-001] Language Dropdown Clipped by Header

**Root Cause:** `.language-theme-menu` uses `position: absolute` inside the Header DOM tree. The Header's `z-index` and potential `overflow` properties create a stacking context that clips the dropdown.

**Fix Applied:**
1. Replaced `position: absolute` with React Portal mounting to `document.body`
2. Menu now uses `position: fixed` with viewport-relative coordinates
3. Added `z-index: 9999` to ensure menu renders above all other elements
4. Calculated position based on trigger's `getBoundingClientRect()`

**Files Modified:**
- `prayer-board/src/components/ui/theme.jsx`
- `prayer-board/src/components/ui/theme.css`

**Verification:**
- ✅ Dropdown renders outside Header DOM tree
- ✅ Menu follows trigger position on scroll
- ✅ No clipping on mobile devices

---

## [BUG-002] Notification Permission Blocked on Android Chrome

**Root Cause:** Android Chrome blocks `Notification.requestPermission()` when called from inside a `position: fixed` overlay element. The NotificationBanner is a fixed banner at the bottom of the screen, triggering the "Close any bubbles" error.

**Fix Applied:**
1. Dismiss banner BEFORE calling `Notification.requestPermission()`
2. Wait for animation frame + 100ms delay to ensure DOM removal
3. Removed `isLoading` state as the banner dismisses immediately
4. Permission request happens after banner is unmounted

**Files Modified:**
- `prayer-board/src/components/NotificationBanner.jsx`

**Verification:**
- ✅ Banner hides before permission dialog appears
- ✅ No "Close any bubbles" error on Android Chrome
- ✅ Graceful handling of granted/denied states

---

# Architectural Debt

## [DEBT-001] JWT Storage in localStorage — XSS Surface

**Keys affected:** `prayerBoard_user`, `prayerBoard_token`

**Risk level:** Medium (standard SPA pattern, but raw JS-readable)

**Description:**
The application stores JWT tokens in `localStorage`, which is accessible to any JavaScript running on the page. This creates a potential XSS vulnerability where a malicious script could steal the token.

**Mitigation in scope:** None — httpOnly cookie migration requires full backend auth re-write (out of scope for this UI audit)

**Current mitigations:**
- Sentry error monitoring active (detects anomalous behavior)
- CSP headers should be added to prevent inline script injection (future task: configure CSP on Express server)

**Resolution path:**
When backend auth is refactored, migrate to httpOnly + Secure + SameSite=Strict cookies. This would require:
1. Backend cookie-based session management
2. CSRF protection implementation
3. Frontend auth flow refactoring

**Owner:** Adrian — flagged 2026-03-13

**References:**
- [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [MDN HttpOnly Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies)
