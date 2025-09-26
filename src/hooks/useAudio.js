import { useRef, useCallback } from 'react';

export const useAudio = (volume) => {
  const audioCtxRef = useRef(null);

  const playTone = useCallback((freq = 440, duration = 0.07, type = 'sine') => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const ctx = audioCtxRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.type = type;
      oscillator.frequency.value = freq;
      gainNode.gain.value = Math.max(0, Math.min(1, volume / 100)) * 0.15;
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      oscillator.stop(ctx.currentTime + duration + 0.02);
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, [volume]);

  return { playTone };
};