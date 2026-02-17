# Automatic Deployment with GitHub Actions

This guide will help you set up automatic deployment to Render whenever you push to GitHub.

## Setup Steps

### 1. Get Render API Key

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your profile (top right) → **Account Settings**
3. Scroll down to **API Keys**
4. Click **Create API Key**
5. Copy the key (you'll only see it once!)

### 2. Get Service IDs

**Backend Service ID:**
1. Go to your backend service in Render dashboard
2. Look at the URL: `https://dashboard.render.com/web/srv-xxxxxxxxxx`
3. The service ID is: `srv-xxxxxxxxxx`

**Frontend Service ID:**
1. Go to your static site in Render dashboard
2. Look at the URL: `https://dashboard.render.com/static/srv-yyyyyyyyyy`
3. The service ID is: `srv-yyyyyyyyyy`

### 3. Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these secrets:

```
Name: RENDER_API_KEY
Value: rnd_xxxxxxxxxxxxxxxxxxxxxx (your API key from step 1)

Name: RENDER_BACKEND_SERVICE_ID
Value: srv-xxxxxxxxxx (from step 2)

Name: RENDER_FRONTEND_SERVICE_ID
Value: srv-yyyyyyyyyy (from step 2)

Name: VITE_API_URL
Value: https://prayer-board-api.onrender.com (your backend URL)
```

### 4. Update Repository Settings

1. In GitHub repo → **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, select:
   - ✅ Read and write permissions
   - ✅ Allow GitHub Actions to create and approve pull requests

### 5. Update render.yaml (if using Blueprint)

Edit `render.yaml` and replace `YOUR_USERNAME` with your actual GitHub username:

```yaml
repo: https://github.com/YOUR_USERNAME/prayer-board
```

### 6. Test Deployment

1. Make a small change to your code
2. Commit and push to main branch:
   ```bash
   git add .
   git commit -m "Test automatic deployment"
   git push origin main
   ```
3. Go to GitHub → **Actions** tab
4. You should see the workflow running
5. Check Render dashboard - your services should redeploy automatically!

## How It Works

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will:

1. **Trigger**: On every push to `main` or `master` branch
2. **Backend Deployment**: 
   - Uses Render API to trigger redeployment
   - Only deploys if `server/**` files changed
3. **Frontend Deployment**:
   - Waits for backend to finish
   - Builds the React app with production API URL
   - Deploys to Render static site

## Troubleshooting

**Deployment not triggering?**
- Check GitHub Actions tab for errors
- Verify secrets are set correctly
- Make sure you're pushing to `main` or `master`

**Build failing?**
- Check the Actions logs for specific errors
- Ensure `npm ci` works locally
- Verify `VITE_API_URL` secret is set

**Service not found?**
- Double-check service IDs in Render dashboard URLs
- Service IDs start with `srv-`

## Manual Deployment (Backup)

If automatic deployment fails, you can always deploy manually:

```bash
# Backend
cd server
npm install
git push origin main
# Then manually deploy via Render dashboard

# Frontend
cd prayer-board
npm install
npm run build
# Deploy dist folder via Render dashboard or Vercel CLI
```

## Alternative: Deploy Frontend to Vercel

If you prefer Vercel for frontend (better performance):

1. Remove frontend deployment from GitHub Actions
2. Install Vercel CLI: `npm i -g vercel`
3. Run: `vercel` in prayer-board folder
4. Add `VITE_API_URL` environment variable in Vercel dashboard
5. Vercel will auto-deploy on every push!

## Security Notes

- Never commit API keys or secrets to GitHub
- Always use GitHub Secrets for sensitive data
- Rotate Render API key periodically
- Use different API keys for different environments (dev/staging/prod)

## Questions?

- Render Docs: https://render.com/docs
- GitHub Actions Docs: https://docs.github.com/en/actions
- Vercel Docs: https://vercel.com/docs
