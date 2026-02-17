# Security, Privacy & Spiritual Sensitivity

## Security Concerns

| Concern | Mitigation |
| :--- | :--- |
| **XSS** | Sanitize all user input server-side (DOMPurify or sanitize-html); React auto-escapes JSX output |
| **NoSQL Injection** | Use Mongoose (typed schemas) — never pass raw user input into queries; validate with express-validator |
| **Brute-force login** | Rate limit `/auth/login` to 10 attempts / 15 min per IP |
| **Spam posts** | Rate limit `POST /api/requests` to 3/10 min (guest), 10/10 min (member) |
| **"I prayed" abuse** | Rate limit + dedup via `PrayerInteraction` unique index (registered) or session/IP check (guest) |
| **JWT theft** | Short-lived tokens (e.g. 7 days), HTTPS only in production; store in localStorage (acceptable for V1; HttpOnly cookies as V2 upgrade) |
| **CORS** | Whitelist only the frontend origin |
| **Dependency vulns** | Run `npm audit` regularly; keep packages updated |

## Privacy Considerations

| Concern | Approach |
| :--- | :--- |
| **Anonymous requests** | When `isAnonymous: true`, the API never returns author ID or email in any response. `authorName` is set to "Anonymous" at post time. |
| **Guest data** | Guest posts have no author field at all — no way to trace back to a person. |
| **Public wall** | All requests are public by default. Users should be informed before posting. Add a gentle note: "Your request will be visible to everyone on the prayer wall." |
| **Sensitive content** | Display a content guideline before posting. In V2, consider a flag/report mechanism. |
| **Data retention** | Requests soft-deleted by admins are hidden but retained for audit. Consider a hard-delete policy for V2. |

## Spiritual Sensitivity Guidelines

**IMPORTANT:** This app handles deeply personal spiritual content. The UX must reflect that gravity.

*   **Gentle, reverent copy** — Use warm language: "Lift this up in prayer", "Someone is praying for you", "Your prayer has been heard." Avoid corporate/transactional language.
*   **Avoid gamification** — The "prayed count" is a quiet reassurance, not a leaderboard. Never rank requests by popularity. Never show "top prayers" or "most prayed." Default sort is always newest first.
*   **Respect anonymity** — Make the anonymous option prominent and clearly explain what it means. Never nag anonymous users to reveal identity.
*   **No pressure to share details** — The form should not require categories, tags, or labels. Just text. The simpler the ask, the safer people feel sharing.
*   **Celebrate answered prayers gently** — The "answered" status should be a soft badge (e.g., ✨ Answered), not fireworks. Frame it as a testimony, not a metric.
