# Prayer Board 🙏

A meaningful Progressive Web App (PWA) designed for communities to share prayer requests, offer encouragement, and support one another in a privacy-focused digital space.Built with a modern tech stack to ensure responsiveness, accessibility, and real-time interaction.

## 🚀 Live Demo

- **Frontend (Vercel):** [https://prayer-board-virid.vercel.app](https://prayer-board-virid.vercel.app/)
- **Backend (Render):** [https://prayer-board-api.onrender.com](https://prayer-board-api.onrender.com)

## ✨ Features

### Core Experience
- **Request Prayer**: Post prayer requests anonymously or as a registered user.
- **Prayer Counter**: Tap "I Prayed" to instantly encourage others and track community support.
- **Translation / Internationalization**: Full support for **English** and **Spanish** (Español).
- **Responsive Design**: A reverent, gold-accented dark theme that works beautifully on mobile and desktop.

### Community & Real-Time
- **Comments**: Offer words of encouragement on specific requests. Users can edit or delete their own comments.
- **Shareable Links**: Generate private, secure links to share specific prayer requests. Guests can pray and comment without creating an account.
- **Answered Prayers**: A meaningful way to mark requests as answered and celebrate with the community.
- **PWA Support**: Install the app on your home screen for a native-like experience with offline capabilities.

### Performance & Reliability
- **Instant Loads (<100ms)**: Implements aggressive Service Worker caching (`StaleWhileRevalidate`) to serve cached prayer requests instantly while updating in the background.
- **Optimized Payloads**: Strategic pagination limits the initial load to reduce database serialization overhead.
- **Zero Cold Starts**: A dedicated `/api/health` endpoint is used in conjunction with UptimeRobot to prevent Render's free tier from hibernating.

### Security & Administration
- **Authentication**: Secure JWT-based login and registration.
- **Guest Interactions**: Secure handling of anonymous or unauthenticated guest interactions via share tokens.
- **Moderation**: Admin tools to hide or delete inappropriate content.
- **Rate Limiting**: API protection against spam and abuse.
- **Data Privacy**: Input sanitization and secure password hashing.

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Vanilla CSS3 (Custom Properties & Responsive Design)
- **State Management**: React Context API
- **Routing**: React Router v7
- **Real-Time**: Socket.IO Client
- **PWA**: Vite PWA Plugin + Workbox
- **Internationalization**: i18next & react-i18next
- **Icons**: Lucide React
- **Utilities**: date-fns for time formatting

### Backend
- **Runtime**: Node.js & Express
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs
- **Security**: express-rate-limit, cors, sanitize-html
- **Deployment**: Render (Web Service)

---

## 📂 Project Structure

```
prayer-board/
├── dist/                 # Production build output
├── public/               # Static assets & PWA icons
├── server/               # Backend Node.js API
│   ├── config/           # DB connection
│   ├── controllers/      # Route logic
│   ├── middleware/       # Auth & Error handling
│   ├── models/           # Mongoose Schemas (User, Request, Comment)
│   ├── routes/           # API endpoints
│   └── server.js         # Entry point
├── src/
│   ├── api/              # API integration (fetch wrapper)
│   ├── components/       # Reusable UI components
│   ├── context/          # Global State (Auth, Socket)
│   ├── locales/          # i18n JSON files (en, es)
│   ├── pages/            # Application views
│   ├── App.jsx           # Main layout
│   └── main.jsx          # React entry
├── index.html
└── vite.config.js
```

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

**"Pray without ceasing."** - 1 Thessalonians 5:17
