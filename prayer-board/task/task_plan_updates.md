# Task Plan Updates

## Phase 8 — Notification UI Positioning
- [x] Move `NotificationBanner` to avoid overlapping the 64px Header. Either `top: 80px` or `bottom-center`.
- [x] Move `CommentSection` toasts (the `notifications` array) so they don't overlap the Header on desktop (`top: 80px` instead of `8px`) and don't stretch weirdly on mobile.
- [x] Ensure `ui-ux-pro-max` standards: centered for important system prompts, top-right/bottom-center for transient toasts.
- [x] Ensure `z-index` layering is correct across the app.
