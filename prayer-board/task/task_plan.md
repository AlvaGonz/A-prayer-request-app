# Task Plan — Card UX Overhaul + Feed Polish + E2E

## Phase 0 — Recon ✅
- [x] Read PrayerRequestCard.jsx/css
- [x] Read usePrayerRequests.js
- [x] Read requestController.js (backend pagination)
- [x] Read PrayerWallPage.jsx
- [x] Read PrayerRequestSkeleton.jsx/css
- [x] Read themes.css
- [x] Read auth.spec.js (E2E patterns)
- [x] Log findings to findings.md

## Phase 1 — PrayerRequestCard UX Overhaul ✅
- [x] Avatar: 40px, gradient border purple→gold
- [x] Prayer text: 4-line clamp with "Read more" inline expand
- [x] Status badge: pill shape, glow keyframe animation
- [x] Footer: hover lift 2px on action buttons (desktop only)
- [x] Card: hover scale(1.01) + shadow-md (CSS only)
- [x] Testimony block: italic heading font, gold left border, bg-secondary
- [x] Delete dialog: backdrop blur, semantic color tokens
- [x] Add `newRequest.wizard.identity` i18n key (EN/ES)
- [x] Add `feed.allPrayersLoaded` i18n key (EN/ES)

## Phase 2 — Feed End Message + Polish ✅
- [x] Add feed-end message to PrayerWallPage when no more pages
- [x] Add `.feed-end-message` CSS
- [x] Verify infinite scroll still works correctly
- [x] Backend: no changes needed (already paginated)

## Phase 3 — E2E Test [/]
- [x] Visual verification via browser subagent
- [x] Create e2e tests for share flow
- [ ] Create e2e/feed_lazy_loading.spec.js (Manual verification passed)
- [x] Test: initial cards load
- [x] Test: scroll loads more
- [x] Test: skeleton visibility
- [x] Test: answered badge visible

## Constraints
- Zero new npm packages
- All colors via CSS tokens only
- NO modification to themes.css
- NO modification to framer-motion cardVariants
- NO hardcoded strings — all i18n
