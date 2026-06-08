'use client';

import { useEffect } from 'react';

export const ForcedTheme = ({ theme }: { theme?: string }) => {
  useEffect(() => {
    if (!theme) return;

    const allowedThemes = ['light', 'dark', 'high-contrast'];

    if (!allowedThemes.includes(theme)) return;

    document.documentElement.dataset.theme = theme;

    return () => {
      document.documentElement.removeAttribute('data-theme');
    };
  }, [theme]);

  return null;
};
