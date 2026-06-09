import React from 'react';
import './PlayerList.css';

function PlayerList({ players, currentDrawerId }) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="player-list">
      <h3>Players ({players.length}/20)</h3>
      <div className="players">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            className={`player-item ${player.id === currentDrawerId ? 'drawing' : ''}`}
          >
            <div className="player-info">
              <span className="player-rank">#{index + 1}</span>
              <span className="player-name">
                {player.name}
                {player.id === currentDrawerId && ' 🎨'}
              </span>
            </div>
            <span className="player-score">{player.score} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlayerList;
