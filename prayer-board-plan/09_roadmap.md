# Implementation Roadmap (Milestones)

## Milestone 1 — Foundation & Core Loop (Backend)
**Goal:** Stand up the server, database, and core API so the prayer loop works via API calls.

| Area | Tasks |
| :--- | :--- |
| **Setup** | Initialize Node.js project, install Express, Mongoose, dotenv, cors, express-rate-limit, express-validator, bcryptjs, jsonwebtoken |
| **Database** | Create Mongoose models (User, PrayerRequest, PrayerInteraction); connect to MongoDB Atlas (or local) |
| **Auth API** | `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, JWT middleware |
| **Requests API** | `POST /requests`, `GET /requests` (paginated), `POST /requests/:id/pray` |
| **Validation** | Input validation on all endpoints |
| **Testing** | Test all endpoints with Postman/Thunder Client or a simple .http file |

**Acceptance Criteria:**
*   ✅ Can register, login, and get current user via API
*   ✅ Can create a prayer request (guest + member)
*   ✅ Can list requests (paginated, newest first)
*   ✅ Can "pray" for a request and see count increment
*   ✅ Rate limiting active on key endpoints

## Milestone 2 — Prayer Wall UI
**Goal:** Build the React frontend with the full core loop working end-to-end.

| Area | Tasks |
| :--- | :--- |
| **Setup** | Initialize React app (Vite recommended); configure proxy to backend dev server |
| **Auth UI** | Login page, Register page, AuthContext, "Continue as Guest" |
| **Wall** | `PrayerWallPage` fetching from API, `PrayerRequestCard`, `PrayedButton` with optimistic update |
| **Post** | `NewPrayerRequestForm` modal with anonymous toggle |
| **Styling** | Implement a warm, reverent design system — dark mode with gold accents; responsive layout |
| **Routing** | React Router: `/`, `/login`, `/register` |

**Acceptance Criteria:**
*   ✅ Full core loop works in browser: open app → see wall → post request → tap "I prayed" → count updates
*   ✅ Auth flow: register → login → post named request → logout → continue as guest
*   ✅ Responsive on mobile and desktop
*   ✅ Beautiful, spiritually appropriate UI

## Milestone 3 — Admin Actions & Request Lifecycle
**Goal:** Admins can moderate; authors can mark requests as answered.

| Area | Tasks |
| :--- | :--- |
| **Backend** | `PATCH /requests/:id/status` (author: answered; admin: hidden/archived), `DELETE /requests/:id` (admin soft-delete) |
| **Frontend** | Show status badges ("Answered" ✨), admin controls (hide/delete) on cards for admin users |
| **Seed Data** | Create a script to seed an admin user and sample requests for testing |

**Acceptance Criteria:**
*   ✅ Admin can hide/delete requests from the wall
*   ✅ Author can mark own request as "answered"
*   ✅ Hidden/deleted requests don't appear on the wall

## Milestone 4 — PWA Shell
**Goal:** App is installable and performs basic offline caching.

| Area | Tasks |
| :--- | :--- |
| **Manifest** | Add `manifest.json` with icons, theme, display mode |
| **Service Worker** | Set up `Workbox` for asset caching + network-first API caching |
| **Icons** | Generate PWA icons (192×192, 512×512) |
| **Testing** | Test install-to-homescreen on Android Chrome; audit with Lighthouse |

**Acceptance Criteria:**
*   ✅ App passes Lighthouse PWA audit (basic)
*   ✅ App installable on Android/Chrome desktop
*   ✅ Cached wall viewable offline (read-only)

## Milestone 5 — Push Notifications (High-Level Wiring)
**Goal:** Registered users can opt in to notifications and receive a push when someone prays for their request.

| Area | Tasks |
| :--- | :--- |
| **Backend** | Install `web-push`; generate VAPID keys; `POST /api/notifications/subscribe`; trigger push in "pray" endpoint |
| **Frontend** | Notification opt-in banner after login; `Notification.requestPermission()`; send subscription to backend |
| **Service Worker** | Listen for push event and display notification |

**Acceptance Criteria:**
*   ✅ User can enable notifications
*   ✅ When someone prays for their request, a push notification appears
*   ✅ Notification links back to the app

## Milestone Sequence Visualization

*   **M1**: Foundation & Core Loop
*   **M2**: Prayer Wall UI
*   **M3**: Admin & Lifecycle
*   **M4**: PWA Shell
*   **M5**: Push Notifications

**TIP:** Milestones 1 and 2 are the critical path. Once both are complete, you have a working, testable V1 core loop. Milestones 3–5 add polish and can be shipped incrementally.
