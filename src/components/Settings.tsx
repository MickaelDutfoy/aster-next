'use client';

import { useTranslations } from 'next-intl';
import { Logout } from './auth/Logout';
import { LanguageSelector } from './LanguageSelector';

export const Settings = () => {
  const t = useTranslations();

  return (
    <div className="settings">
      <p className="version">Aster v0.10.0</p>
      <Logout />
      <div className="lang-change">
        <p>{t('settings.changeLanguage')}</p>
        <LanguageSelector size={32} />
      </div>
    </div>
  );
};
