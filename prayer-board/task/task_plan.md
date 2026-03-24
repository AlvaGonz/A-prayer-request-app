# Redesign Task Plan (Phases 4-7)

## Phase 4: JSX Updates & Structural Changes
- [ ] Review and update `ProfilePage.jsx` to remove inline `<style>` tags and migrate to CSS classes.
- [ ] Review `App.jsx` to verify and optimize lazy loading.
- [ ] Check for any structural HTML/JSX changes needed to support the new flat design.

## Phase 5: Responsive Spot-Checks
- [ ] Verify views at 375px (Mobile portrait)
- [ ] Verify views at 768px (Tablet)
- [ ] Verify views at 1024px (Desktop narrow)
- [ ] Verify views at 1440px (Desktop wide)

## Phase 6: Accessibility Audit
- [ ] Ensure focus traps are working correctly in modals (e.g., `PrayerDetailModal`, `NewPrayerRequestForm`).
- [ ] Check color contrast for text against backgrounds (especially gold against white/dark).
- [ ] Verify keyboard navigation (tab order, focus states) across interactive elements.
- [ ] Ensure all interactive elements have appropriate ARIA labels if needed.

## Phase 7: Final Polish
- [ ] Final manual review.
- [ ] Run test suite (`npm test`).
