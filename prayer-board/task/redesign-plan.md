# Prayer Board — Full Visual Redesign Plan

> **Style:** Flat Design · **Quality Bar:** Linear.app / Vercel Dashboard / Clerk.dev
> **Status:** ✅ APPROVED — Proceeding to Phase 1
>
> **User Feedback Applied:**
> - ✅ Keep the original color palette (gold accent theme) — do NOT replace with purple FROZEN palette
> - ✅ Keep dark mode support (`[data-theme="dark"]` block preserved)
> - Still apply: flat design (no shadows, no gradients), Fira Code + Fira Sans fonts, token system, all layout redesigns

---

## Section 1: Current State Audit

### Pages

| Page | Layout | UX Problems | Visual Hierarchy Issues |
|---|---|---|---|
| **PrayerWallPage** | Flex column → Grid (1–3 cols via JS resize) with `@tanstack/react-virtual` | Multi-column masonry competes for scan order; filter tabs use pill + `box-shadow`; FAB uses `linear-gradient` + `box-shadow`; empty state is sparse (no illustration); heading uses `2.5rem` with text-loop but subtitle fights for dominance | Heading, filter tabs, and FAB all use gold accent equally — no clear primary CTA hierarchy |
| **LoginPage** | Centered single column, `max-width: 420px` | No brand panel; logo+form in one card with `box-shadow: var(--shadow-lg)`; submit uses `linear-gradient`; no visual differentiation from RegisterPage | `h1` and subtitle both centered with similar weight — form title gets lost |
| **RegisterPage** | Same as LoginPage | Same issues; extra field density makes the form feel taller without visual rhythm | Same as LoginPage |
| **ProfilePage** | Centered card reusing `AuthPages.css` | Inline `<style>` tag for `.profile-avatar-large`, `.role-badge`, `.profile-success-msg`; avatar uses `box-shadow`; no tab system for My Prayers vs Settings | Avatar, name, role badge all compete; form below has no visual separation |
| **SharedPrayerPage** | Two-column flex (desktop) → stacked (mobile) | Banner uses `linear-gradient`; pray button uses `linear-gradient` + `box-shadow`; CTA button duplicates same gradient; comment form inputs are visually inconsistent with auth inputs | Banner, card, CTA all use gold — the prayer body (the most important element) doesn't stand out |

### Components

| Component | Layout | UX Problems | Visual Issues |
|---|---|---|---|
| **Header** | Flex row, sticky, `backdrop-filter: blur(12px)` | Hamburger threshold at 525px (not 768px); avatar uses `linear-gradient`; dropdown uses `box-shadow: var(--shadow-lg)`; `backdrop-filter` is not flat | Logo, nav links, and user menu all have equal visual weight |
| **PrayerRequestCard** | Flex column, `box-shadow: var(--shadow-sm)` | Card hover adds `box-shadow`; avatar uses `linear-gradient` + double `box-shadow` ring; answered cards use `linear-gradient` background; action buttons have inconsistent sizing; text clamping is 4 lines (prompt says 3) | Avatar, answered badge, and action buttons all use gold — footer actions compete with body text |
| **PrayerRequestSkeleton** | Flex column mirroring card | Uses `box-shadow: var(--shadow-sm)`; shimmer uses `opacity` animation (not color shift per new spec) | Matches old card structure, will need updating to match new card |
| **NewPrayerRequestForm** | Radix Dialog, 3-step wizard | Modal uses `box-shadow: var(--shadow-lg)`; overlay uses `backdrop-filter: blur`; wizard progress uses custom step dots; submit uses `InteractiveHoverButton` | Wizard steps, textarea, and submit all compete for attention |
| **PrayerDetailModal** | Radix Dialog, bottom-sheet on mobile | Header uses `linear-gradient` background; avatar uses `linear-gradient` + double ring `box-shadow`; close button rotates on hover; `backdrop-filter: blur(12px)` on overlay | Same gold-everywhere problem |
| **CommentSection/CommentItem** | Flex column, expandable | Uses separate `.css` files (not audited in detail but follows same patterns) | Left border + nested styling consistent |
| **NotificationBanner** | Fixed bottom-center | Uses `box-shadow: var(--shadow-lg)`, `linear-gradient` on enable button; positioned at bottom (prompt says top-center) | Consistent gold accent |
| **AnimatedCandle** | Inline SVG with CSS keyframes | Uses `filter: drop-shadow(...)` — violates flat design constraint; keyframes not wrapped in `prefers-reduced-motion: no-preference` | N/A |
| **RippleButton variants** | Inline flex buttons with ripple animation | `rippling` keyframe in `index.css` — should be guarded by `prefers-reduced-motion` | Consistent |
| **ThemeToggle / LanguageSelector** | Icon buttons / Dropdown | Need to match new flat icon button spec (36px, cursor-pointer, muted→primary hover) | N/A |

---

## Section 2: Redesign Decisions

### Global: Design Token Foundation

