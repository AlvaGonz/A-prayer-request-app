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

**Commit:**
```
fix: responsive card footer, ripple visibility, share button, Yo Oro overlap
```

**Status:** ✅ Pushed to origin/feat/ui-overhaul-purple-green
