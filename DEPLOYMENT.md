# Deployment Guide

## Option 1: Railway (Recommended - Easy)

1. Sign up at https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select this repository
4. Railway will auto-detect and deploy
5. Add environment variables:
   - `NODE_ENV=production`
   - `CLIENT_URL=https://your-railway-app.up.railway.app`
6. Your app will be live at the Railway URL

## Option 2: Render

1. Sign up at https://render.com
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Render will use `render.yaml` config automatically
5. Add environment variable in dashboard:
   - `CLIENT_URL=https://your-app.onrender.com`
6. Deploy!

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

### Backend (.env)
```
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend (client/.env)
```
REACT_APP_SOCKET_URL=http://localhost:5000
```

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Set correct `CLIENT_URL` (your deployed frontend URL)
- [ ] Set `REACT_APP_SOCKET_URL` to your deployed backend URL
- [ ] Test with multiple users
- [ ] Check WebSocket connections work
- [ ] Monitor performance

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
