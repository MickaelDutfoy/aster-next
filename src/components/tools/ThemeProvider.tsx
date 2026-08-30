'use client';

import { ThemeChoice } from '@/lib/types';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type ThemeContextValue = {
  choice: ThemeChoice;
  isDark: boolean;
  setTheme: (choice: ThemeChoice) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const loadTheme = (): ThemeChoice => {
  const raw = localStorage.getItem('theme');

  if (raw === 'light' || raw === 'dark' || raw === 'system' || raw === 'high-contrast') {
    return raw;
  }

  return 'system';
};

const applyTheme = (choice: ThemeChoice) => {
  const root = document.documentElement;

  if (choice === 'light' || choice === 'dark' || choice === 'high-contrast') {
    root.dataset.theme = choice;
  } else {
    root.removeAttribute('data-theme');
  }
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [choice, setChoice] = useState<ThemeChoice>('system');
  const [systemIsDark, setSystemIsDark] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateSystemTheme = () => {
      setSystemIsDark(mediaQuery.matches);
    };

    const saved = loadTheme();

    setChoice(saved);
    applyTheme(saved);
    updateSystemTheme();

    mediaQuery.addEventListener('change', updateSystemTheme);

    return () => {
      mediaQuery.removeEventListener('change', updateSystemTheme);
    };
  }, []);

  const setTheme = (next: ThemeChoice) => {
    setChoice(next);
    localStorage.setItem('theme', next);
    applyTheme(next);
  };

  const isDark =
    choice === 'dark' || choice === 'high-contrast' || (choice === 'system' && systemIsDark);

  return (
    <ThemeContext.Provider value={{ choice, isDark, setTheme }}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const theme = useContext(ThemeContext);

  if (!theme) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }

  return theme;
};
