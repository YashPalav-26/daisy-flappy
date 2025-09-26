import { useState, useEffect, useCallback } from 'react';
import { themeColors } from '../config/themes';

export const useTheme = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Get theme colors dynamically - all 29 DaisyUI themes
  const getThemeColors = useCallback(() => {
    return themeColors[theme] || themeColors['light'];
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return {
    theme,
    setTheme,
    getThemeColors
  };
};