# Prayer Board PWA

A community prayer wall application where users can share prayer requests and pray for one another.

## Features

- **Guest Access**: Browse and post anonymous prayer requests without creating an account
- **User Accounts**: Register to post with your name or anonymously
- **Prayer Counter**: Tap "I Prayed" to show support and encourage others
- **Answered Prayers**: Mark requests as answered to celebrate with the community
- **Admin Controls**: Moderators can hide, archive, or delete inappropriate content
- **PWA Support**: Install to your home screen and use offline
- **Push Notifications**: Get notified when someone prays for your request (high-level wiring included)

## Tech Stack

- **Frontend**: React + Vite
- **PWA**: vite-plugin-pwa with Workbox
- **Routing**: React Router
- **Icons**: Lucide React
- **Date Formatting**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd prayer-board
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## Demo Data

The app comes pre-seeded with sample prayer requests. To reset or modify:

1. Open browser DevTools
2. Go to Application → Local Storage
3. Clear `prayerBoard_requests` to reset

## Creating an Admin User

To create an admin user for testing:

1. Register a new account
2. Open browser DevTools → Application → Local Storage
3. Find `prayerBoard_users`
4. Edit the user object and change `"role": "member"` to `"role": "admin"`
5. Refresh the page

## Connecting to Backend

This frontend uses a mock API layer that stores data in localStorage. To connect to a real backend:

1. Update `src/api/index.js` to make real HTTP requests:
   - Replace `authAPI` methods with calls to `/api/auth/*`
   - Replace `requestsAPI` methods with calls to `/api/requests/*`
   - Replace `notificationsAPI.subscribe` with real push subscription

2. The API is already structured to match the backend specification in `prayer-board-plan/05_api_design.md`

3. CORS is configured in `vite.config.js` to proxy `/api` to `http://localhost:5000`

## Project Structure

```
prayer-board/
├── src/
│   ├── api/
│   │   └── index.js          # API layer (mock or real)
│   ├── components/
│   │   ├── Header.jsx        # Navigation header
│   │   ├── PrayerRequestCard.jsx  # Individual prayer card
│   │   ├── PrayedButton.jsx  # Prayer counter button
│   │   ├── NewPrayerRequestForm.jsx  # Modal for new requests
│   │   └── NotificationBanner.jsx    # Push notification opt-in
│   ├── context/
│   │   └── AuthContext.jsx   # Authentication state
│   ├── pages/
│   │   ├── PrayerWallPage.jsx    # Main prayer wall
│   │   ├── LoginPage.jsx     # Login form
│   │   └── RegisterPage.jsx  # Registration form
│   ├── App.jsx               # Main app with routing
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── public/
│   └── icons/                # PWA icons
├── vite.config.js            # Vite + PWA config
└── index.html
```

## PWA Features

- **Installable**: Add to home screen on mobile/desktop
- **Offline Support**: View cached prayer requests when offline
- **Responsive**: Works on all screen sizes
- **Theme**: Dark mode with warm gold accents

## Spiritual Sensitivity

This app is designed with reverence for the spiritual nature of prayer:

- Gentle, warm language throughout
- No gamification or leaderboards
- Anonymous option always available
- Celebrates answered prayers quietly
- Respects privacy and anonymity

## License

MIT
