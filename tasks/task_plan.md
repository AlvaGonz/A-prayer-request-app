# Task Plan: PrayerRequestCard UI Fixes

## BUG 1 — Author name overflows and breaks header layout
- [x] Add `gap: 8px` to `.prayer-card-header`
- [x] Add `min-width: 0` to `.prayer-card-header`
- [x] Add `overflow: hidden` to `.prayer-card-author`
- [x] Add `max-width: 100%` to `.author-name`
- [x] Add `white-space: nowrap` to `.prayer-card-meta`

## BUG 2 — Ghost empty button (3rd slot in footer)
- [x] Investigation: Components render correctly, no ghost button found in code
- [x] Flex layout issue: Ensure buttons distribute properly

## BUG 3 — Footer buttons clip text and don't fill space evenly
- [x] Add `flex-wrap: wrap` to `.prayer-card-footer`
- [x] Update `.action-btn` to include `flex: 1`, `min-width: 0`
- [x] Add `flex-shrink: 0` to `.prayer-card-actions`
- [x] Update mobile media query

## BUG 4 — "Yo Oré" confirmation message appears BELOW button
- [x] Change `.prayed-message` from `top: calc(100% + 8px)` to `bottom: calc(100% + 8px)`
- [x] Add `z-index: 50` to ensure visibility
- [x] File: RipplePrayedButton.css

## Verification
- [ ] Build succeeds
- [ ] Visual test in browser
