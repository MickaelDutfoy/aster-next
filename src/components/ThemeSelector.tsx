'use client';

import { ThemeChoice } from '@/lib/types';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export const ThemeSelector = () => {
  const t = useTranslations();
  const [choice, setChoice] = useState<ThemeChoice>('system');

  const STORAGE_KEY = 'theme';

  const applyTheme = (choice: ThemeChoice) => {
    const root = document.documentElement;

    if (choice === 'light' || choice === 'dark') {
      root.dataset.theme = choice;
    } else {
      root.removeAttribute('data-theme');
    }
  };

  const loadTheme = (): ThemeChoice => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw;
    return 'system';
  };

  useEffect(() => {
    const saved = loadTheme();
    setChoice(saved);
    applyTheme(saved);
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as ThemeChoice;
    setChoice(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  };

  return (
    <div className="theme-select">
      <p>{t('settings.theme')}</p>
      <select value={choice} onChange={onChange}>
        <option value="system">{t('settings.system')}</option>
        <option value="light">{t('settings.light')}</option>
        <option value="dark">{t('settings.dark')}</option>
      </select>
    </div>
  );
};
