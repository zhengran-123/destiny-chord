import { useState, useEffect, useCallback } from 'react';
import { getDarkMode, saveDarkMode } from '../utils/storage';

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = getDarkMode();
    setDarkMode(saved);
    if (saved) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggle = useCallback(() => {
    setDarkMode(prev => {
      const next = !prev;
      saveDarkMode(next);
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  }, []);

  return { darkMode, toggle };
}
