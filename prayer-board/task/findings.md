# UI UX Findings
- NotificationBanner was using `top: 24px` which overlapped the `64px` fixed header natively.
- `CommentSection` Toast notifications (like the Rate Limit text) were using `top: 8px` on desktop and stretching wide on mobile via `right: 24px, left: 24px` which caused overlapping/cropping layout shifts.
- To follow ui-ux-pro-max guidelines, transient feedback toasts should float from bottom-center so they don't occlude critical interactive headers or content mid-screen.
