# Task Plan: Fix Prayer Card Button Alignment

## Objective
Fix the button distribution in the PrayerRequestCard footer so buttons are evenly spaced across the full width.

## Current Issues
1. Buttons cluster to the left with unequal spacing
2. On mobile, buttons wrap inconsistently
3. Footer feels visually unbalanced

## Implementation Steps

### Step 1: Update `.prayer-card-footer`
- Remove `justify-content: space-between` 
- Add `gap: 8px` for consistent spacing
- Keep `padding-top` and `border-top` as-is

### Step 2: Update `.prayer-card-actions-left`
- Keep `flex: 1` to fill available width
- Add `justify-content: space-between` for even distribution
- Keep `gap: 8px` for spacing between buttons

### Step 3: Update `.prayer-card-actions-left > *` (child elements)
- Keep `flex: 1` so all buttons share equal width
- Add `justify-content: center` to center content

### Step 4: Update mobile media query (`@media (max-width: 600px)`)
- Stack buttons in column layout
- Make buttons full width with `width: 100%`
- Ensure touch targets remain ≥ 44px

## Files to Modify
- `prayer-board/src/components/PrayerRequestCard.css` ONLY

## Constraints
- CSS only - no JS changes
- No new CSS classes
- Preserve all existing colors, borders, hover states
- Preserve CSS variable references
