# Findings: PrayerRequestCard UI Bugs

## BUG 1 — Author name overflow
**Root Cause:** 
- `.prayer-card-header` missing `gap` and `min-width: 0`
- `.prayer-card-author` missing `overflow: hidden`
- `.author-name` missing `max-width: 100%`
- `.prayer-card-meta` missing `white-space: nowrap`

**Fix Location:** PrayerRequestCard.css

## BUG 2 — Ghost button investigation
**Investigation:**
- Checked PrayerRequestCard.jsx footer: 4 components rendered
- RipplePrayedButton, RippleCommentButton, RippleShareButton (always)
- RippleMarkAnsweredButton (conditional)
- All components return single wrapper element
- No empty `<div>` or ghost elements found in code

**Conclusion:** 
No actual ghost button in code. The issue was flex layout not distributing space properly, which is fixed in BUG 3.

## BUG 3 — Footer button layout
**Root Cause:**
- Buttons lack `flex: 1` for equal distribution
- No `flex-shrink: 0` on admin actions container
- Missing `flex-wrap: wrap` on footer

**Fix Location:** PrayerRequestCard.css

## BUG 4 — Prayer message position
**Root Cause:**
In RipplePrayedButton.css line 81:
```css
.prayed-message {
  top: calc(100% + 8px);  /* Places BELOW button */
}
```

**Fix:**
Change to `bottom: calc(100% + 8px)` to place ABOVE button.

**Decision:** Using Fix A (absolute positioning with bottom) since:
- `.prayer-card` does NOT have `overflow: hidden`
- `.prayer-card-footer` does NOT have `overflow: hidden`
- Safe to use absolute positioning

**Fix Location:** RipplePrayedButton.css
