# UX/UI Overhaul — Task Plan

## Objective
Awwwards-grade UX polish of the Prayer Board app. Pixel-perfect execution of the Design System.

## Phases

### Phase 1: UX Audit (Read Only) — `complete`
- Scan all pages and components
- Output audit log to `ux-audit-report.md`

### Phase 2: Global Token Enforcement — `complete`
- Add design tokens as CSS custom properties in `index.css`
- Add spacing scale, font, transition, and color tokens
- Replace hardcoded hex values across ALL `.css` files

### Phase 3: Component-Level UX Overhaul — `complete`
- Header, PrayerRequestCard, Skeleton, NewPrayerRequestForm
- PrayerDetailModal, AnimatedCandle, Auth Pages, ProfilePage
- PrayerWallPage, NotificationBanner

### Phase 4: Responsive Breakpoints Audit — `complete`
- Verify 375px, 768px, 1024px, 1440px

### Phase 5: Pre-Delivery Checklist — `complete`
- No emojis, cursor-pointer, hover states, contrast, focus rings, reduced-motion, responsive

### Phase 6: i18n Integrity Check — `complete`
- Verify no i18n keys broken after CSS changes

## Files Modified
- (Will be updated as work progresses)

## Decisions
- Design system specifies Playfair Display + Inter (already implemented), NOT Fira Code/Fira Sans
- CTA color in design_system.md is #CA8A04 (gold), already implemented as --color-accent-gold
- Existing theme system (light/dark) in themes.css must be preserved
- Token names from user prompt will be mapped to existing semantic tokens
