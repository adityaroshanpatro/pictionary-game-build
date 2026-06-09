import React, { useState } from 'react';
import './GuessInput.css';

function GuessInput({ onGuess }) {
  const [guess, setGuess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (guess.trim()) {
      onGuess(guess.trim());
      setGuess('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="guess-input">
      <input
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        placeholder="Type your guess..."
        maxLength={50}
      />
      <button type="submit">Send</button>
    </form>
  );
}

export default GuessInput;
