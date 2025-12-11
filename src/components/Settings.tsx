'use client';

import { useTranslations } from 'next-intl';
import { Logout } from './auth/Logout';
import { LanguageSelector } from './LanguageSelector';

export const Settings = () => {
  const t = useTranslations('Settings');

  return (
    <>
      <Logout />
      <div className="lang-change">
        <p>{t('changeLanguage')}</p>
        <LanguageSelector size={32} />
      </div>
      <p>Les traductions sont actuellement en cours, seul le français est complet.</p>
    </>
  );
};
