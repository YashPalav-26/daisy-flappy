import React from 'react';

const TopBar = ({ gameState, onStartGame, onOpenSettings, onOpenLeaderboard }) => {
  return (
    <div className="pointer-events-auto absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-base-100/70 backdrop-blur-md rounded-full px-4 py-2 shadow">
      <span className="font-bold text-primary">Flappy Bird</span>
      <button
        className="btn btn-sm btn-primary"
        onClick={onStartGame}
      >
        {gameState === 'playing' ? 'Playing' : gameState === 'gameOver' ? 'Restart' : 'Start'}
      </button>
      <button className="btn btn-sm" onClick={onOpenSettings}>Settings</button>
      <button className="btn btn-sm btn-accent" onClick={onOpenLeaderboard}>Leaderboard</button>
    </div>
  );
};

export default TopBar;