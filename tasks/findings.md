# Research & Discoveries

## T1: Dark Mode System
- **Discovery**: `ThemeContext.jsx` already had a mature implementation of system dark/light mode preference (`matchMedia`), as well as correct precedence for local storage preference.
- **Action**: Verified functionality solely through robust frontend unit tests using mocking in Vitest, bypassing the need for implementation edits.

## T2: Answered Prayers Section
- **Discovery**: Prayer categories exist in the UI naturally (already split by tabs mapping to "open" and "answered" states).
- **Action**: Added assertions that correctly map these filter states against the actual rendering components. No backend or route changes required.

## T3: Adversarial Audit
- **Discovery**: A full-text grep regex search (`\brezo\b|\brezar\b|\brezando\b|\brezos\b`) across all `src/` files returned **zero** occurrences on frontend source files.
- **Action**: Wrote an explicit integration unit test for `en.json` and `es.json` to lock in key-parity and guarantee none of those words slide into our Spanish catalog.

## T4: Optimistic Comments
- **Discovery**: `useComments.js` currently uses `useMutation` for `useCreateComment` but only invalidates Queries upon `onSuccess`. There is NO optimistic query updating (`onMutate` with rollback via `onError`).
- **Action**: Wrote `CommentSection.test.jsx` that fails or asserts expectations of immediate inputs clearing and pending elements rendering. Now I need to implement `onMutate` logic on the hook itself, and adapt `CommentSection` to respect its output immediately.

## T5: Network-First Strategy 
- **Discovery**: `vite.config.js` is perfectly configured for Workbox `NetworkFirst` cache handlers towards `/api/*`. However, `usePrayerRequests.js` defaults to standard fetching states. 
- **Action**: Need to enforce `staleTime: 0`, and manual `refetchOnWindowFocus/refetchOnMount` to be highly reactive, simulating network-first data invalidation.
