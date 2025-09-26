// Game configuration constants
export const GAME_CONFIG = {
  PIPE_WIDTH: 70,
  PIPE_GAP: 180,
  PIPE_SPEED: 200,
  PIPE_SPAWN_INTERVAL: 2.0,
  GROUND_HEIGHT_FRACTION: 0.12,
  BIRD_GRAVITY: 800,
  BIRD_JUMP_VELOCITY: -320,
  BIRD_RADIUS: 18,
  BIRD_X_POSITION: 0.2, // 20% from left
  BIRD_Y_POSITION: 0.4, // 40% from top
  CLOUD_COUNT: 8,
  CLOUD_MIN_RADIUS: 20,
  CLOUD_MAX_RADIUS: 65,
  CLOUD_MIN_SPEED: 10,
  CLOUD_MAX_SPEED: 30,
  MAX_DELTA_TIME: 0.05, // 50ms max frame time
};

export const GAME_STATES = {
  START: 'start',
  PLAYING: 'playing',
  GAME_OVER: 'gameOver',
};