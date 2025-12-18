'use client';

import { useTranslations } from 'next-intl';
import { Logout } from '../auth/Logout';
import { LanguageSelector } from './LanguageSelector';
import { ThemeSelector } from './ThemeSelector';

export const Settings = () => {
  const t = useTranslations();

  return (
    <div className="settings">
      <p className="version">Aster v0.12.3</p>
      <Logout />
      <div className="lang-change">
        <p>{t('settings.changeLanguage')}</p>
        <LanguageSelector size={26} />
      </div>
      <ThemeSelector />
    </div>
  );
};
