const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Catch-all route to serve React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Game state
const games = new Map();
const words = [
  'cat', 'dog', 'house', 'tree', 'car', 'sun', 'moon', 'star', 'flower', 'bird',
  'fish', 'apple', 'banana', 'guitar', 'piano', 'camera', 'phone', 'laptop',
  'coffee', 'pizza', 'mountain', 'beach', 'rocket', 'airplane', 'boat', 'train',
  'elephant', 'giraffe', 'lion', 'tiger', 'rainbow', 'cloud', 'umbrella', 'clock'
];

function createGame(roomId) {
  return {
    roomId,
    players: [],
    currentDrawer: null,
    currentWord: null,
    round: 0,
    maxRounds: 3,
    roundStartTime: null,
    roundDuration: 80000, // 80 seconds
    guessedPlayers: new Set(),
    drawingData: [],
    status: 'waiting', // waiting, playing, finished
    roundTimer: null
  };
}

function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

function calculatePoints(timeElapsed, roundDuration) {
  const maxPoints = 100;
  const minPoints = 10;
  const timeRatio = timeElapsed / roundDuration;
  return Math.max(minPoints, Math.floor(maxPoints * (1 - timeRatio)));
}

function nextTurn(game) {
  game.guessedPlayers.clear();
  game.drawingData = [];

  // Clear any existing round timer
  if (game.roundTimer) {
    clearTimeout(game.roundTimer);
    game.roundTimer = null;
  }

  if (game.currentDrawer === null) {
    game.currentDrawer = 0;
  } else {
    game.currentDrawer = (game.currentDrawer + 1) % game.players.length;

    if (game.currentDrawer === 0) {
      game.round++;
    }
  }

  if (game.round >= game.maxRounds) {
    game.status = 'finished';
    return false;
  }

  game.currentWord = getRandomWord();
  game.roundStartTime = Date.now();
  game.status = 'playing';

  return true;
}

function checkAllPlayersGuessed(game) {
  // Number of players who should be guessing (everyone except the drawer)
  const guessersCount = game.players.length - 1;
  // Number of players who have guessed correctly
  const guessedCount = game.guessedPlayers.size;

  return guessedCount >= guessersCount;
}

function endRound(game, roomId, io) {
  // Clear the round timer if it exists
  if (game.roundTimer) {
    clearTimeout(game.roundTimer);
    game.roundTimer = null;
  }

  io.to(roomId).emit('round-end', {
    word: game.currentWord,
    players: game.players
  });

  setTimeout(() => {
    if (nextTurn(game)) {
      const nextDrawer = game.players[game.currentDrawer];

      // Set up the new round timer
      game.roundTimer = setTimeout(() => {
        if (game.status === 'playing') {
          endRound(game, roomId, io);
        }
      }, game.roundDuration);

      io.to(roomId).emit('round-start', {
        round: game.round + 1,
        maxRounds: game.maxRounds,
        drawer: nextDrawer.name,
        drawerId: nextDrawer.id
      });
      io.to(nextDrawer.id).emit('your-word', { word: game.currentWord });
    } else {
      io.to(roomId).emit('game-end', {
        players: game.players.sort((a, b) => b.score - a.score)
      });
    }
  }, 5000);
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-game', ({ roomId, playerName }) => {
    let game = games.get(roomId);

    if (!game) {
      game = createGame(roomId);
      games.set(roomId, game);
    }

    if (game.players.length >= 20) {
      socket.emit('error', { message: 'Room is full' });
      return;
    }

    const player = {
      id: socket.id,
      name: playerName,
      score: 0
    };

    game.players.push(player);
    socket.join(roomId);

    io.to(roomId).emit('player-joined', {
      player,
      players: game.players,
      gameStatus: game.status
    });

    socket.emit('game-state', {
      players: game.players,
      currentDrawer: game.currentDrawer,
      round: game.round,
      maxRounds: game.maxRounds,
      status: game.status
    });
  });

  socket.on('start-game', ({ roomId }) => {
    const game = games.get(roomId);
    if (!game || game.players.length < 2) {
      socket.emit('error', { message: 'Need at least 2 players' });
      return;
    }

    if (nextTurn(game)) {
      const drawer = game.players[game.currentDrawer];

      io.to(roomId).emit('round-start', {
        round: game.round + 1,
        maxRounds: game.maxRounds,
        drawer: drawer.name,
        drawerId: drawer.id
      });

      io.to(drawer.id).emit('your-word', { word: game.currentWord });

      // Set up the round timer
      game.roundTimer = setTimeout(() => {
        if (game.status === 'playing') {
          endRound(game, roomId, io);
        }
      }, game.roundDuration);
    }
  });

  socket.on('draw', ({ roomId, drawData }) => {
    const game = games.get(roomId);
    if (!game) return;

    game.drawingData.push(drawData);
    socket.to(roomId).emit('drawing', drawData);
  });

  socket.on('clear-canvas', ({ roomId }) => {
    const game = games.get(roomId);
    if (!game) return;

    game.drawingData = [];
    io.to(roomId).emit('canvas-cleared');
  });

  socket.on('guess', ({ roomId, guess }) => {
    const game = games.get(roomId);
    if (!game || game.status !== 'playing') return;

    const player = game.players.find(p => p.id === socket.id);
    if (!player || socket.id === game.players[game.currentDrawer].id) return;

    if (game.guessedPlayers.has(socket.id)) return;

    io.to(roomId).emit('player-guessed', {
      playerName: player.name,
      guess
    });

    if (guess.toLowerCase().trim() === game.currentWord.toLowerCase()) {
      const timeElapsed = Date.now() - game.roundStartTime;
      const points = calculatePoints(timeElapsed, game.roundDuration);

      player.score += points;
      game.guessedPlayers.add(socket.id);

      io.to(roomId).emit('correct-guess', {
        playerName: player.name,
        points,
        players: game.players
      });

      socket.emit('you-guessed-correct', { points });

      // Check if all players have guessed correctly
      if (checkAllPlayersGuessed(game)) {
        // End the round early since everyone guessed
        endRound(game, roomId, io);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    games.forEach((game, roomId) => {
      const playerIndex = game.players.findIndex(p => p.id === socket.id);

      if (playerIndex !== -1) {
        game.players.splice(playerIndex, 1);

        io.to(roomId).emit('player-left', {
          players: game.players
        });

        if (game.players.length === 0) {
          games.delete(roomId);
        }
      }
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
