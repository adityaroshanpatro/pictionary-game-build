import React, { useState, useEffect } from 'react';
import './GameRoom.css';
import Canvas from './Canvas';
import PlayerList from './PlayerList';
import GuessInput from './GuessInput';

function GameRoom({ socket, roomId, playerName }) {
  const [players, setPlayers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [gameStatus, setGameStatus] = useState('waiting');
  const [currentDrawer, setCurrentDrawer] = useState(null);
  const [drawerId, setDrawerId] = useState(null);
  const [currentWord, setCurrentWord] = useState('');
  const [round, setRound] = useState(0);
  const [maxRounds, setMaxRounds] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(80);

  useEffect(() => {
    socket.on('player-joined', ({ players, gameStatus }) => {
      setPlayers(players);
      setGameStatus(gameStatus);
      addMessage('System', 'A player joined the game', 'system');
    });

    socket.on('player-left', ({ players }) => {
      setPlayers(players);
      addMessage('System', 'A player left the game', 'system');
    });

    socket.on('game-state', ({ players, status, round, maxRounds }) => {
      setPlayers(players);
      setGameStatus(status);
      setRound(round);
      setMaxRounds(maxRounds);
    });

    socket.on('round-start', ({ round, maxRounds, drawer, drawerId }) => {
      setRound(round);
      setMaxRounds(maxRounds);
      setCurrentDrawer(drawer);
      setDrawerId(drawerId);
      setGameStatus('playing');
      setTimeLeft(80);
      setCurrentWord('');
      addMessage('System', `Round ${round}/${maxRounds} - ${drawer} is drawing!`, 'system');
    });

    socket.on('your-word', ({ word }) => {
      setCurrentWord(word);
      setIsDrawing(true);
      addMessage('System', `Your word is: ${word}`, 'system');
    });

    socket.on('round-end', ({ word, players }) => {
      setPlayers(players);
      setGameStatus('round-end');
      setIsDrawing(false);
      addMessage('System', `Round ended! The word was: ${word}`, 'system');
    });

    socket.on('game-end', ({ players }) => {
      setPlayers(players);
      setGameStatus('finished');
      addMessage('System', 'Game finished!', 'system');
    });

    socket.on('player-guessed', ({ playerName, guess }) => {
      addMessage(playerName, guess, 'guess');
    });

    socket.on('correct-guess', ({ playerName, points, players }) => {
      setPlayers(players);
      addMessage('System', `${playerName} guessed correctly! +${points} points`, 'correct');
    });

    socket.on('you-guessed-correct', ({ points }) => {
      addMessage('System', `Correct! You earned ${points} points!`, 'correct');
    });

    return () => {
      socket.off('player-joined');
      socket.off('player-left');
      socket.off('game-state');
      socket.off('round-start');
      socket.off('your-word');
      socket.off('round-end');
      socket.off('game-end');
      socket.off('player-guessed');
      socket.off('correct-guess');
      socket.off('you-guessed-correct');
    };
  }, [socket]);

  useEffect(() => {
    if (gameStatus === 'playing') {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameStatus, round]);

  const addMessage = (sender, text, type = 'normal') => {
    setMessages((prev) => [...prev, { sender, text, type, timestamp: Date.now() }]);
  };

  const handleStartGame = () => {
    socket.emit('start-game', { roomId });
  };

  const handleGuess = (guess) => {
    socket.emit('guess', { roomId, guess });
  };

  return (
    <div className="game-room">
      <div className="game-header">
        <div className="room-info">
          <h2>Room: {roomId}</h2>
          {gameStatus === 'playing' && (
            <div className="game-info">
              <span className="round-info">Round {round}/{maxRounds}</span>
              <span className="timer">{timeLeft}s</span>
              {isDrawing && <span className="word-display">Your word: {currentWord}</span>}
            </div>
          )}
        </div>
        {gameStatus === 'waiting' && players.length >= 2 && (
          <button onClick={handleStartGame} className="start-btn">
            Start Game
          </button>
        )}
      </div>

      <div className="game-content">
        <div className="left-panel">
          <PlayerList players={players} currentDrawerId={drawerId} />
        </div>

        <div className="center-panel">
          <Canvas
            socket={socket}
            roomId={roomId}
            isDrawing={isDrawing}
            gameStatus={gameStatus}
          />
        </div>

        <div className="right-panel">
          <div className="chat-box">
            <div className="messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.type}`}>
                  <span className="sender">{msg.sender}:</span>
                  <span className="text">{msg.text}</span>
                </div>
              ))}
            </div>
            {gameStatus === 'playing' && !isDrawing && (
              <GuessInput onGuess={handleGuess} />
            )}
          </div>
        </div>
      </div>

      {gameStatus === 'finished' && (
        <div className="game-end-overlay">
          <div className="game-end-modal">
            <h2>Game Finished!</h2>
            <h3>Final Scores:</h3>
            <div className="final-scores">
              {players.map((player, idx) => (
                <div key={player.id} className="final-score-item">
                  <span className="rank">#{idx + 1}</span>
                  <span className="player-name">{player.name}</span>
                  <span className="score">{player.score} pts</span>
                </div>
              ))}
            </div>
            <button onClick={() => window.location.reload()} className="play-again-btn">
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameRoom;
