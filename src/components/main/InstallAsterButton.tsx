'use client';

import { Language } from '@/lib/types';
import clsx from 'clsx';
import { useLocale, useTranslations } from 'next-intl';
import { useInstallPrompt } from '../tools/InstallProvider';
import { showToast } from '../tools/ToastProvider';

function detectEnv() {
  const ua = navigator.userAgent || '';
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isFirefox = /Firefox\//.test(ua) || /FxiOS\//.test(ua);
  const isFirefoxIOS = /FxiOS\//.test(ua);
  const isAndroid = /Android/.test(ua);

  return { isIOS, isAndroid, isFirefox, isFirefoxIOS };
}

export const InstallAsterButton = () => {
  const t = useTranslations();
  const locale = useLocale() as Language;
  const env = detectEnv();

  const { bipEvent, isInstalled, markInstalled } = useInstallPrompt();

  const openInChromeAndroid = () => {
    const intent = `intent://aster-pearl.vercel.app/${locale}/install#Intent;scheme=https;package=com.android.chrome;end`;
    window.location.href = intent;

    setTimeout(() => {
      showToast({ status: 'info', message: t('install.openInChrome') });
    }, 1200);
  };

  const installAster = async () => {
    if (isInstalled) return;

    if (bipEvent) {
      await bipEvent.prompt();
      const choice = await bipEvent.userChoice;
      if (choice.outcome === 'accepted') markInstalled();
      return;
    }

    if (!env) return;

    if (env.isIOS || env.isFirefoxIOS) {
      window.open(`/doc/Install_iPhone_${locale.toUpperCase()}.pdf`, '_blank');
      return;
    }

    if (env.isFirefox && env.isAndroid) {
      openInChromeAndroid();
      return;
    }

    showToast({ status: 'error', message: t('install.cantInstallToast') });
  };

  return (
    <button
      type="button"
      className={'main-button ' + clsx(isInstalled && 'disabled')}
      onClick={installAster}
      disabled={isInstalled}
    >
      {isInstalled ? t('install.isAlreadyInstalled') : t('install.launchInstall')}
    </button>
  );
};