- **`themes.css`**: Replace all color variables with the FROZEN palette. Remove `--color-accent-gold*`, `--gold-tint-*`, `--gold-glow-*`. Remove `--shadow-*` variables entirely. Remove dark mode block (single-theme app for this redesign — light only with the FROZEN `--color-bg: #FAF5FF`).
- **`index.css`**: Replace `@import` for Playfair Display + Inter with Fira Code + Fira Sans. Add full token block (typography scale, spacing scale, radii, transitions, layout max-widths). Remove `glow` and `pulse` keyframes (they use `box-shadow`). Wrap `rippling`, `fadeIn`, `slideUp` in `@media (prefers-reduced-motion: no-preference)`.

### Per-Component Decisions

| Component | New Layout | Spacing Tokens | Typography | Interaction States |
|---|---|---|---|---|
| **Header** | Flex, 64px height, `--color-bg` bg, `--border-base` bottom | `--space-4` padding, `--space-6` gap between nav links | Logo: `--font-heading` `--text-xl` · Nav: `--font-body` `--text-sm` | Animated underline via `::after` pseudo (width 0→100%), `--transition-base` |
| **PrayerRequestCard** | Flex column, `--border-base`, `--radius-md`, **no shadow** | `--space-4` padding, `--space-3` footer padding-top | Author: `--font-body` `--text-sm` · Body: `--font-body` `--text-base` · Title: `--font-heading` `--text-lg` | Hover: border-color → `--color-primary`, `--transition-fast`. Answered: left 4px `--color-cta` border + rgba tint bg |
| **PrayerRequestSkeleton** | Match new card structure exactly | Same as PrayerRequestCard | N/A | Shimmer: `--color-secondary` 10%→20% opacity keyframe, `prefers-reduced-motion` static fallback |
| **NewPrayerRequestForm** | FAB trigger (56px circle, `--color-cta`), Radix Dialog modal/drawer | `--space-4` field gaps | Textarea: `--font-body`, `--text-base` · Submit: `--font-heading`, `--text-base` | Focus: border-color `--color-primary`. FAB hover: opacity 0.9 |
| **PrayerDetailModal** | Radix Dialog, centered on desktop, bottom-sheet on mobile. **No box-shadow**, `--border-base`, `--radius-lg` | `--space-8` padding scroll area | Author: `--font-heading` · Body: `--font-body` `--text-lg` line-height 1.75 | Close: Lucide X, hover opacity 0.7 |
| **CommentSection** | Full-width below prayer body, `--border-base` top | `--space-3` padding-left per comment | Name: `--font-heading` `--text-sm` · Body: `--font-body` `--text-sm` | Focus: border `--color-primary` |
| **NotificationBanner** | Fixed **top-center** (not bottom), z-index 9999 | `--space-4` padding | `--font-body` `--text-sm` | Enter: translateY(-100%)→0, `--transition-base`. Success: `--color-cta` bg. Error: `--color-error` bg |
| **AnimatedCandle** | Keep SVG, remove `drop-shadow` filter | N/A | N/A | Wrap keyframes in `prefers-reduced-motion: no-preference`, static fallback |
| **ThemeToggle / LanguageSelector** | 36px flat icon buttons | `--space-2` padding | N/A | `--color-text-muted` → `--color-primary` on hover |

### Per-Page Decisions

| Page | Layout Change | Key Decisions |
|---|---|---|
| **PrayerWallPage** | **Single-column feed** (not masonry). Sidebar filter at 1024px+, horizontal bar at 768px, toggle drawer at 375px. Max-width `--max-width-content` | Remove JS `columnCount` resize logic — replace with CSS-only responsive. Keep virtualization but for single column. Filter tabs → underline active indicator instead of pill+shadow. Empty state gets inline SVG illustration |
| **LoginPage** | Two-panel (50/50) at 768px+: left brand panel + right form. Single column at 375px | Brand panel: app name in Fira Code, tagline, AnimatedCandle centered. Form: `--max-width-form`, flat inputs, 48px height, 52px submit |
| **RegisterPage** | Same two-panel layout as LoginPage | Same form design with extra fields |
| **ProfilePage** | Profile header band + tabbed body ("My Prayers" / "Settings") | Remove inline `<style>`. Avatar: 96px circle, 2px `--color-primary` border. Tab indicator: 2px underline |
| **SharedPrayerPage** | Max-width `--max-width-narrow`, centered | Flat card, flat pray button, flat comment section |

---

## Section 3: Component Dependency Map

