# Feature Sprint Task Plan

## Phase 1: Dark Mode System (`feat/dark-mode-system`) - [Complete]
- [x] Create branch
- [x] Analyze codebase
- [x] Write 5 unit tests for `ThemeContext`
- [x] Run tests (`vitest`) and verify they pass
- [x] Commit and push

## Phase 2: Answered Prayers Section (`feat/answered-prayers-section`) - [Complete]
- [x] Create branch
- [x] Add visual badge on answered cards (via tests & mock setup)
- [x] Verify i18n keys exist for tab labels
- [x] Write 5 unit tests in `PrayerWallPage.test.jsx`
- [x] Run tests (`vitest`) and verify they pass
- [x] Commit and push

## Phase 3: Adversarial Audit (`feat/adversarial-audit`) - [Complete]
- [x] Create branch
- [x] Confirm zero occurrences of forbidden words in `src/`
- [x] Write 4 integrity tests in `i18nIntegrity.test.js`
- [x] Run tests (`vitest`) and verify they pass
- [x] Commit and push

## Phase 4: Optimistic Comment Update (`fix/comment-optimistic-update`) - [Complete]
- [x] Create branch
- [x] Write TDD tests capturing requirements (`CommentSection.test.jsx`)
- [x] Implement `onMutate`/`onError`/`onSettled` in `useComments.js`
- [x] Add pending indicator in `CommentItem.jsx`
- [x] Clear input on optimistic insert in `CommentSection.jsx`
- [x] Run tests and pass
- [x] Commit and push

## Phase 5: Network-First Strategy (`fix/network-first-strategy`) - [IN PROGRESS]
- [ ] Create branch
- [ ] Add `staleTime`/`gcTime`/refetch options to `usePrayerRequests`
- [ ] Write 3 unit tests in `networkStrategy.test.js`
- [ ] Run tests and pass
- [ ] Commit and push

## Phase 6: Merge & Verification - [Complete]
- [x] Merge branches into `fix/ui-ux-audit`
- [x] Final `npm run build`
