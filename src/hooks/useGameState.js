import { useState, useCallback } from 'react';

export const useGameState = () => {
  const [gameState, setGameState] = useState('start'); // start | playing | gameOver
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [volume, setVolume] = useState(50);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('flappyBirdHighScore')) || 0);
  const [leaderboard, setLeaderboard] = useState(() => JSON.parse(localStorage.getItem('flappyBirdLeaderboard')) || []);

  const updateHighScore = useCallback((newScore) => {
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('flappyBirdHighScore', String(newScore));
    }
  }, [highScore]);

  const updateLeaderboard = useCallback((newScore) => {
    const top5 = [...leaderboard, newScore].sort((a, b) => b - a).slice(0, 5);
    setLeaderboard(top5);
    localStorage.setItem('flappyBirdLeaderboard', JSON.stringify(top5));
  }, [leaderboard]);

  const resetGameState = useCallback(() => {
    setGameState('start');
  }, []);

  return {
    gameState,
    setGameState,
    settingsOpen,
    setSettingsOpen,
    leaderboardOpen,
    setLeaderboardOpen,
    volume,
    setVolume,
    highScore,
    setHighScore,
    leaderboard,
    setLeaderboard,
    updateHighScore,
    updateLeaderboard,
    resetGameState
  };
};