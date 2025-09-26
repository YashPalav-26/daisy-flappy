import { useRef, useCallback } from 'react';
import { GAME_CONFIG, GAME_STATES } from '../config/gameConfig';

export const useGameEngine = (gameState, setGameState, playTone) => {
  const birdRef = useRef({ 
    x: 150, 
    y: 300, 
    vy: 0, 
    gravity: GAME_CONFIG.BIRD_GRAVITY, 
    jumpV: GAME_CONFIG.BIRD_JUMP_VELOCITY, 
    r: GAME_CONFIG.BIRD_RADIUS, 
    wingPhase: 0 
  });
  
  const pipesRef = useRef([]);
  const cloudsRef = useRef([]);
  const scoreRef = useRef(0);
  const spawnTimerRef = useRef(0);

  const resetGame = useCallback((canvas) => {
    const w = canvas?.width || window.innerWidth;
    const h = canvas?.height || window.innerHeight;
    
    birdRef.current.x = Math.round(w * GAME_CONFIG.BIRD_X_POSITION);
    birdRef.current.y = Math.round(h * GAME_CONFIG.BIRD_Y_POSITION);
    birdRef.current.vy = 0;
    birdRef.current.wingPhase = 0;
    
    pipesRef.current = [];
    scoreRef.current = 0;
    spawnTimerRef.current = 0;
    
    // Initialize clouds
    cloudsRef.current = Array.from({ length: GAME_CONFIG.CLOUD_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h * 0.5,
      r: GAME_CONFIG.CLOUD_MIN_RADIUS + Math.random() * (GAME_CONFIG.CLOUD_MAX_RADIUS - GAME_CONFIG.CLOUD_MIN_RADIUS),
      speed: GAME_CONFIG.CLOUD_MIN_SPEED + Math.random() * (GAME_CONFIG.CLOUD_MAX_SPEED - GAME_CONFIG.CLOUD_MIN_SPEED),
    }));
  }, []);

  const jump = useCallback((canvas) => {
    const state = gameState;
    
    if (state === GAME_STATES.START) {
      resetGame(canvas);
      setGameState(GAME_STATES.PLAYING);
      birdRef.current.vy = birdRef.current.jumpV;
      playTone(660, 0.06, 'square');
    } else if (state === GAME_STATES.PLAYING) {
      birdRef.current.vy = birdRef.current.jumpV;
      playTone(660, 0.06, 'square');
    } else if (state === GAME_STATES.GAME_OVER) {
      resetGame(canvas);
      setGameState(GAME_STATES.PLAYING);
      birdRef.current.vy = birdRef.current.jumpV;
      playTone(660, 0.06, 'square');
    }
  }, [gameState, setGameState, playTone, resetGame]);

  const spawnPipe = useCallback((canvas) => {
    const h = canvas.height;
    const groundH = Math.floor(h * GAME_CONFIG.GROUND_HEIGHT_FRACTION);
    const gap = GAME_CONFIG.PIPE_GAP;
    const minTop = 50;
    const maxTop = h - groundH - gap - 50;
    
    if (maxTop > minTop) {
      const topH = minTop + Math.random() * (maxTop - minTop);
      pipesRef.current.push({ 
        x: canvas.width + GAME_CONFIG.PIPE_WIDTH, 
        topH, 
        gapY: topH + gap, 
        passed: false 
      });
    }
  }, []);

  return {
    birdRef,
    pipesRef,
    cloudsRef,
    scoreRef,
    spawnTimerRef,
    resetGame,
    jump,
    spawnPipe
  };
};