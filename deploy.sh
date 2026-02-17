#!/bin/bash
# Deploy script for Prayer Board
# This script helps deploy to Render with the correct configuration

echo "🙏 Prayer Board Deployment Script"
echo "================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the prayer-board directory"
    exit 1
fi

if [ ! -d "server" ]; then
    echo "❌ Error: server directory not found"
    exit 1
fi

echo "📦 Step 1: Installing frontend dependencies..."
npm install

echo ""
echo "📦 Step 2: Installing backend dependencies..."
cd server
npm install
cd ..

echo ""
echo "🔨 Step 3: Building frontend..."
npm run build

echo ""
echo "✅ Build complete!"
echo ""
echo "Next steps:"
echo "1. Commit and push to GitHub:"
echo "   git add ."
echo "   git commit -m 'Ready for deployment'"
echo "   git push origin main"
echo ""
echo "2. Deploy backend to Render:"
echo "   - Go to https://dashboard.render.com"
echo "   - Create new Web Service"
echo "   - Connect your GitHub repo"
echo "   - Set root directory to 'server'"
echo "   - Build: npm install"
echo "   - Start: node server.js"
echo ""
echo "3. Update VITE_API_URL in:"
echo "   - prayer-board/.env.local (for local dev)"
echo "   - Render Static Site env vars (for production)"
echo ""
echo "4. Deploy frontend to Render or Vercel"
echo ""
