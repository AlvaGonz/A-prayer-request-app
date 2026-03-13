# Prayer Board - AGENTS.md

> This file contains essential information for AI coding agents working on the Prayer Board project.

## Project Overview

**Prayer Board** is a Progressive Web App (PWA) designed for communities to share prayer requests, offer encouragement, and support one another. It supports bilingual interface (English/Spanish) and features real-time updates, offline capabilities, and a reverent gold-accented dark theme.

- **Live Frontend:** https://prayer-board-virid.vercel.app
- **Live Backend:** https://prayer-board-api.onrender.com

## Architecture

This is a **full-stack JavaScript application** with separate frontend and backend:

```
Prayer-Board app/                 # Repository root
├── package.json                  # Root build script only
├── prayer-board/                 # Main application directory
│   ├── package.json              # Frontend dependencies & scripts
│   ├── vite.config.js            # Vite + PWA configuration
│   ├── index.html                # HTML entry point
│   ├── src/                      # Frontend React source code
│   ├── server/                   # Backend Express API
│   │   ├── package.json          # Backend dependencies
│   │   ├── server.js             # Express entry point
│   │   ├── models/               # Mongoose schemas
│   │   ├── routes/               # API route handlers
│   │   ├── controllers/          # Route logic
│   │   └── middleware/           # Auth & error handling
│   ├── public/                   # Static assets & PWA icons
│   ├── dist/                     # Production build output
│   └── e2e/                      # Playwright E2E tests
└── render.yaml                   # Render deployment config
```

## Technology Stack

### Frontend
- **Framework:** React 19 + Vite 7
- **Routing:** React Router v7
- **State Management:** TanStack Query (React Query) v5 + React Context
- **UI Components:** Radix UI (Dialog, Dropdown Menu, Alert Dialog)
- **Animations:** Framer Motion (with LazyMotion optimization)
- **Styling:** Vanilla CSS3 with CSS variables for theming
- **Icons:** Lucide React
- **Forms:** React Hook Form
- **Real-time:** Socket.IO Client
- **Internationalization:** i18next + react-i18next
- **PWA:** Vite PWA Plugin + Workbox (StaleWhileRevalidate caching)
- **Monitoring:** Sentry React, Vercel Analytics

### Backend
- **Runtime:** Node.js + Express 5
- **Database:** MongoDB (via Mongoose 9)
- **Authentication:** JWT (jsonwebtoken) + bcryptjs
- **Security:** Helmet, express-rate-limit, CORS, sanitize-html
- **Type:** CommonJS modules (`"type": "commonjs"`)

### Testing
- **Unit Tests:** Vitest + React Testing Library + jsdom
- **E2E Tests:** Playwright
- **Coverage:** Built-in Vitest coverage

## Development Commands

### Root Directory Commands
```bash
# Build the entire application (for deployment)
npm run build
```

### Frontend Commands (in `prayer-board/`)
```bash
cd prayer-board

# Development
npm run dev              # Run both frontend and backend concurrently
npm run dev:client       # Frontend only (Vite dev server on port 5173)
npm run dev:server       # Backend only (Express on port 5000)

# Build & Preview
npm run build            # Build for production (outputs to dist/)
npm run preview          # Preview production build locally

# Testing
npm test                 # Run unit tests (Vitest)

# Linting
npm run lint             # ESLint check
```

### Backend Commands (in `prayer-board/server/`)
```bash
cd prayer-board/server

# Development
npm run dev              # Run with nodemon-like watch mode (node --watch)
npm start                # Production start

# Testing
npm test                 # Run backend tests (Vitest)

# Database
npm run seed             # Run database seed script
```

## Environment Variables

### Frontend (`prayer-board/.env.local`)
Copy from `.env.example`:
```env
# Backend API URL
VITE_API_URL=http://localhost:5000        # Development
# VITE_API_URL=https://your-backend.onrender.com  # Production
```

### Backend (`prayer-board/server/.env`)
Required variables:
```env
NODE_ENV=development|production
PORT=5000                    # Render uses 10000 in production
MONGO_URI=mongodb+srv://...  # MongoDB Atlas connection string
JWT_SECRET=your-secret-key   # For JWT token signing
```

## Code Style Guidelines

### JavaScript/React
- **Module System:** ES Modules (`"type": "module"`) in frontend, CommonJS in backend
- **File Extensions:** `.jsx` for React components, `.js` for utilities
- **Imports:** Use named imports where possible
- **React Components:** Functional components with hooks
- **Error Handling:** Use Error Boundaries for React components

### CSS
- Use CSS custom properties (variables) for theming
- Component-scoped CSS files (e.g., `ComponentName.css`)
- Global styles in `src/index.css` and `src/styles/themes.css`
- Dark theme is default; gold accents for religious context

### Key Patterns
1. **Server State:** Use TanStack Query (useQuery, useMutation) for API data
2. **Optimistic Updates:** Implement for prayer count and comments
3. **Virtualization:** Use @tanstack/react-virtual for long lists
4. **PWA Caching:** Workbox runtime caching for `/api/requests` (NetworkFirst)

## Testing Strategy

