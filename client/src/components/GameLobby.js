import React, { useState } from 'react';
import './GameLobby.css';

function GameLobby({ onJoinGame }) {
  const [mode, setMode] = useState('choose'); // choose, create, join
  const [roomId, setRoomId] = useState('');
  const [playerName, setPlayerName] = useState('');

  const handleJoin = (e) => {
    e.preventDefault();
    if (roomId.trim() && playerName.trim()) {
      onJoinGame(roomId.trim(), playerName.trim());
    }
  };

  const handleCreateRoom = () => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(id);
    setMode('create');
  };

  return (
    <div className="game-lobby">
      <div className="lobby-container">
        <h1>🎨 Pictionary Game</h1>
        <p className="subtitle">Draw, Guess, and Have Fun!</p>

        {mode === 'choose' && (
          <div className="mode-selection">
            <button className="mode-btn create-btn" onClick={handleCreateRoom}>
              <span className="mode-icon">➕</span>
              <span className="mode-title">Create Room</span>
              <span className="mode-desc">Start a new game</span>
            </button>
            <button className="mode-btn join-btn-mode" onClick={() => setMode('join')}>
              <span className="mode-icon">🚪</span>
              <span className="mode-title">Join Room</span>
              <span className="mode-desc">Enter existing game</span>
            </button>
          </div>
        )}

        {(mode === 'create' || mode === 'join') && (
          <>
            <button className="back-btn" onClick={() => { setMode('choose'); setRoomId(''); }}>
              ← Back
            </button>

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
                  autoFocus
                />
              </div>

              {mode === 'create' && (
                <div className="room-code-display">
                  <label>Your Room Code</label>
                  <div className="code-box">
                    <span className="code">{roomId}</span>
                    <button
                      type="button"
                      className="copy-btn"
                      onClick={() => {
                        navigator.clipboard.writeText(roomId);
                        alert('Room code copied!');
                      }}
                    >
                      📋 Copy
                    </button>
                  </div>
                  <p className="share-text">Share this code with others to let them join!</p>
                </div>
              )}

              {mode === 'join' && (
                <div className="form-group">
                  <label>Room Code</label>
                  <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                    placeholder="Enter room code"
                    maxLength={10}
                    required
                  />
                </div>
              )}

              <button type="submit" className="submit-btn">
                {mode === 'create' ? 'Create & Join Room' : 'Join Room'}
              </button>
            </form>
          </>
        )}

        {mode === 'choose' && (
          <div className="game-info">
            <h3>How to Play:</h3>
            <ul>
              <li>Up to 20 players can join a room</li>
              <li>Each player takes turns drawing</li>
              <li>Other players guess what's being drawn</li>
              <li>Faster guesses earn more points!</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default GameLobby;
