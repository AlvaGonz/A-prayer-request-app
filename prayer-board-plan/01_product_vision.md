# Product Vision & Non-Goals

## Vision (V1)
*   **Instant access to communal prayer** — anyone can open the app and see or post a prayer request within seconds, no account required.
*   **Low-friction "I prayed" action** — a single tap tells the requester they are not alone; the prayer count provides gentle encouragement.
*   **Works on any device** — installable PWA that runs smoothly on low-end Android phones, tablets, and desktops with minimal data usage.
*   **Respects privacy & anonymity** — users can choose to post anonymously; sensitive spiritual content is handled with care.
*   **Foundation for growth** — clean architecture that can later support groups, comments, notifications, and richer media without a rewrite.

## Non-Goals (Out of Scope for V1)

| Feature | Rationale |
| :--- | :--- |
| **Comments / replies on requests** | Adds moderation complexity; defer to V2 |
| **Rich media (images, audio, video)** | Text-only keeps V1 simple and lightweight |
| **Advanced user profiles / avatars** | Not needed for the core loop |
| **Groups / churches / organizations** | Requires multi-tenancy design; later |
| **Analytics dashboard** | Not part of the core prayer loop |
| **Social sharing (Facebook, Twitter)** | Respect for privacy; evaluate later |
| **In-app messaging / chat** | Out of scope; focus on the wall |
| **Payment / donation features** | Not relevant to V1 |
| **Detailed moderation tools beyond hide/delete** | Simple admin actions are enough for V1 |
| **Email-based notifications** | V1 focuses on web push only (high-level) |
