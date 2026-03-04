'use client';

import { Language } from '@/lib/types';
import clsx from 'clsx';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { InfoModal } from '../tools/InfoModal';
import { useInstallPrompt } from '../tools/InstallProvider';
import { showToast } from '../tools/ToastProvider';

function detectEnv() {
  const ua = navigator.userAgent || '';

  const isAndroid = /Android/.test(ua);
  const isIOS = /iPad|iPhone|iPod/.test(ua);

  // iOS browsers
  const isFirefoxIOS = /FxiOS\//.test(ua);
  const isChromeIOS = /CriOS\//.test(ua);
  const isEdgeIOS = /EdgiOS\//.test(ua);
  const isOperaIOS = /OPiOS\//.test(ua);

  // General Firefox (Android + iOS)
  const isFirefox = /Firefox\//.test(ua) || isFirefoxIOS;

  // Safari iOS heuristic: Safari present, but not other iOS browsers
  const isSafariIOS =
    isIOS && /Safari\//.test(ua) && !isFirefoxIOS && !isChromeIOS && !isEdgeIOS && !isOperaIOS;

  return { isIOS, isAndroid, isFirefox, isFirefoxIOS, isSafariIOS };
}

export const InstallAsterButton = () => {
  const t = useTranslations();
  const locale = useLocale() as Language;

  const env = detectEnv();

  const { bipEvent, isInstalled, markInstalled } = useInstallPrompt();
  const [isInstalledSomewhere, setIsInstalledSomewhere] = useState(false);

  // iOS modals
  const [openIosInstallModal, setOpenIosInstallModal] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        if ('getInstalledRelatedApps' in navigator) {
          // @ts-expect-error - not in standard TS lib yet
          const apps = await navigator.getInstalledRelatedApps();
          if (Array.isArray(apps) && apps.length > 0) setIsInstalledSomewhere(true);
        }
      } catch {}
    };
    run();
  }, []);

  const disableInstall = isInstalled || isInstalledSomewhere;

  const copyInstallLink = async () => {
    try {
      await navigator.clipboard.writeText('https://aster-pearl.vercel.app/install');
      return true;
    } catch {
      return false;
    }
  };

  const openInChromeAndroid = () => {
    const intent = `intent://aster-pearl.vercel.app/${locale}/install#Intent;scheme=https;package=com.android.chrome;end`;
    window.location.href = intent;

    setTimeout(async () => {
      await copyInstallLink();
      showToast({ status: 'info', message: t('install.openInChrome') });
    }, 1200);
  };

  const installAster = async () => {
    if (disableInstall) return;

    // Android/Chromium install prompt
    if (bipEvent) {
      await bipEvent.prompt();
      const choice = await bipEvent.userChoice;
      if (choice.outcome === 'accepted') markInstalled();
      return;
    }

    // iOS branch: show modal or toast
    if (env.isIOS) {
      if (!env.isSafariIOS) {
        await copyInstallLink();
        showToast({ status: 'info', message: t('install.openInSafari') });
        return;
      }

      // Safari iOS -> guide (modal ou autre)
      setOpenIosInstallModal(true);
      return;
    }

    // Firefox Android -> try open Chrome
    if (env.isFirefox && env.isAndroid) {
      openInChromeAndroid();
      return;
    }

    // Final fallback (context-aware)
    await copyInstallLink();

    if (env.isAndroid && !env.isFirefox) {
      // Chrome/Chromium Android but no beforeinstallprompt available
      showToast({ status: 'info', message: t('install.installNotAvailableNow') });
      return;
    }

    showToast({ status: 'info', message: t('install.cantInstallToast') });
  };

  return (
    <>
      <button
        type="button"
        className={'main-button ' + clsx(disableInstall && 'disabled')}
        onClick={installAster}
        disabled={disableInstall}
      >
        {t('install.launchInstall')}
      </button>

      <InfoModal open={openIosInstallModal} onClose={() => setOpenIosInstallModal(false)}>
        <p>coucou modale (iOS Safari install)</p>
      </InfoModal>
    </>
  );
};
