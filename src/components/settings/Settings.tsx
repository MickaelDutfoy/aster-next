'use client';

import { useRouter } from '@/i18n/routing';
import { Language } from '@/lib/types';
import { isAppContext } from '@/lib/utils/isAppContext';
import { openInstallPage } from '@/lib/utils/openInstallPage';
import { MailQuestionMark } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { LanguageSelector } from './LanguageSelector';
import { ManageAccount } from './ManageAccount';
import { ThemeSelector } from './ThemeSelector';

export const Settings = () => {
  const locale = useLocale() as Language;
  const t = useTranslations();
  const router = useRouter();

  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    setInstalled(isAppContext());
  }, []);

  const handleNavigate = () => {
    openInstallPage({
      locale,
      origin: window.location.origin,
      push: router.push,
    });
  };

  return (
    <div className="settings">
      <ManageAccount />
      <div className="settings-body">
        <div className="lang-change">
          <p>{t('settings.changeLanguage')}</p>
          <LanguageSelector size={26} />
        </div>
        <ThemeSelector />
        <div className="contact-link">
          <p>{t('settings.contactIntro')}</p>
          <MailQuestionMark className="link" size={32} onClick={() => router.replace('/contact')} />
        </div>
      </div>
      {!installed && (
        <div className="install-link">
          <h4>{t('install.prompt')}</h4>
          <button className="little-button" onClick={handleNavigate}>
            {t('install.routeButton')}
          </button>
        </div>
      )}
    </div>
  );
};
