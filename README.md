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
- **Live Updates**: See new prayer requests and comments appear in real-time.
- **Comments**: Offer words of encouragement on specific requests.
- **Answered Prayers**: meaningful way to mark requests as answered and celebrate with the community.
- **PWA Support**: Install the app on your home screen for a native-like experience with offline capabilities.

### Security & Administration
- **Authentication**: Secure JWT-based login and registration.
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

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Database (Local or Atlas URI)
- npm

### 1. Clone the Repository
```bash
git clone https://github.com/AlvaGonz/A-prayer-request-app.git
cd A-prayer-request-app
```

### 2. Backend Setup
Navigate to the server directory, install dependencies, and configure environment.

```bash
cd prayer-board/server
npm install
```

Create a `.env` file in `prayer-board/server/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_string
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173
```

Start the backend server:
```bash
npm start
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory.

```bash
cd prayer-board
npm install
```

Create a `.env` file in `prayer-board/.env`:
```env
VITE_API_URL=http://localhost:5000
```

Start the frontend development server:
```bash
npm run dev
```

Visit `http://localhost:5173` to view the app!

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

## 🌍 Deployment

### Frontend (Vercel)
The frontend is optimized for **Vercel**.
1. Import the repository to Vercel.
2. Set **Root Directory** to `prayer-board`.
3. Add Environment Variable: `VITE_API_URL` -> (Your Backend URL).
4. Deploy.

### Backend (Render)
The backend is set up for **Render**.
1. Create a **Web Service** on Render connected to the repo.
2. Set **Root Directory** to `prayer-board/server`.
3. **Build Command**: `npm install`
4. **Start Command**: `node server.js`
5. Add Environment Variables (`MONGO_URI`, `JWT_SECRET`, etc.).

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

**"Pray without ceasing."** - 1 Thessalonians 5:17
