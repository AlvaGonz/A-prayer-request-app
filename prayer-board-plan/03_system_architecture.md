# System Architecture (High Level)

## Architecture Diagram (Conceptual)

```
Database      Server (Node.js)          Client (Browser / PWA)
[MongoDB] <-> [Express API] <---------> [React SPA]
                            (HTTPS REST)
                            (Web Push)  [Service Worker]
                               ^           |
                               |           v
                            [Push API]  [Cache API]
```

## Recommended Folder Structure

```
prayer-board/
├── client/                     # React frontend (Create React App or Vite)
│   ├── public/
│   │   ├── manifest.json
│   │   ├── service-worker.js
│   │   ├── icons/              # PWA icons (192×192, 512×512)
│   │   └── index.html
│   └── src/
│       ├── api/                # Axios/fetch wrappers for backend calls
│       │   └── index.js
│       ├── components/         # Reusable UI components
│       │   ├── PrayerRequestCard.jsx
│       │   ├── NewPrayerRequestForm.jsx
│       │   ├── Header.jsx
│       │   └── PrayedButton.jsx
│       ├── pages/              # Route-level page components
│       │   ├── PrayerWallPage.jsx
│       │   ├── LoginPage.jsx
│       │   └── RegisterPage.jsx
│       ├── context/            # React Context for auth & global state
│       │   └── AuthContext.jsx
│       ├── hooks/              # Custom hooks
│       │   └── useAuth.js
│       ├── utils/              # Helpers (date formatting, etc.)
│       ├── App.jsx
│       ├── index.js
│       └── index.css
│
├── server/                     # Node.js + Express backend
│   ├── config/
│   │   └── db.js               # MongoDB connection setup
│   ├── middleware/
│   │   ├── auth.js             # JWT verification middleware
│   │   ├── rateLimiter.js      # Express rate limiter
│   │   └── validate.js         # Request validation (Joi or express-validator)
│   ├── models/
│   │   ├── User.js
│   │   ├── PrayerRequest.js
│   │   └── PrayerInteraction.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── requests.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── requestController.js
│   ├── services/               # Business logic (optional in V1, good practice)
│   │   └── notificationService.js
│   ├── utils/
│   │   └── errors.js           # Custom error classes
│   ├── app.js                  # Express app setup
│   └── server.js               # Entry point (listen)
│
├── .env.example
├── .gitignore
├── package.json                # Root-level scripts (concurrently to run client + server)
└── README.md
```

## Where Key Concerns Live

| Concern | Location |
| :--- | :--- |
| **Authentication** | `server/middleware/auth.js` (JWT verify), `server/controllers/authController.js` (register/login), `client/context/AuthContext.jsx` (client-side state) |
| **Validation** | `server/middleware/validate.js` using `express-validator` or `Joi`; frontend form validation in components |
| **Notifications** | `server/services/notificationService.js` (`web-push` package); `client/src/service-worker.js` (push event listener) |
| **Rate Limiting** | `server/middleware/rateLimiter.js` using `express-rate-limit` |
