import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';
import GameLobby from './components/GameLobby';
import GameRoom from './components/GameRoom';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

function App() {
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState('lobby'); // lobby, room
  const [roomId, setRoomId] = useState('');
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const joinGame = (room, name) => {
    setRoomId(room);
    setPlayerName(name);
    socket.emit('join-game', { roomId: room, playerName: name });
    setGameState('room');
  };

  return (
    <div className="App">
      {gameState === 'lobby' && (
        <GameLobby onJoinGame={joinGame} />
      )}
      {gameState === 'room' && socket && (
        <GameRoom
          socket={socket}
          roomId={roomId}
          playerName={playerName}
        />
      )}
    </div>
  );
}

export default App;
