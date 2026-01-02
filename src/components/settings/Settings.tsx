'use client';

import { useTranslations } from 'next-intl';
import { LanguageSelector } from './LanguageSelector';
import { ManageAccount } from './ManageAccount';
import { ThemeSelector } from './ThemeSelector';

export const Settings = () => {
  const t = useTranslations();

  return (
    <div className="settings">
      <ManageAccount />
      <div className="lang-change">
        <p>{t('settings.changeLanguage')}</p>
        <LanguageSelector size={26} />
      </div>
      <ThemeSelector />
    </div>
  );
};
