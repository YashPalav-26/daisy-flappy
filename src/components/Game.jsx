import React, { useRef, useEffect } from 'react';
import { useAudio } from '../hooks/useAudio';
import { useTheme } from '../hooks/useTheme';
import { useGameState } from '../hooks/useGameState';
import { useGameEngine } from '../hooks/useGameEngine';
import { GAME_CONFIG } from '../config/gameConfig';
import { drawCenteredText, drawCloud, drawBird } from '../utils/drawing';
import TopBar from './TopBar';
import SettingsModal from './SettingsModal';
import LeaderboardModal from './LeaderboardModal';

const Game = () => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const gameStateRef = useRef(null);
  const lastTimeRef = useRef(null);

  // Custom hooks
  const { theme, setTheme, getThemeColors } = useTheme();
  const {
    gameState,
    setGameState,
    settingsOpen,
    setSettingsOpen,
    leaderboardOpen,
    setLeaderboardOpen,
    volume,
    setVolume,
    highScore,
    leaderboard,
    updateHighScore,
    updateLeaderboard
  } = useGameState();
  const { playTone } = useAudio(volume);
  const {
    birdRef,
    pipesRef,
    cloudsRef,
    scoreRef,
    spawnTimerRef,
    resetGame,
    jump,
    spawnPipe
  } = useGameEngine(gameState, setGameState, playTone);

  // Update game state ref when state changes
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // Handle game restart
  const handleStartGame = () => {
    if (gameState !== 'playing') {
      const canvas = canvasRef.current;
      if (canvas) {
        resetGame(canvas);
        setGameState('playing');
      }
    }
  };

  // Handle settings modal
  const handleOpenSettings = () => setSettingsOpen(true);
  const handleCloseSettings = () => setSettingsOpen(false);

  // Handle leaderboard modal
  const handleOpenLeaderboard = () => setLeaderboardOpen(true);
  const handleCloseLeaderboard = () => setLeaderboardOpen(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fullscreen canvas
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      resetGame(canvas);
    };
    resize();
    window.addEventListener('resize', resize);

    const pipeWidth = GAME_CONFIG.PIPE_WIDTH;
    const baseGap = GAME_CONFIG.PIPE_GAP;
    const pipeSpeed = GAME_CONFIG.PIPE_SPEED;
    const groundHFrac = GAME_CONFIG.GROUND_HEIGHT_FRACTION;

    const spacePressed = (e) => e.code === 'Space';
    const onKey = (e) => {
      if (spacePressed(e)) {
        e.preventDefault();
        jump(canvas);
      }
    };
    const onClick = () => jump(canvas);

    window.addEventListener('keydown', onKey);
    canvas.addEventListener('click', onClick);

    const loop = (tNow) => {
      if (!canvas || !ctx) return;

      if (!lastTimeRef.current) lastTimeRef.current = tNow;
      const dt = Math.min(GAME_CONFIG.MAX_DELTA_TIME, (tNow - lastTimeRef.current) / 1000);
      lastTimeRef.current = tNow;

      const w = canvas.width, h = canvas.height;
      const groundH = Math.floor(h * groundHFrac);
      const colors = getThemeColors();
      const state = gameStateRef.current;

      // Clear canvas first
      ctx.clearRect(0, 0, w, h);

      // Sky background - use solid colors for reliability
      const skyTop = colors.base100;
      const skyBottom = colors.base200;

      // Create gradient
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, skyTop);
      g.addColorStop(1, skyBottom);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // Clouds
      ctx.fillStyle = colors.base300 || 'rgba(255,255,255,0.7)';
      if (cloudsRef.current && cloudsRef.current.length > 0) {
        cloudsRef.current.forEach(c => {
          c.x -= c.speed * dt;
          if (c.x < -c.r - 50) {
            c.x = w + Math.random() * 100;
            c.y = Math.random() * h * 0.5;
          }
          drawCloud(ctx, c.x, c.y, c.r);
        });
      }

      // Ground
      ctx.fillStyle = colors.success;
      ctx.fillRect(0, h - groundH, w, groundH);

      // Add ground texture lines
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.moveTo(0, h - groundH + (i * groundH / 10));
        ctx.lineTo(w, h - groundH + (i * groundH / 10));
        ctx.stroke();
      }

      // Game update
      if (state === 'playing') {
        // Bird physics
        birdRef.current.vy += birdRef.current.gravity * dt;
        birdRef.current.y += birdRef.current.vy * dt;
        birdRef.current.wingPhase += dt * 8;

        // Spawn pipes
        spawnTimerRef.current += dt;
        if (spawnTimerRef.current > GAME_CONFIG.PIPE_SPAWN_INTERVAL) {
          spawnTimerRef.current = 0;
          spawnPipe(canvas);
        }

        // Move pipes
        pipesRef.current.forEach(p => { p.x -= pipeSpeed * dt; });
        if (pipesRef.current.length && pipesRef.current[0].x + pipeWidth < 0) pipesRef.current.shift();

        // Score & collisions
        pipesRef.current.forEach(p => {
          const b = birdRef.current;
          if (!p.passed && p.x + pipeWidth < b.x) {
            p.passed = true;
            scoreRef.current += 1;
            playTone(880, 0.05, 'triangle');
          }
          const hitX = b.x + b.r > p.x && b.x - b.r < p.x + pipeWidth;
          if (hitX && (b.y - b.r < p.topH || b.y + b.r > p.gapY)) {
            setGameState('gameOver');
            playTone(120, 0.25, 'sawtooth');
            updateHighScore(scoreRef.current);
            updateLeaderboard(scoreRef.current);
          }
        });

        // Ground / ceiling
        if (birdRef.current.y + birdRef.current.r > h - groundH) {
          birdRef.current.y = h - groundH - birdRef.current.r;
          setGameState('gameOver');
          playTone(120, 0.25, 'sawtooth');
          updateHighScore(scoreRef.current);
          updateLeaderboard(scoreRef.current);
        }
        if (birdRef.current.y - birdRef.current.r < 0) {
          birdRef.current.y = birdRef.current.r;
          birdRef.current.vy = 0;
        }
      }

      // Pipes draw
      const pipeColor = colors.primary;

      pipesRef.current.forEach(p => {
        // Draw pipes with gradient effect
        const pipeGrad = ctx.createLinearGradient(p.x, 0, p.x + pipeWidth, 0);
        pipeGrad.addColorStop(0, pipeColor);
        pipeGrad.addColorStop(0.5, colors.secondary || pipeColor);
        pipeGrad.addColorStop(1, pipeColor);
        ctx.fillStyle = pipeGrad;

        // Top pipe
        ctx.fillRect(p.x, 0, pipeWidth, p.topH);
        // Top pipe cap
        ctx.fillStyle = colors.secondary || pipeColor;
        ctx.fillRect(p.x - 5, p.topH - 30, pipeWidth + 10, 30);

        // Bottom pipe
        ctx.fillStyle = pipeGrad;
        ctx.fillRect(p.x, p.gapY, pipeWidth, h - groundH - p.gapY);
        // Bottom pipe cap
        ctx.fillStyle = colors.secondary || pipeColor;
        ctx.fillRect(p.x - 5, p.gapY, pipeWidth + 10, 30);
      });

      // Bird draw (with tilt and wing)
      if (birdRef.current.x && birdRef.current.y) {
        drawBird(ctx, birdRef.current, colors);
      }

      // HUD
      ctx.fillStyle = colors.baseContent || '#111';
      ctx.textAlign = 'left';
      ctx.font = 'bold 28px system-ui, Arial';
      ctx.fillText(`Score ${scoreRef.current}`, 20, 40);
      ctx.font = '16px system-ui, Arial';
      ctx.fillText(`Best ${highScore}`, 20, 66);

      // Messages
      if (state === 'start') {
        // Draw semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, w, h);

        drawCenteredText(ctx, w, h, 'Flappy Bird', 64, colors.baseContent || '#ffffff', -40);
        drawCenteredText(ctx, w, h, 'Click or Press Space to Start', 22, colors.baseContent || '#ffffff', 10);
      }
      if (state === 'gameOver') {
        // Draw semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, w, h);

        drawCenteredText(ctx, w, h, 'Game Over', 64, colors.error || '#dc2626', -60);
        drawCenteredText(ctx, w, h, `Score ${scoreRef.current}`, 28, colors.baseContent || '#ffffff', -10);
        drawCenteredText(ctx, w, h, 'Click or Press Space to Restart', 20, colors.baseContent || '#ffffff', 30);
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    // Start game loop
    lastTimeRef.current = null;
    spawnTimerRef.current = 0;
    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', onKey);
      canvas.removeEventListener('click', onClick);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [volume, highScore, leaderboard, getThemeColors, playTone, resetGame, jump, spawnPipe, setGameState, updateHighScore, updateLeaderboard]);

  return (
    <div className="relative w-full h-full">
      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-label="Flappy Bird Game Canvas" />

      {/* Top bar */}
      <TopBar
        gameState={gameState}
        onStartGame={handleStartGame}
        onOpenSettings={handleOpenSettings}
        onOpenLeaderboard={handleOpenLeaderboard}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={handleCloseSettings}
        theme={theme}
        setTheme={setTheme}
        volume={volume}
        setVolume={setVolume}
      />

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={leaderboardOpen}
        onClose={handleCloseLeaderboard}
        leaderboard={leaderboard}
      />
    </div>
  );
};

export default Game;
