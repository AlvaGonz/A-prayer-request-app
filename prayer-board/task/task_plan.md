# Prayer Card UI/UX Bug Fixes

## Phase 1: Planning and File Assessment
- [x] Investigate the notification message clipping issue. Wait, this was already done in CSS, but now need to apply it outside modal using `createPortal`.
- [x] Analyze `requestController.js` to ensure proper `msg` is destructured via `res.json()`.
- [x] Modify `PrayerRequestCard.jsx` testimony to include a read-more expander when testimony length > `TEXT_CLAMP_THRESHOLD` (200 characters).

## Phase 2: Implementation
- [x] Refactor `RipplePrayedButton.jsx` to render the notification using React's `createPortal`, injecting it onto `document.body` to evade modal CSS containment constraints.
- [x] Fetch the `message` string returned in the payload from `requestController.js` and pipe it into the portal toast.
- [x] Add clamping container styling and the "Tap to read" `<button>` inside the testimony `<m.div>`.

## Phase 3: Verification
- [ ] Manual visual check or Vitest execution.
