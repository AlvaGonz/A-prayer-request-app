# Research & Discoveries (from local)

## T1: Dark Mode System
- **Discovery**: `ThemeContext.jsx` already had a mature implementation of system dark/light mode preference (`matchMedia`), as well as correct precedence for local storage preference.
- **Action**: Verified functionality solely through robust frontend unit tests using mocking in Vitest, bypassing the need for implementation edits.

## T2: Answered Prayers Section
- **Discovery**: `NewPrayerRequestForm.jsx` accepts explicit `isAnonymous` booleans but the backend default fallback mechanism instantly overrides explicit checks if the user is unauthenticated. By migrating to a generic parser, it properly reads the user input directly.

### Frontend Generic Error Audit (429 Rate Limits)
**Discovery**: The `NewPrayerRequestForm.jsx`, `CommentSection.jsx`, and `PrayedButton.jsx` components handle API calls asynchronously but process the returned `catch (error)` entirely blindly. If the rate limit (`authLimiter`, `prayerLimiter`) hits, it swallows the `HTTP 429` Status Exception and maps it to a generic `"Something went wrong"` translation text. We must intercept `err.statusCode === 429` precisely as we retrofitted in `LoginPage.jsx`.

### Insecure Defaults Scan
**Discovery**: Searched for fallbacks across `process.env`, `localStorage` and `import.meta.env`. Current configuration persists the raw JWT directly inside `localStorage` instead of leveraging `httponly` persistent cookies. This is technically an insecure SPA default rendering standard React apps highly susceptible to raw XSS extraction. Noting this as architectural debt since an `httpOnly` cookie migration warrants a full backend rewrite.

## T3: Adversarial Audit
- **Discovery**: A full-text grep regex search (`\brezo\b|\brezar\b|\brezando\b|\brezos\b`) across all `src/` files returned **zero** occurrences on frontend source files.
- **Action**: Wrote an explicit integration unit test for `en.json` and `es.json` to lock in key-parity and guarantee none of those words slide into our Spanish catalog.

## T4: Optimistic Comments
- **Discovery**: `useComments.js` currently uses `useMutation` for `useCreateComment` but only invalidates Queries upon `onSuccess`. There is NO optimistic query updating (`onMutate` with rollback via `onError`).
- **Action**: Wrote `CommentSection.test.jsx` that fails or asserts expectations of immediate inputs clearing and pending elements rendering.
- `tests/setup.js` successfully isolates DB runs
- Found that seeding script requires string mapping alignments for Enums and referencing fields natively in Mongo.

### Phase 8: Anonymous Bug
- **Bug**: `POST /api/requests` was mapped to public access without any auth middleware passing. `req.user` remained unconditionally undefined.
- **Fix**: Wrote an `optionalAuth` middleware inside `auth.js` that unpacks JWTs gently for public routes. Adjusted `requestController.js` to strictly parse the destructuring without unconditionally mapping to boolean constants.
- **Answered Prayers Module**: It natively requires an authenticated `user.id`. Anonymous authors intrinsically do not own an immutable ID tied to their submissions in the DOM context, preserving the system boundaries successfully.

## T5: Network-First Strategy
- **Discovery**: `vite.config.js` is perfectly configured for Workbox `NetworkFirst` cache handlers towards `/api/*`. However, `usePrayerRequests.js` defaults to standard fetching states.
- **Action**: Need to enforce `staleTime: 0`, and manual `refetchOnWindowFocus/refetchOnMount` to be highly reactive, simulating network-first data invalidation.

---

# Findings - Root Cause Analysis (from origin/develop)

## BUG 1: "Yo Oro" count and heart icon overlap

**Files affected:**
- `prayer-board/src/components/RipplePrayedButton.jsx` (lines 148-158)
- `prayer-board/src/components/RipplePrayedButton.css` (lines 10-20)

**Root Cause:**
The RipplePrayedButton component renders the heart icon, count, and label stack inline within the button content. The layout uses `display: flex` with `gap: 6px` at line 14 of RipplePrayedButton.css, but the issue is that the `.prayed-label-stack` has `white-space: nowrap` with `overflow: hidden` and `text-overflow: ellipsis` at line 69-71.

The actual overlap seen in the screenshot is due to insufficient horizontal space causing text truncation to overlap with the count. The `min-width: 100px` is not sufficient for the full "YO ORO" text plus count.

**Fix Strategy:**
1. Increase `min-width` for the button
2. Reduce gap slightly to fit content better
3. Ensure proper flex shrinking behavior

---

## BUG 2: RippleShareButton renders invisible

**Files affected:**
- `prayer-board/src/components/RippleShareButton.jsx`
- `prayer-board/src/components/RippleShareButton.css`
- `prayer-board/src/components/PrayerRequestCard.css` (lines 145-156)

**Root Cause:**
RippleShareButton renders correctly with proper content (Share2 icon + "Compartir"/"Share" text). The issue is in PrayerRequestCard.css:
- Line 145-150: `.prayer-card-actions-left > *` has `width: 100% !important` which should force full width
- However, the `.ripple-button` class has `display: inline-flex` which may not properly expand

Looking at RippleButton.css line 5: `.ripple-button` has `display: inline-flex` which can cause width issues in flex containers.

**Fix Strategy:**
1. Ensure `.ripple-button` has `width: 100%` when inside `.prayer-card-actions-left`
2. Add `display: flex` (not inline-flex) for buttons in the footer

---

## BUG 3: Ripple buttons animations not visible

**Files affected:**
- `prayer-board/src/components/ui/RippleButton.css` (lines 89-99)
- `prayer-board/src/index.css`

**Root Cause:**
- RippleButton.css line 89-99 defines `@keyframes rippling` animation
- The animation is applied at line 85 to `.ripple-button-ripple`
- However, the purple/green theme variables mentioned in the bug description (`--color-accent-purple`, `--color-accent-green`) are NOT defined in themes.css
- themes.css only has `--color-accent-gold`, `--color-accent-blue`, `--color-accent-green` (but green is for success states, not the overhaul theme)

Looking at the screenshot, the buttons appear to use the gold theme. The "purple-green overhaul" mentioned in the branch name suggests these variables should exist but are missing.

**Fix Strategy:**
1. Add missing CSS variables to themes.css:
   - `--color-accent-purple`
   - `--color-accent-purple-hover`
   - Update `--color-accent-green` to match the overhaul theme
2. Ensure `@keyframes rippling` is available globally (it's already in RippleButton.css and index.css)

---

## BUG 4: Responsive audit findings

**Files affected:**
- `prayer-board/src/components/PrayerRequestCard.css` (lines 225-317)

**Current State:**
- Desktop: Uses flex layout with `flex: 1 1 0` - GOOD
- Tablet (768px): Has media query but gap reduction may be insufficient
- Mobile (600px): Uses grid layout with `grid-template-columns: 1fr 1fr` - GOOD
- Odd button spanning: Has rule for `:last-child:nth-child(odd)` - GOOD

**Issues Found:**
1. Missing breakpoint for small tablets (601px-768px)
2. Missing explicit width: 100% on buttons in grid layout
3. No text truncation controls for tablet view

**Fix Strategy:**
1. Add explicit 100% width for all buttons in mobile grid
2. Add small tablet breakpoint
3. Ensure min-height: 44px for accessibility at all breakpoints
