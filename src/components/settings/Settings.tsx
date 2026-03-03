'use client';

import { useRouter } from '@/i18n/routing';
import { Language } from '@/lib/types';
import { isAppInstalled } from '@/lib/utils/isAppInstalled';
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
    setInstalled(isAppInstalled());
  }, []);

  const detectEnv = () => {
    const ua = navigator.userAgent || '';
    const isAndroid = /Android/.test(ua);
    const isFirefox = /Firefox\//.test(ua);
    const isFirefoxIOS = /FxiOS\//.test(ua);
    const isIOS = /iPad|iPhone|iPod/.test(ua);

    return { isAndroid, isFirefox, isFirefoxIOS, isIOS };
  };

  const buildIntentUrl = (targetHttpsUrl: string) => {
    const withoutScheme = targetHttpsUrl.replace(/^https?:\/\//, '');
    return `intent://${withoutScheme}#Intent;scheme=https;package=com.android.chrome;end`;
  };

  const openInstallPage = () => {
    const { isAndroid, isFirefox } = detectEnv();

    if (isAndroid && isFirefox) {
      const target = new URL(`/${locale}/install`, window.location.origin).toString();
      window.location.href = buildIntentUrl(target);
      return;
    }

    router.push('/install');
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
          <button className="little-button" onClick={openInstallPage}>
            {t('install.routeButton')}
          </button>
        </div>
      )}
    </div>
  );
};
