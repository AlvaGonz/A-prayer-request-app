# API Design

## Authentication

### POST /api/auth/register

*   **Auth:** None (public)
*   **Rate Limit:** 5 requests / 15 min per IP

**Request Body:**
```json
{
  "displayName": "Sarah M.",
  "email": "sarah@example.com",
  "password": "SecureP@ss123"
}
```

**Validation Rules:**
*   `displayName`: required, 2–50 chars, trimmed
*   `email`: required, valid email format, unique
*   `password`: required, min 8 chars, at least 1 number + 1 uppercase

**Success Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": "60f7...",
    "displayName": "Sarah M.",
    "email": "sarah@example.com",
    "role": "member"
  }
}
```

**Error Cases:**
*   `400` — Validation errors
*   `409` — Email already registered

### POST /api/auth/login

*   **Auth:** None (public)
*   **Rate Limit:** 10 requests / 15 min per IP

**Request Body:**
```json
{
  "email": "sarah@example.com",
  "password": "SecureP@ss123"
}
```

**Success Response (200):** Same shape as register response.

**Error Cases:**
*   `400` — Missing fields
*   `401` — Invalid email or password

### GET /api/auth/me

*   **Auth:** JWT required (`Authorization: Bearer <token>`)

**Success Response (200):**
```json
{
  "user": {
    "id": "60f7...",
    "displayName": "Sarah M.",
    "email": "sarah@example.com",
    "role": "member"
  }
}
```

**Error Cases:**
*   `401` — Missing or invalid token

## Prayer Requests

### GET /api/requests

*   **Auth:** None (public, guests can browse)
*   **Query Params:** `page` (default 1), `limit` (default 20, max 50), `status` (default open)

**Success Response (200):**
```json
{
  "requests": [
    {
      "id": "60f8...",
      "body": "Please pray for my mother's surgery tomorrow.",
      "authorName": "Sarah M.",
      "isAnonymous": false,
      "prayedCount": 12,
      "status": "open",
      "createdAt": "2026-02-17T10:30:00Z"
    },
    {
      "id": "60f9...",
      "body": "Going through a difficult season...",
      "authorName": "Anonymous",
      "isAnonymous": true,
      "prayedCount": 5,
      "status": "open",
      "createdAt": "2026-02-17T09:15:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalPages": 3,
    "totalCount": 47
  }
}
```
**NOTE:** The response never exposes the author ObjectId or email — only `authorName`. For anonymous posts, `authorName` is always "Anonymous".

### POST /api/requests

*   **Auth:** Optional — guests can post (anonymous only); logged-in users choose
*   **Rate Limit:** 3 requests / 10 min per IP (guest), 10 / 10 min (member)

**Request Body (Guest):**
```json
{
  "body": "Please pray for healing in my family."
}
```

**Request Body (Member):**
```json
{
  "body": "Pray for my job interview this Friday.",
  "isAnonymous": false
}
```

**Validation Rules:**
*   `body`: required, 10–1000 chars, trimmed, sanitized
*   `isAnonymous`: boolean, defaults to true for guests, false for members

**Success Response (201):**
```json
{
  "request": {
    "id": "60fa...",
    "body": "Pray for my job interview this Friday.",
    "authorName": "Sarah M.",
    "isAnonymous": false,
    "prayedCount": 0,
    "status": "open",
    "createdAt": "2026-02-17T12:00:00Z"
  }
}
```

**Error Cases:**
*   `400` — Body too short / too long / empty
*   `429` — Rate limit exceeded

### POST /api/requests/:id/pray

*   **Auth:** Optional — guests and members can pray
*   **Rate Limit:** 30 requests / min per IP
*   **Request Body:** None / empty `{}`

**Success Response (200):**
```json
{
  "prayedCount": 13,
  "message": "Your prayer has been noted. Thank you for lifting this up."
}
```

**Backend Side-Effects:**
*   Creates a `PrayerInteraction` document
*   Increments `prayedCount` on the `PrayerRequest` (`$inc`)
*   If the request has a registered author with a push subscription → trigger notification (async, non-blocking)

**Error Cases:**
*   `404` — Request not found or deleted
*   `409` — User already prayed for this request (registered users only)
*   `429` — Rate limit exceeded

### PATCH /api/requests/:id/status

*   **Auth:** JWT required — request author or admin

**Request Body:**
```json
{
  "status": "answered"
}
```

**Allowed Status Transitions:**
*   Author: `open` → `answered`
*   Admin: any → `hidden`, `archived`

**Success Response (200):**
```json
{
  "request": { "id": "60fa...", "status": "answered" }
}
```

**Error Cases:**
*   `401` / `403` — Unauthenticated or unauthorized
*   `400` — Invalid status transition

### DELETE /api/requests/:id

*   **Auth:** JWT required — admin only
*   **Behavior:** Soft-deletes the request (`isDeleted = true`, `deletedBy`, `deletedAt` set).

**Success Response (200):**
```json
{ "message": "Request removed." }
```

**Error Cases:**
*   `401` / `403` — Not admin
*   `404` — Not found
