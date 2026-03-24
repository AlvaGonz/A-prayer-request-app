# Findings — Session 2026-03-24 12:34

## 1. usePrayerRequests.js
- **Already uses `useInfiniteQuery`** from TanStack Query v5
- `queryKey: ['prayerRequests', statusFilter]`
- `queryFn` calls `requestsAPI.getAll({ page, limit, status })`
- First page loads 10 items, subsequent pages load 20
- `getNextPageParam` reads `lastPage.pagination.page` / `totalPages`
- `staleTime: 0`, `gcTime: 5min`, refetch on mount + window focus

## 2. Backend GET /api/requests (requestController.js)
- **Already supports pagination**: `page`, `limit`, `status` query params
- Response shape: `{ requests: [...], pagination: { page, limit, totalPages, totalCount } }`
- Default limit: 20, default status: 'open'
- Uses `.skip((page-1)*limit).limit(limit)` with `countDocuments`
- ✅ No backend changes needed

## 3. PrayerRequestCard.css classes
- `.prayer-card`, `.prayer-card.answered`
- `.prayer-card-header`, `.prayer-card-author`, `.author-avatar`, `.author-avatar.anonymous`, `.author-name`
- `.prayer-card-meta`, `.status-badge.answered`, `.time-ago`
- `.prayer-card-body`, `.prayer-text`
- `.prayer-card-footer`, `.prayer-card-actions-left`, `.prayer-card-actions`
- `.action-btn`, `.comments-toggle-btn`
- Testimony: `.prayer-card__testimony-text`, `__testimony-form`, `__testimony-textarea`, `__testimony-actions`
- Alert dialog: `.alert-dialog-overlay`, `.alert-dialog-content`, `.alert-dialog-title`, `.alert-dialog-description`, `.alert-dialog-actions`
- Reduced motion: `@media (prefers-reduced-motion: reduce)` supported
- Custom gold tokens: `--gold-tint-light/medium/strong`, `--gold-glow/glow-strong`

## 4. Prayer detail modal?
- **No modal exists.** Text is shown inline in the card. No expand/detail view.
- Text currently has no line-clamp. Full text always visible.

## 5. Animation library
- **Confirmed: framer-motion** via `m` (LazyMotion) + `AnimatePresence`
- `cardVariants` in PrayerRequestCard.jsx: spring with stiffness 100, damping 15
- `whileInView="visible"` with viewport once + margin
- PrayerWallPage uses `rowContainerVariants` for staggered reveals

## 6. PrayerWallPage.jsx (feed page)
- Already uses `@tanstack/react-virtual` (`useWindowVirtualizer`)
- Responsive column count: 1 (<768), 2 (<1100), 3 (≥1100)
- Auto infinite scroll via virtualizer `getVirtualItems()` last-item check
- Skeleton rows shown as loader rows
- Status filter tabs: 'open' / 'answered'
- **No "Load More" button** — already infinite scroll
- **No feed-end message** — missing when all items loaded

## 7. Skeleton component
- `PrayerRequestSkeleton.jsx`: avatar + name + time + 3 body lines + 2 footer buttons
- `.skeleton-pulse` keyframe animation
- Class: `.skeleton-card` (matches card structure)

## 8. E2E patterns (auth.spec.js)
- Uses `test.describe`, `test` from `@playwright/test`
- Generates unique email via `Date.now()`
- Selectors use `#id` for form fields, `button[type="submit"]` for submit
- `page.fill()`, `page.click()`, `expect(page).toHaveURL()`
- Route interception for mocking API responses

## 9. i18n — Missing key spotted by user
- `newRequest.wizard.identity` — used in wizard review step, needs EN/ES labels
- EN: "Identity" | ES: "Identidad"

## 10. themes.css tokens (DO NOT MODIFY)
- Full token list confirmed per color protection contract
- `--font-heading: 'Playfair Display'`, `--font-body: 'Inter'`
- `--radius-sm/md/lg/xl`, `--shadow-sm/md/lg`
- `--transition-fast/normal/slow`
