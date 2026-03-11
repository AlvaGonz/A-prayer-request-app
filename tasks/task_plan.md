# Task Plan: InteractiveHoverButton Integration

## STEP 1 — Create the component folder and file
- [x] Create directory: prayer-board/src/components/ui/
- [x] Create: prayer-board/src/components/ui/InteractiveHoverButton.jsx
- [x] Create: prayer-board/src/components/ui/InteractiveHoverButton.css

## STEP 2 — Integrate into PrayedButton.jsx (CTA: "Yo Oro")
- [ ] Read PrayedButton.jsx
- [ ] Import InteractiveHoverButton
- [ ] Build dynamic text string with count
- [ ] Replace button with InteractiveHoverButton
- [ ] Add CSS override rules for prayed state
- [ ] Keep Sparkles and prayed-message outside

## STEP 3 — Integrate into NewPrayerRequestForm.jsx (CTA: Submit)
- [ ] Read NewPrayerRequestForm.jsx
- [ ] Import InteractiveHoverButton
- [ ] Build dynamic submit text
- [ ] Replace submit button with InteractiveHoverButton
- [ ] Add CSS override rules
- [ ] Keep cancel button logic

## STEP 4 — Verify lucide-react
- [ ] Check package.json for lucide-react
- [ ] ArrowRight import should work (already used in project)

## STEP 5 — Write Unit Tests
- [ ] Create test file: src/components/ui/tests/InteractiveHoverButton.test.jsx
- [ ] Test 1: renders with default text "Button"
- [ ] Test 2: renders custom text prop
- [ ] Test 3: calls onClick when clicked and not disabled
- [ ] Test 4: does NOT call onClick when disabled
- [ ] Test 5: applies additional className correctly
- [ ] Test 6: forwards ref to button element
- [ ] Run: npm test

## FINAL VERIFICATION
- [ ] Build succeeds
- [ ] All tests pass
- [ ] Components animate correctly
