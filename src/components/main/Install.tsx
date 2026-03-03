'use client';

import { useTranslations } from 'next-intl';
import { InstallAsterButton } from './InstallAsterButton';

export const Install = () => {
  const t = useTranslations();

  return (
    <div className="install-page">
      <h2>{t('install.title')}</h2>
      <p>{t('install.disclaimer1')}</p>
      <p>{t('install.disclaimer2')}</p>
      <p>{t('install.disclaimer3')}</p>
      <InstallAsterButton />
    </div>
  );
};
