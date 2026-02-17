# Frontend Screens & Components

## Screen Map

1.  **App Launch**
    *   Logged in?
        *   Yes: **Prayer Wall Page**
        *   No: **Prayer Wall Page (guest mode)**
2.  **Navigation**
    *   'Login / Register' button in header
        *   **Login Page**
        *   **Register Page**
    *   Tap 'I Prayed' on a card
    *   Tap 'New Request' FAB/button
        *   **New Prayer Request Form (modal)**

## Components Breakdown

### `<App />`

*   **Responsibilities:** Top-level routing (`react-router-dom`), wraps everything in `<AuthProvider>`.
*   **Routes:**
    *   `/` → `<PrayerWallPage />`
    *   `/login` → `<LoginPage />`
    *   `/register` → `<RegisterPage />`

### `<Header />`

*   **Responsibilities:** App title/logo, auth status display, login/register or logout buttons.
*   **Props/State:** Consumes `AuthContext` to show user name or "Guest".
*   **Key Details:** Sticky top bar, minimal height. Shows a subtle cross icon or app name.

### `<PrayerWallPage />`

*   **Responsibilities:** Fetches and displays paginated prayer requests. Contains the "New Request" button.
*   **State:**
    *   `requests[]` — array of prayer request objects
    *   `page` / `hasMore` — pagination
    *   `loading` / `error` — fetch states
*   **Behavior:**
    *   On mount: `GET /api/requests?page=1`
    *   Infinite scroll or "Load More" button for pagination
    *   Optimistic UI update when "I prayed" is tapped

### `<PrayerRequestCard />`

*   **Props:** `{ id, body, authorName, isAnonymous, prayedCount, status, createdAt }`
*   **Responsibilities:**
    *   Displays the request text, author (or "Anonymous"), relative timestamp
    *   Renders the `<PrayedButton />` with count
    *   Shows a subtle "Answered" badge if `status === 'answered'`
*   **Design Notes:**
    *   Soft card with rounded corners, gentle shadow
    *   Prayer text in a readable serif or sans-serif font
    *   Muted color palette — warm whites, soft blues, gentle gold accents

### `<PrayedButton />`

*   **Props:** `{ requestId, initialCount, onPrayed }`
*   **Responsibilities:**
    *   Renders a 🙏 icon + count
    *   On tap: calls `POST /api/requests/:id/pray`, increments count optimistically
    *   Disables after tap (for registered users, to prevent duplicates; guests get a session-based cooldown)
*   **Animation:** Gentle pulse/glow on tap (a moment of reverence, not gamification)

### `<NewPrayerRequestForm />`

*   **Rendered as:** Modal overlay triggered by a floating action button (FAB) on the wall
*   **Fields:**
    *   Text area for the prayer request body (max 1000 chars, char counter shown)
    *   Toggle: "Post anonymously" (only shown to logged-in users; guests are always anonymous)
*   **State:** `body`, `isAnonymous`, `submitting`, `error`
*   **On Submit:** `POST /api/requests` → on success, close modal and prepend new request to wall

### `<LoginPage />` and `<RegisterPage />`

*   **Responsibilities:** Standard form with email/password (+ display name for register)
*   **On Submit:** Call auth API → on success, store JWT in `AuthContext` (localStorage) and redirect to wall
*   **Includes:** "Continue as Guest" link that simply navigates back to the wall with no auth

### `<AuthContext />`

*   **Stored State:** `user` object (or null), `token` (or null), `isAuthenticated` boolean
*   **Methods:** `login(email, password)`, `register(data)`, `logout()`, `loadUser()` (from JWT)
*   **Persistence:** JWT stored in `localStorage`; on app load, call `GET /api/auth/me` to verify

## UI Flow Summary

1.  **App opens** → Prayer Wall loads immediately (no auth gate)
2.  **Guest** sees requests + "I Prayed" buttons + "New Request" button
3.  **Guest** taps "New Request" → modal opens, posts anonymously
4.  **Guest** taps "I Prayed" → count increments, gentle animation
5.  **Guest** taps "Login" → Login page → enters credentials → redirected to wall with auth
6.  **Member** posts → can choose anonymous or named → request appears on wall
7.  **Member** receives notification → "Someone prayed for your request 🙏" (V1 nice-to-have)
