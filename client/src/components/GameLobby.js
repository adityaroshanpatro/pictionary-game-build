import React, { useState } from 'react';
import './GameLobby.css';

function GameLobby({ onJoinGame }) {
  const [roomId, setRoomId] = useState('');
  const [playerName, setPlayerName] = useState('');

  const handleJoin = (e) => {
    e.preventDefault();
    if (roomId.trim() && playerName.trim()) {
      onJoinGame(roomId.trim(), playerName.trim());
    }
  };

  const generateRoomId = () => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(id);
  };

  return (
    <div className="game-lobby">
      <div className="lobby-container">
        <h1>🎨 Pictionary Game</h1>
        <p className="subtitle">Draw, Guess, and Have Fun!</p>

        <form onSubmit={handleJoin} className="join-form">
          <div className="form-group">
            <label>Your Name</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
              required
            />
          </div>

          <div className="form-group">
            <label>Room Code</label>
            <div className="room-input-group">
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                placeholder="Enter room code"
                maxLength={10}
                required
              />
              <button
                type="button"
                onClick={generateRoomId}
                className="generate-btn"
              >
                Generate
              </button>
            </div>
          </div>

          <button type="submit" className="join-btn">
            Join Game
          </button>
        </form>

        <div className="game-info">
          <h3>How to Play:</h3>
          <ul>
            <li>Up to 20 players can join a room</li>
            <li>Each player takes turns drawing</li>
            <li>Other players guess what's being drawn</li>
            <li>Faster guesses earn more points!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default GameLobby;
