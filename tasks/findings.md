# Research & Discoveries

## T1: Dark Mode System
- **Discovery**: `ThemeContext.jsx` already had a mature implementation of system dark/light mode preference (`matchMedia`), as well as correct precedence for local storage preference.
- **Action**: Verified functionality solely through robust frontend unit tests using mocking in Vitest, bypassing the need for implementation edits.

## T2: Answered Prayers Section
- **Discovery**: `NewPrayerRequestForm.jsx` accepts explicit `isAnonymous` booleans but the backend default fallback mechanism instantly overrides explicit checks if the user is unauthenticated. By migrating to a generic parser, it properly reads the user input directly.

### Frontend Generic Error Audit (429 Rate Limits)
**Discovery**: The `NewPrayerRequestForm.jsx`, `CommentSection.jsx`, and `PrayedButton.jsx` components handle API calls asynchronously but process the returned `catch (error)` entirely blindly. If the rate limit (`authLimiter`, `prayerLimiter`) hits, it swallows the `HTTP 429` Status Exception and maps it to a generic `"Something went wrong"` translation text. We must intercept `err.statusCode === 429` precisely as we retrofitted in `LoginPage.jsx`.

### Insecure Defaults Scan
**Discovery**: Searched for fallbacks across `process.env`, `localStorage` and `import.meta.env`. Current configuration persists the raw JWT directly inside `localStorage` instead of leveraging `httponly` persistent cookies. This is technically an insecure SPA default rendering standard React apps highly susceptible to raw XSS extraction. Noting this as architectural debt since an `httpOnly` cookie migration warrants a full backend rewrite.

## T3: Adversarial Audit
- **Discovery**: A full-text grep regex search (`\brezo\b|\brezar\b|\brezando\b|\brezos\b`) across all `src/` files returned **zero** occurrences on frontend source files.
- **Action**: Wrote an explicit integration unit test for `en.json` and `es.json` to lock in key-parity and guarantee none of those words slide into our Spanish catalog.

## T4: Optimistic Comments
- **Discovery**: `useComments.js` currently uses `useMutation` for `useCreateComment` but only invalidates Queries upon `onSuccess`. There is NO optimistic query updating (`onMutate` with rollback via `onError`).
- **Action**: Wrote `CommentSection.test.jsx` that fails or asserts expectations of immediate inputs clearing and pending elements rendering.
- `tests/setup.js` successfully isolates DB runs
- Found that seeding script requires string mapping alignments for Enums and referencing fields natively in Mongo.

### Phase 8: Anonymous Bug
- **Bug**: `POST /api/requests` was mapped to public access without any auth middleware passing. `req.user` remained unconditionally undefined.
- **Fix**: Wrote an `optionalAuth` middleware inside `auth.js` that unpacks JWTs gently for public routes. Adjusted `requestController.js` to strictly parse the destructuring without unconditionally mapping to boolean constants.
- **Answered Prayers Module**: It natively requires an authenticated `user.id`. Anonymous authors intrinsically do not own an immutable ID tied to their submissions in the DOM context, preserving the system boundaries successfully.

## T5: Network-First Strategy
- **Discovery**: `vite.config.js` is perfectly configured for Workbox `NetworkFirst` cache handlers towards `/api/*`. However, `usePrayerRequests.js` defaults to standard fetching states.
- **Action**: Need to enforce `staleTime: 0`, and manual `refetchOnWindowFocus/refetchOnMount` to be highly reactive, simulating network-first data invalidation.
