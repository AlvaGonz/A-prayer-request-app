# Prayer Board

A Progressive Web App (PWA) for Christian communities to share prayer requests and support one another through prayer and encouragement.

**This is a problem-solving project designed to provide a privacy-focused, accessible digital space for communal prayer.**

## 🚀 Live Demo

- **Frontend (Vercel):** [https://prayer-board-frontend.vercel.app](https://prayer-board-frontend.vercel.app)
- **Backend (Render):** [https://prayer-board-api.onrender.com](https://prayer-board-api.onrender.com)


## Features

### Core Features
- **Guest Access**: Browse the prayer wall and post anonymous prayer requests without creating an account
- **User Authentication**: Register and login with email/password to post with your name or anonymously
- **Prayer Counter**: Tap "I Prayed" to show support and encourage others
- **Comments**: Engage in supportive dialogue by commenting on prayer requests (real-time updates)
- **Answered Prayers**: Mark requests as answered to celebrate with the community
- **Admin Controls**: Moderators can hide, archive, or delete inappropriate content

### PWA Features
- **Installable**: Add to home screen on mobile/desktop
- **Offline Support**: View cached prayer requests when offline
- **Responsive Design**: Works beautifully on all screen sizes
- **Dark Theme**: Warm, reverent design with gold accents

### Real-Time Features
- **Live Comments**: See new comments appear instantly without refreshing
- **In-App Notifications**: Get notified when someone comments on your prayer requests
- **WebSocket Ready**: Architecture prepared for full WebSocket backend integration

## Tech Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router v6
- **State Management**: React Context (Auth, Socket)
- **Real-Time**: Socket.IO (client-side with local event emitter for demo)
- **Styling**: CSS3 with CSS Variables
- **Icons**: Lucide React
- **Date Formatting**: date-fns
- **PWA**: vite-plugin-pwa with Workbox
- **Deployment**: Vercel (Frontend) + Render (Backend)


## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone or navigate to the project
cd prayer-board

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` folder, ready to deploy.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
prayer-board/
├── src/
│   ├── api/
│   │   └── index.js              # Mock API layer (localStorage-based)
│   ├── components/
│   │   ├── CommentItem.jsx       # Individual comment display
│   │   ├── CommentSection.jsx    # Expandable comments section
│   │   ├── Header.jsx            # Navigation header
│   │   ├── NewPrayerRequestForm.jsx  # Modal for new requests
│   │   ├── NotificationBanner.jsx    # Push notification opt-in
│   │   ├── PrayerRequestCard.jsx     # Individual prayer card
│   │   └── PrayedButton.jsx      # Prayer counter button
│   ├── context/
│   │   ├── AuthContext.jsx       # Authentication state
│   │   └── SocketContext.jsx     # WebSocket/real-time state
│   ├── pages/
│   │   ├── PrayerWallPage.jsx    # Main prayer wall
│   │   ├── LoginPage.jsx         # Login form
│   │   └── RegisterPage.jsx      # Registration form
│   ├── App.jsx                   # Main app with routing
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles & CSS variables
├── public/
│   └── icons/                    # PWA icons (192x192, 512x512)
├── vite.config.js                # Vite + PWA configuration
└── index.html
```

## Demo Data

The app comes pre-seeded with sample prayer requests. To reset:

1. Open browser DevTools → Application → Local Storage
2. Clear all `prayerBoard_*` keys
3. Refresh the page

## Creating an Admin User

1. Register a new account through the UI
2. Open DevTools → Application → Local Storage
3. Find `prayerBoard_users`
4. Edit your user object and change `"role": "member"` to `"role": "admin"`
5. Refresh the page

## Connecting to a Real Backend

Currently, the app uses a mock API that stores data in localStorage. To connect to a real backend:

1. **Update the API layer** (`src/api/index.js`):
   - Replace localStorage calls with fetch/axios HTTP requests
   - Connect to your backend at `/api/*` endpoints
   - The API structure already matches REST conventions

2. **Enable real WebSocket** (`src/context/SocketContext.jsx`):
   - Replace the mock socket with real Socket.IO connection:
   ```javascript
   const socket = io('http://your-backend-url:5000');
   ```

3. **Backend API Specification** (from prayer-board-plan):
   - `GET /api/requests` - List prayer requests
   - `POST /api/requests` - Create new request
   - `POST /api/requests/:id/pray` - Increment prayer count
   - `GET /api/requests/:id/comments` - Get comments
   - `POST /api/requests/:id/comments` - Add comment
   - `DELETE /api/comments/:id` - Delete comment
   - `POST /api/auth/register` - Register
   - `POST /api/auth/login` - Login

## Color Palette

The app uses a warm, reverent color scheme:

| Variable | Color | Hex |
|----------|-------|-----|
| `--color-bg-primary` | Deep Navy | `#1a1a2e` |
| `--color-bg-secondary` | Dark Blue | `#16213e` |
| `--color-bg-card` | Card Background | `#252544` |
| `--color-accent-gold` | Gold | `#e2b96f` |
| `--color-accent-gold-hover` | Gold Hover | `#d4a85c` |
| `--color-text-primary` | White | `#eaeaea` |
| `--color-text-secondary` | Light Gray | `#a0a0b0` |

Alternative palette mentioned:
- Dark Teal: `#1a495a`
- White: `#ffffff`
- Gold/Brown: `#b4884d`

## Spiritual Sensitivity

This app is designed with reverence for prayer:

- **Gentle Language**: "Lift this up in prayer", "Someone is praying for you"
- **No Gamification**: Prayer count is encouragement, not a leaderboard
- **Privacy First**: Anonymous option always available
- **Respectful UI**: Soft animations, no pressure tactics
- **Celebration**: Answered prayers shown gently, not as metrics

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## PWA Installation

### Android
1. Open the app in Chrome
2. Tap the menu (⋮) → "Add to Home screen"
3. Follow the prompts

### iOS
1. Open the app in Safari
2. Tap Share → "Add to Home Screen"
3. Tap "Add"

### Desktop (Chrome/Edge)
1. Look for the install icon (➕) in the address bar
2. Click "Install"

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Code Style

- Functional React components with hooks
- CSS Modules for component-specific styles
- Context API for global state
- PropTypes or TypeScript (TypeScript recommended for production)

## Roadmap

### V1 (Current) ✅
- Basic prayer wall
- Authentication
- Prayer counter
- PWA support

### V2 (In Progress) 🚧
- **Comments with real-time updates** ✅
- In-app notifications ✅
- Admin controls ✅

### Future (V3+)
- Groups/Churches (private prayer walls)
- Email notifications
- Prayer categories
- User profiles
- Prayer partnerships
- Testimonies section

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this for your church or community!

## Acknowledgments

- Built with ❤️ for Christian communities worldwide
- Icons by [Lucide](https://lucide.dev/)
- PWA support via [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)

---

**Pray without ceasing.** - 1 Thessalonians 5:17
