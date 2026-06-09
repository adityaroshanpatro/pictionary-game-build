# 🎨 Pictionary Game

Online multiplayer Pictionary game for office team activities. Draw, guess, and have fun with your colleagues!

## ✨ Features
- 👥 Up to 20 players per game
- 🎨 Real-time drawing with canvas tools
- 💬 Live chat and guessing
- 🏆 Individual scoring system
- ⚡ Time-based points (faster guesses = more points!)
- 🔄 Turn rotation through all players
- 🎯 Multiple rounds with leaderboard

## 🚀 Tech Stack
- **Frontend**: React, Socket.io-client, HTML5 Canvas
- **Backend**: Node.js, Express, Socket.io
- **Real-time**: WebSockets for instant synchronization

## 📦 Installation

### Prerequisites
- Node.js 16+ installed
- npm or yarn

### Local Setup

1. **Clone the repository**
```bash
git clone https://github.com/adityaroshanpatro/pictionary-game-build.git
cd pictionary-game-build
```

2. **Install backend dependencies**
```bash
npm install
```

3. **Install frontend dependencies**
```bash
cd client
npm install
cd ..
```

4. **Start the development servers**

Option 1 - Run both together:
```bash
npm run dev:full
```

Option 2 - Run separately:

Terminal 1 (Backend):
```bash
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm start
```

5. **Open the game**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🎮 How to Play

1. **Create a Room**: Enter your name and generate/enter a room code
2. **Share the Code**: Share the room code with friends (up to 20 players)
3. **Start Game**: Once everyone joins, click "Start Game"
4. **Draw**: When it's your turn, draw the word shown to you
5. **Guess**: When others draw, type your guesses in the chat
6. **Score Points**: Correct guesses earn points (faster = more points!)
7. **Win**: Player with highest score after all rounds wins!

## 🚢 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions for:
- Railway (Recommended)
- Render
- Heroku
- DigitalOcean

## 🛠️ Project Structure

```
pictionary-game/
├── server/
│   └── index.js          # Backend server + game logic
├── client/
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── GameLobby.js
│   │   │   ├── GameRoom.js
│   │   │   ├── Canvas.js
│   │   │   ├── PlayerList.js
│   │   │   └── GuessInput.js
│   │   └── App.js
│   └── public/
├── package.json
└── README.md
```

## 🎨 Game Features

### Drawing Tools
- Pen with adjustable size (1-20px)
- Color palette (10 colors)
- Eraser tool
- Clear canvas button

### Scoring System
- Maximum 100 points for instant correct guess
- Minimum 10 points for guess at end of round
- Points decrease linearly with time
- Total time per round: 80 seconds

### Game Flow
1. Players join lobby
2. Host starts game
3. Each player gets a turn to draw
4. 80 seconds per round
5. Points awarded for correct guesses
6. After all rounds, winner is announced

## 🔧 Environment Variables

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

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📝 License

MIT License - feel free to use this for your office games!

## 🎉 Have Fun!

Built with ❤️ for team bonding and fun times!
