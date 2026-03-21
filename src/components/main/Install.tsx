'use client';

import { detectEnv } from '@/lib/detectEnv';
import { Language } from '@/lib/types';
import clsx from 'clsx';
import { Share, SquarePlus } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { InfoModal } from '../tools/InfoModal';
import { useInstallPrompt } from '../tools/InstallProvider';
import { showToast } from '../tools/ToastProvider';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.quietforge.aster';
const DIRECT_INSTALL_URL = 'https://aster-app.eu/install';



export const Install = () => {
  const t = useTranslations();
  const locale = useLocale() as Language;

  const { bipEvent, isInstalled, markInstalled } = useInstallPrompt();

  const [isInstalledSomewhere, setIsInstalledSomewhere] = useState(false);
  const [openIosInstallModal, setOpenIosInstallModal] = useState(false);
  const [env, setEnv] = useState<ReturnType<typeof detectEnv> | null>(null);

  useEffect(() => {
    setEnv(detectEnv());
  }, []);

  const isAndroid = env?.isAndroid ?? false;
  const isIOS = env?.isIOS ?? false;
  const isDesktop = env?.isDesktop ?? false;
  const isFirefox = env?.isFirefox ?? false;
  const isSafariIOS = env?.isSafariIOS ?? false;

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

  const disableDirectInstall = isInstalled || isInstalledSomewhere;

  const copyInstallLink = async () => {
    try {
      await navigator.clipboard.writeText(DIRECT_INSTALL_URL);
      return true;
    } catch {
      return false;
    }
  };

  const openPlayStore = () => {
    window.location.href = PLAY_STORE_URL;
  };

  const openInChromeAndroid = () => {
    const intent = `intent://aster-app.eu/${locale}/install#Intent;scheme=https;package=com.android.chrome;end`;
    window.location.href = intent;

    setTimeout(async () => {
      await copyInstallLink();
      showToast({ status: 'info', message: t('install.openInChrome') });
    }, 1200);
  };

  const handlePrimaryAction = async () => {
    if (!env) return;

    if (isAndroid || isDesktop) {
      openPlayStore();
      return;
    }

    if (isIOS) {
      if (disableDirectInstall) return;

      if (!isSafariIOS) {
        await copyInstallLink();
        showToast({ status: 'info', message: t('install.openInSafari') });
        return;
      }

      setOpenIosInstallModal(true);
    }
  };

  const handleDirectInstall = async () => {
    if (!env || disableDirectInstall) return;

    if (bipEvent) {
      await bipEvent.prompt();
      const choice = await bipEvent.userChoice;
      if (choice.outcome === 'accepted') {
        markInstalled();
      }
      return;
    }

    if (isFirefox && isAndroid) {
      openInChromeAndroid();
      return;
    }

    await copyInstallLink();

    if (isAndroid && !isFirefox) {
      showToast({ status: 'info', message: t('install.installNotAvailableNow') });
      return;
    }

    showToast({ status: 'info', message: t('install.cantInstallToast') });
  };

  const primaryLabel =
    env === null
      ? t('install.launchInstall')
      : isAndroid || isDesktop
        ? t('install.launchInstallPlayStore')
        : disableDirectInstall
          ? t('install.isAlreadyInstalled')
          : t('install.launchInstall');

  return (
    <>
      <div className="install-page">
        <h2>{t('install.title')}</h2>
        <p>{t('install.disclaimer1')}</p>
        <p>{t('install.disclaimer2')}</p>

        <button
          type="button"
          className={'main-button ' + clsx(isIOS && disableDirectInstall && 'disabled')}
          onClick={handlePrimaryAction}
          disabled={isIOS && disableDirectInstall}
        >
          {primaryLabel}
        </button>

        {isAndroid && env && (
          <button
            type="button"
            className="public-button"
            onClick={handleDirectInstall}
            disabled={disableDirectInstall}
          >
            {t('install.launchInstallWithoutStore')}
          </button>
        )}

        {env && isDesktop && <p className="install-hint">{t('install.desktopIosHint')}</p>}
      </div>

      <InfoModal open={openIosInstallModal} onClose={() => setOpenIosInstallModal(false)}>
        <div className="safari-tutorial">
          <h3>{t('install.safariModalTitle')}</h3>
          <p>{t('install.safariModal1')}</p>

          <div className="text-with-icon">
            <p>{t('install.safariModal2')}</p>
            <Share />
          </div>

          <div className="text-with-icon">
            <p>{t('install.safariModal3')}</p>
            <SquarePlus />
          </div>

          <p>{t('install.safariModal4')}</p>
        </div>
      </InfoModal>
    </>
  );
};
