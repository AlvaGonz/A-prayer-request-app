# Prayer Board - Full Stack Deployment Guide

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│    Backend      │────▶│    MongoDB      │
│  (React/Vite)   │◀────│  (Node/Express) │◀────│    (Atlas)      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Step 1: MongoDB Atlas Setup (Database)

1. **Create Account**
   - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
   - Sign up or log in
   - Create new project named "PrayerBoard"

2. **Create Free Cluster**
   - Click "Build a Database"
   - Choose **M0 Free (Shared)** tier
   - Select cloud provider (AWS recommended)
   - Choose region closest to your users
   - Click "Create Cluster" (takes 1-3 minutes)

3. **Security Setup**
   - **Database Access**: Create user
     - Username: `prayerboard_user`
     - Password: Generate strong password
     - Role: **Read and write to any database**
   - **Network Access**: Add IP address
     - Click "Add IP Address"
     - Select **"Allow Access from Anywhere"** (0.0.0.0/0)
     - This is required for Render/Vercel deployment

4. **Get Connection String**
   - Click "Connect" → "Drivers"
   - Select "Node.js"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Example: `mongodb+srv://prayerboard_user:YourPassword@cluster0.xxxxx.mongodb.net/prayer-board?retryWrites=true&w=majority`

## Step 2: Backend Deployment (Render - Recommended)

### Option A: Using Render Web Service (Free)

1. **Push to GitHub**
   ```bash
   # From project root
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/prayer-board.git
   git push -u origin main
   ```

2. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

3. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the repository
   
4. **Configure Service**
   - **Name**: `prayer-board-api`
   - **Runtime**: Node
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Plan**: Free

5. **Add Environment Variables**
   ```
   MONGO_URI=mongodb+srv://prayerboard_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/prayer-board?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_key_change_this_in_production
   NODE_ENV=production
   PORT=10000
   ```

6. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete
   - Copy the URL (e.g., `https://prayer-board-api.onrender.com`)

## Step 3: Frontend Deployment

### Option A: Render Static Site (Easiest)

1. **Create Static Site**
   - In Render dashboard, click "New" → "Static Site"
   - Select same repository

2. **Configure**
   - **Name**: `prayer-board`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: Free

3. **Add Environment Variable**
   ```
   VITE_API_URL=https://prayer-board-api.onrender.com
   ```

4. **Deploy**
   - Click "Create Static Site"

### Option B: Vercel (Better Performance)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd prayer-board
   vercel
   ```

3. **Add Environment Variable**
   - Go to Vercel dashboard
   - Project Settings → Environment Variables
   - Add: `VITE_API_URL=https://prayer-board-api.onrender.com`
   - Redeploy

### Option C: GitHub Pages (Static Only)

⚠️ **Warning**: GitHub Pages only hosts static files. You still need Render/Railway for the backend.

1. **Update vite.config.js**
   ```javascript
   export default defineConfig({
     base: '/prayer-board/', // Your repo name
     // ... rest of config
   })
   ```

2. **Deploy**
   - Go to repository Settings → Pages
   - Source: Deploy from branch
   - Branch: main /root
   - Add GitHub Action for automatic deployment

## Step 4: Update Frontend API URL

In `prayer-board/src/api/index.js`, set:

```javascript
const USE_MOCK_API = false;
```

Or use environment variable:

Create `.env.local`:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Backend
```bash
cd prayer-board/server
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI

npm start
# Server runs on http://localhost:5000
```

### Frontend
```bash
cd prayer-board
npm install
npm run dev
# App runs on http://localhost:5173
```

## Testing

### API Endpoints

Test with curl or Postman:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"displayName":"Test User","email":"test@test.com","password":"Password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Password123"}'

# Get Prayer Requests
curl http://localhost:5000/api/requests

# Create Request (requires auth token)
curl -X POST http://localhost:5000/api/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"body":"Please pray for my family","isAnonymous":false}'
```

## Troubleshooting

### MongoDB Connection Issues
- **ECONNREFUSED**: Check IP whitelist (0.0.0.0/0)
- **Authentication failed**: Verify username/password in connection string
- **DNS timeout**: Check internet connection, try different MongoDB region

### CORS Issues
Backend should allow your frontend URL:
```javascript
app.use(cors({
  origin: ['https://your-frontend-url.com', 'http://localhost:5173']
}));
```

### Environment Variables Not Working
- Render: Check they're set in dashboard, not just .env file
- Vercel: Redeploy after adding env vars
- Local: Use `.env.local` for Vite, `.env` for backend

## Security Checklist

- [ ] Change JWT_SECRET to random string (32+ chars)
- [ ] Use strong MongoDB password
- [ ] Enable MongoDB Atlas IP whitelist (not 0.0.0.0/0 in production)
- [ ] Use HTTPS in production
- [ ] Set secure CORS origins
- [ ] Don't commit .env files to GitHub

## Cost Estimates (Free Tier)

| Service | Free Tier Limits |
|---------|------------------|
| **MongoDB Atlas** | 512MB storage, 1M reads/day |
| **Render Web** | 512MB RAM, sleeps after 15min |
| **Render Static** | 100GB bandwidth |
| **Vercel** | 100GB bandwidth, 6000 build mins |

All free tiers are sufficient for small-medium prayer boards!

## Next Steps

1. ✅ Set up MongoDB Atlas
2. ✅ Deploy backend to Render
3. ✅ Deploy frontend to Render/Vercel
4. ✅ Test all features
5. ✅ Invite your community!

## Support

- MongoDB: [docs.mongodb.com](https://docs.mongodb.com)
- Render: [render.com/docs](https://render.com/docs)
- Vercel: [vercel.com/docs](https://vercel.com/docs)

---

**Questions?** Check the main README.md or open an issue on GitHub.
