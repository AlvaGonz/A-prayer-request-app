# Notification System Redesign Plan (Pro-Max)

## Phase 1 — Global Toast Infrastructure
- Create `src/context/ToastContext.jsx` with a robust global state for stacked Toasts.
- Support `type`: `success`, `error`, `info`, `warning`.
- Define `src/components/ui/ToastContainer.jsx` to render them beautifully.
- Render inside `App.jsx`.

## Phase 2 — Remove Ugly Browser Alerts
- Locate and remove `window.alert` or `window.confirm` across the app (CommentSection, auth, etc.) if possible, replacing them with Toasts (or Radix confirmation modals if strictly needed).
- Wait, I'll focus on replacing `alert()` and local `.notifications-container` with `useToast()`.

## Phase 3 — Migrate Local Toasts
- Modify `CommentSection.jsx`. Strip out its local `notifications` array and CSS.
- Migrate instances like `addNotification()` to use `toast.show(...)` from context.

## Phase 4 — Redesign NotificationBanner (Push Opt-in)
- Completely recreate `NotificationBanner.jsx`. Use a polished, modern component (e.g. Floating Card or slide-out from bottom).
- Redesign `NotificationBanner.css` with a high-end flat UI layout (no gradients, sharp hierarchy).

## Phase 5 — i18n Verification
- Ensure all recreated notifications continue to use `t()` dynamically.

## Final Review
- Verify responsive layout of toasts stack.
- Check contrast.
