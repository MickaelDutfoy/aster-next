'use client';

import { useTranslations } from 'next-intl';
import { Logout } from './auth/Logout';
import { LanguageSelector } from './LanguageSelector';

export const Settings = () => {
  const t = useTranslations();

  return (
    <>
      <Logout />
      <div className="lang-change">
        <p>{t('settings.changeLanguage')}</p>
        <LanguageSelector size={32} />
      </div>
    </>
  );
};
