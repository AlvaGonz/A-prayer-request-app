# Task Plan - Fix Language Dropdown Portal + Notification Permission Flow

## Objective
Fix two bugs in the Prayer Board application:
1. Language dropdown clipped by Header overflow
2. Push notification permission blocked by Android Chrome overlay rule

## Bug 1 — Language Dropdown Portal

- [x] Add `createPortal` import from 'react-dom'
- [x] Add `useRef` hook for trigger button reference
- [x] Add `menuPos` state for menu positioning
- [x] Calculate menu position from trigger's `getBoundingClientRect()`
- [x] Wrap `AnimatePresence` in `createPortal` mounting to `document.body`
- [x] Add `language-theme-menu--portal` CSS class with `position: fixed`
- [x] Update backdrop `z-index` to 9998
- [x] Update menu `z-index` to 9999

**Files:**
- `prayer-board/src/components/ui/theme.jsx`
- `prayer-board/src/components/ui/theme.css`

---

## Bug 2 — Notification Permission Android Chrome

- [x] Remove `isLoading` state from component
- [x] Dismiss banner BEFORE requesting permission
- [x] Add `requestAnimationFrame` delay for DOM removal
- [x] Add 100ms buffer for Chrome's overlay detection
- [x] Remove `disabled={isLoading}` from button
- [x] Remove loading text from button (simplified to "Enable")
- [x] Handle permission states (granted/denied)

**Files:**
- `prayer-board/src/components/NotificationBanner.jsx`

---

## Architectural Debt Documentation

- [x] Document JWT localStorage storage risk in findings.md
- [x] Explain current mitigations (Sentry, CSP future)
- [x] Outline resolution path (httpOnly cookies)

**Files:**
- `tasks/findings.md`

---

## Constraints Followed

- ✅ LanguageDropdown public API unchanged (props stable)
- ✅ Notification logic kept in NotificationBanner component
- ✅ Used only React built-in features (createPortal, useRef)
- ✅ No new npm packages added
- ✅ No Header.css overflow modifications (portal is architecturally correct fix)
- ✅ No AuthContext modifications

---

## Verification Checklist

- [x] Language dropdown renders outside Header overflow
- [x] Menu follows trigger position on scroll
- [x] No clipping on mobile devices
- [x] Android Chrome permission dialog appears without "Close any bubbles" error
- [x] Notification permission granted → works correctly
- [x] Notification permission denied → banner dismissed

---

## Commit Message
```
fix: language dropdown portal to escape header overflow; fix notification permission blocked by fixed overlay on Android
```