### Unit Tests (`src/__tests__/`, `src/**/*.test.jsx`)
- Test components with React Testing Library
- Mock API calls with MSW (Mock Service Worker)
- Test file naming: `ComponentName.test.jsx`
- Setup in `src/setupTests.js`

### E2E Tests (`e2e/`)
- Playwright tests for critical user flows
- Test authentication, prayer creation, prayer actions
- Run with `npx playwright test`

### Test Data
- Backend uses `mongodb-memory-server` for test database
- Frontend tests use mocked data

## Security Considerations

### Backend
1. **CORS:** Whitelist specific origins (see `server.js` allowedOrigins array)
2. **Rate Limiting:**
   - Auth endpoints: 5 attempts per 15 minutes
   - Prayer actions: 30 per minute
   - General API: 100 requests per hour
3. **Helmet:** CSP headers in report-only mode for gradual rollout
4. **Input Sanitization:** sanitize-html for user-generated content
5. **Authentication:** JWT tokens with 24h expiration

### Frontend
1. **PWA:** Service Worker cache isolation with versioned cache names
2. **Environment:** No sensitive data in Vite env vars (VITE_ prefix exposes to client)

## API Routes

### Authentication (`/api/auth`)
- `POST /register` - Create account
- `POST /login` - Authenticate
- `GET /me` - Get current user (protected)

### Prayer Requests (`/api/requests`)
- `GET /` - List all requests (paginated)
- `POST /` - Create new request (protected)
- `GET /:id` - Get single request
- `PUT /:id` - Update request (owner/admin only)
- `DELETE /:id` - Soft delete (owner/admin only)
- `POST /:id/pray` - Increment prayer count
- `PATCH /:id/answer` - Mark as answered (owner/admin only)

### Comments (`/api/comments`)
- `GET /requests/:id/comments` - List comments for request
- `POST /requests/:id/comments` - Add comment
- `PUT /comments/:id` - Edit own comment
- `DELETE /comments/:id` - Delete own comment

### Shared (`/api/shared`)
- `GET /:token` - Access shared prayer request via token

### Health Check
- `GET /api/health` - Keep-alive endpoint (used by UptimeRobot)

## Database Models

### PrayerRequest
- `body` (String, required, max 1000 chars)
- `isAnonymous` (Boolean, default: false)
- `author` (ObjectId, ref: User, nullable)
- `authorName` (String, default: 'Anonymous')
- `prayedCount` (Number, default: 0)
- `commentCount` (Number, default: 0)
- `status` (Enum: 'open', 'answered', 'archived', 'hidden')
- `testimony` (String, max 1000 chars, nullable)
- `shareToken` (String, unique, sparse index)
- `isDeleted` (Boolean, default: false)
- Timestamps: `createdAt`, `updatedAt`

### User
- `displayName` (String, required, max 50 chars)
- `email` (String, required, unique)
- `password` (String, required, hashed with bcrypt)
- `role` (Enum: 'member', 'admin', default: 'member')
- `isActive` (Boolean, default: true)
- Timestamps: `createdAt`, `updatedAt`

### Comment
- `body` (String, required)
- `request` (ObjectId, ref: PrayerRequest)
- `author` (ObjectId, ref: User, nullable for guests)
- `authorName` (String)
- `isDeleted` (Boolean)
- Timestamps: `createdAt`, `updatedAt`

## Deployment

### Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. Root Directory: `prayer-board`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variables: Set `VITE_API_URL` to backend URL

### Backend (Render)
1. Connect GitHub repo to Render
2. Root Directory: `prayer-board/server`
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Environment Variables: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`

### Manual Deployment (deploy.sh)
Run `./deploy.sh` from the project root for local build verification.

## Common Tasks

### Adding a New API Endpoint
1. Add route in `server/routes/`
2. Add controller logic in `server/controllers/`
3. Add middleware in `server/middleware/` if needed
4. Import route in `server/server.js`

### Adding a New Component
1. Create component file in `src/components/`
2. Create CSS file with same name
3. Add tests in `src/__tests__/`
4. Export from component file, import where needed

### Adding i18n Translations
1. Add key to both `src/i18n/locales/en.json` and `es.json`
2. Use `const { t } = useTranslation()` hook in components
3. Reference with `t('key.subkey')`

### Updating PWA Cache Version
1. Increment `APP_VERSION` in `vite.config.js`
2. This forces cache refresh for all users

## Troubleshooting

### MongoDB Connection Issues
- Check `MONGO_URI` environment variable
- Ensure IP whitelist in MongoDB Atlas includes Render/Vercel IPs

### CORS Errors
- Add frontend URL to `allowedOrigins` array in `server.js`
- Check that `VITE_API_URL` matches backend URL exactly

### PWA Cache Issues
- Increment `APP_VERSION` in vite.config.js
- Clear browser cache and unregister service worker

### Rate Limiting in Development
- Set `NODE_ENV=development` to relax rate limits

## File Organization Notes

- **Agent Skills:** `.agent/skills/` contains specialized AI agent instructions
- **Design System:** `design-system/` contains UI/UX specifications
- **API Routes:** `api/` at root level is for Vercel serverless functions (og.jsx for Open Graph)

---

**Last Updated:** March 2026
**Project Version:** 1.1.0