```
App.jsx
├── PrayerWallPage
│   ├── Header
│   │   ├── ThemeToggle
│   │   ├── LanguageSelector
│   │   └── Radix DropdownMenu
│   ├── PrayerRequestCard (×N)
│   │   ├── RipplePrayedButton
│   │   ├── RippleCommentButton
│   │   ├── RippleShareButton
│   │   ├── RippleMarkAnsweredButton
│   │   ├── CommentSection
│   │   │   └── CommentItem (×N)
│   │   └── PrayerDetailModal (Radix Dialog)
│   ├── PrayerRequestSkeleton (×N)
│   ├── NewPrayerRequestForm (Radix Dialog)
│   │   └── AnimatedCandle
│   ├── NotificationBanner
│   └── TextLoop (ui component)
├── LoginPage → Header (none), AuthPages.css
├── RegisterPage → Header (none), AuthPages.css
├── ProfilePage → AuthPages.css
└── SharedPrayerPage
    ├── Header
    └── inline CommentSection (custom)
```

### Safe Execution Order

1. **`themes.css`** + **`index.css`** (token foundation — breaks nothing, only adds vars)
2. **Header** (standalone, consumed by 2 pages)
3. **PrayerRequestSkeleton** (no deps)
4. **AnimatedCandle** (consumed by NewPrayerRequestForm)
5. **NotificationBanner** (standalone)
6. **CommentItem** → **CommentSection** (leaf → parent)
7. **RipplePrayedButton**, **RippleCommentButton**, **RippleShareButton**, **RippleMarkAnsweredButton** (leaf buttons)
8. **PrayerDetailModal** (consumed by card)
9. **ThemeToggle** + **LanguageSelector** (consumed by Header)
10. **PrayerRequestCard** (depends on 4–9)
11. **NewPrayerRequestForm** (standalone modal)
12. **PrayerWallPage** (depends on all above)
13. **LoginPage** + **RegisterPage** + **AuthPages.css**
14. **ProfilePage**
15. **SharedPrayerPage**

---

## Section 4: CSS Architecture Decision

**Decision: Keep per-component `.css` files. Centralize only tokens in `index.css` and `themes.css`.**

Rationale:
- Each component already has its own `.css` file — this colocation is good for maintainability
- The token layer in `index.css` / `themes.css` becomes the single source of truth
- No consolidation needed — just ensure every `.css` file references tokens instead of hardcoded values

### Files to Modify (33 total)

**Foundation (2):**
- `src/styles/themes.css` — Full token replacement
- `src/index.css` — Font import, token block, keyframe guards

**Pages (6):**
- `src/pages/PrayerWallPage.jsx` + `.css`
- `src/pages/AuthPages.css`
- `src/pages/ProfilePage.jsx`
- `src/pages/SharedPrayerPage.jsx` + `.css`

**Components (20):**
- `src/components/Header.jsx` + `.css`
- `src/components/PrayerRequestCard.jsx` + `.css`
- `src/components/PrayerRequestSkeleton.jsx` + `.css`
- `src/components/NewPrayerRequestForm.jsx` + `.css`
- `src/components/PrayerDetailModal.jsx` + `.css`
- `src/components/CommentSection.jsx` + `.css`
- `src/components/CommentItem.jsx` + `.css`
- `src/components/NotificationBanner.jsx` + `.css`
- `src/components/AnimatedCandle.jsx` + `.css`
- `src/components/RipplePrayedButton.jsx` + `.css`
- `src/components/RippleCommentButton.jsx` + `.css` (if exists)
- `src/components/RippleShareButton.jsx` + `.css` (if exists)
- `src/components/RippleMarkAnsweredButton.jsx` + `.css`
- `src/components/ThemeToggle.jsx`
- `src/components/LanguageSelector.jsx`

**NOT touched:** `server/`, `api/`, `__tests__/`, `e2e/`, `i18n/` locale files

---

## Verification Plan

### Automated Tests

```bash
# Run existing unit tests — must still pass
cd prayer-board && npm test

# Run existing lint checks
cd prayer-board && npm run lint
```

### Grep Verification (post-implementation)

```bash
# Zero hardcoded hex colors in CSS
grep -rn "#[0-9a-fA-F]\{3,8\}" prayer-board/src/**/*.css --include="*.css"

# Zero box-shadow declarations
grep -rn "box-shadow" prayer-board/src/**/*.css --include="*.css"

# Zero linear-gradient declarations  
grep -rn "linear-gradient" prayer-board/src/**/*.css --include="*.css"

# Zero backdrop-filter declarations
grep -rn "backdrop-filter" prayer-board/src/**/*.css --include="*.css"
```

### Dev Server Verification

```bash
cd prayer-board && npm run dev:client
# Must start with zero console errors
```

### Manual Verification (browser)

1. Open `http://localhost:5173` — verify PrayerWallPage renders at 1440px, 1024px, 768px, 375px
2. Navigate to `/login` — verify two-panel layout at 768px+, single column at 375px
3. Navigate to `/register` — same as login
4. Navigate to `/profile` (while logged in) — verify tabbed layout
5. Open a shared prayer link — verify centered narrow layout
6. Check all text uses Fira Code (headings) and Fira Sans (body)
7. Verify zero shadows visible on any element
8. Verify no horizontal scroll at 375px

---

> **⏸️ STOP: Awaiting user approval before proceeding to Phase 1.**
