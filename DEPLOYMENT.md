# Deployment Guide - Pictionary Game 🎨

## Quick Start: Render (Recommended - 100% Free) ⭐

**Why Render?**
- ✅ Completely free tier (750 hours/month)
- ✅ Native WebSocket support
- ✅ Zero configuration needed
- ✅ Auto-deploy from GitHub
- ✅ Free SSL certificate

### Steps:

1. **Push your code to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Render**:
   - Go to [https://render.com](https://render.com)
   - Sign up with your GitHub account (free)
   - Click "New +" → "Web Service"
   - Connect your repository
   - Render will automatically detect `render.yaml` configuration
   - Click "Apply" 
   - Wait 3-5 minutes for build and deployment

3. **Done!** 🎉 
   - Your app will be live at: `https://your-app-name.onrender.com`
   - Share the link with friends to play!

**Note**: Free tier services sleep after 15 minutes of inactivity. First request may take 30-60 seconds to wake up.

---

## Option 2: Railway

1. Sign up at https://railway.app (free)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select this repository
4. Set environment variable: `NODE_ENV=production`
5. Railway will auto-detect and deploy

**Free tier**: $5 credit/month

---

## Option 3: Fly.io

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. Launch: `fly launch` (follow prompts)
4. Deploy: `fly deploy`

**Free tier**: 3 small VMs

## Option 3: Heroku

1. Install Heroku CLI
2. Run:
```bash
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set CLIENT_URL=https://your-app-name.herokuapp.com
git push heroku main
```

## Option 4: DigitalOcean App Platform

1. Sign up at https://www.digitalocean.com
2. Go to App Platform → Create App
3. Connect GitHub repo
4. Configure:
   - Build Command: `npm install && cd client && npm install && npm run build`
   - Run Command: `npm start`
5. Add environment variables in settings
6. Deploy

## Local Testing

### Start Backend:
```bash
npm install
npm run dev
```

### Start Frontend (in another terminal):
```bash
cd client
npm install
npm start
```

Backend runs on: http://localhost:5000
Frontend runs on: http://localhost:3000

## Environment Variables

**Good news!** For production deployment, NO environment variables are required! 🎉

The app automatically:
- Uses the hosting platform's PORT (or defaults to 5000)
- Sets WebSocket URL to `window.location.origin` in production
- Serves React static files from the same origin

### For local development only:

Backend: Create `.env` in project root (optional):
```
PORT=5000
```

Frontend: Already configured in `client/.env`:
```
REACT_APP_SOCKET_URL=http://localhost:5000
```

## Production Checklist

- [x] WebSocket auto-configuration ✅
- [x] Static file serving ✅
- [x] CORS settings ✅
- [x] Build scripts configured ✅
- [ ] Push code to GitHub
- [ ] Deploy on Render (or other platform)
- [ ] Test with multiple browser windows
- [ ] Share link with friends!

## Troubleshooting

**WebSocket not connecting:**
- Check CORS settings in server/index.js
- Ensure CLIENT_URL matches your frontend domain
- Check if your host supports WebSockets

**Build fails:**
- Run `npm install` in both root and client directories
- Check Node.js version (16+ recommended)

**Game not loading:**
- Clear browser cache
- Check browser console for errors
- Verify backend is running and accessible
