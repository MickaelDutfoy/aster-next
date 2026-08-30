'use client';

import { useTheme } from '@/components/tools/ThemeProvider';
import { ThemeChoice } from '@/lib/types';
import { useTranslations } from 'next-intl';

export const ThemeSelector = () => {
  const t = useTranslations();
  const { choice, setTheme } = useTheme();

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value as ThemeChoice);
  };

  return (
    <div className="theme-select">
      <p>{t('settings.theme')}</p>

      <select value={choice} onChange={onChange}>
        <option value="system">{t('settings.system')}</option>
        <option value="light">{t('settings.light')}</option>
        <option value="dark">{t('settings.dark')}</option>
        <option value="high-contrast">{t('settings.highContrast')}</option>
      </select>
    </div>
  );
};