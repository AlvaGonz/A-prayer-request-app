# PWA & Notifications Plan (High Level)

## PWA Setup

### manifest.json

```json
{
  "name": "Prayer Board",
  "short_name": "Prayer",
  "description": "Share prayer requests and pray for one another.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1a1a2e",
  "theme_color": "#e2b96f",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Service Worker Strategy

| Asset Type | Caching Strategy | Notes |
| :--- | :--- | :--- |
| **App shell (HTML, CSS, JS)** | Cache-first | Fast repeat loads |
| **API responses (/api/requests)** | Network-first, fall back to cache | Fresh data when online, stale when offline |
| **Fonts / icons** | Cache-first with long TTL | Rarely change |

*   **Offline behavior:** Users can view the most recently cached wall. Posting and "I prayed" actions queue in IndexedDB and sync when back online (background sync — stretch goal for V1).
*   **Tooling:** Use `Workbox` (via `workbox-webpack-plugin` or `vite-plugin-pwa`) for service worker generation.

## Web Push Notifications Plan

### Flow

1.  **User enables notifications**
2.  **Request permission**
3.  **Permission granted**
    *   `POST /api/notifications/subscribe {subscription}`
    *   Save subscription to `User.pushSubscription`
4.  **Later, someone prays...**
    *   `POST /requests/:id/pray` triggers notification
    *   Look up request author's `pushSubscription`
    *   `web-push.sendNotification(subscription, payload)`
5.  **Display notification:** "Someone prayed for your request 🙏"

### Key Decisions

| Decision | Approach |
| :--- | :--- |
| **Where to store subscriptions** | `User.pushSubscription` field in MongoDB |
| **Push library** | `web-push` npm package on the backend |
| **When to prompt** | After login, with a gentle in-app banner ("Enable notifications to know when someone prays for you") — never on first visit |
| **Payload** | Simple: `{ title: "Prayer Board", body: "Someone prayed for your request 🙏", url: "/" }` |
| **V1 scope** | High-level wiring only — full implementation deferred to Milestone 4-5 |
