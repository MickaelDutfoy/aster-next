'use client';

import { useMemo } from 'react';
import { useInstallPrompt } from '../tools/InstallProvider';

function detectEnv() {
  const ua = navigator.userAgent || '';
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isFirefox = /Firefox\//.test(ua) || /FxiOS\//.test(ua);
  const isFirefoxIOS = /FxiOS\//.test(ua);
  const isAndroid = /Android/.test(ua);

  return { isIOS, isAndroid, isFirefox, isFirefoxIOS };
}

export function InstallAsterButton() {
  const { bipEvent, isInstalled, markInstalled } = useInstallPrompt();
  const env = useMemo(() => (typeof window === 'undefined' ? null : detectEnv()), []);

  const openInChromeAndroid = () => {
    const url = window.location.href;
    const withoutScheme = url.replace(/^https?:\/\//, '');
    const intent = `intent://${withoutScheme}#Intent;scheme=https;package=com.android.chrome;end`;

    window.location.href = intent;

    setTimeout(async () => {
      try {
        await navigator.clipboard.writeText(url);
        alert('Lien copié ✅ Ouvre Chrome et colle-le si besoin.');
      } catch {
        alert('Ouvre Chrome et va sur : ' + url);
      }
    }, 800);
  };

  const onClick = async () => {
    if (isInstalled) return;

    if (bipEvent) {
      await bipEvent.prompt();
      const choice = await bipEvent.userChoice;
      if (choice.outcome === 'accepted') markInstalled();
      return;
    }

    if (!env) return;

    if (env.isIOS || env.isFirefoxIOS) {
      window.open('/doc/Install_iPhone_FR.pdf', '_blank');
      return;
    }

    if (env.isFirefox && env.isAndroid) {
      openInChromeAndroid();
      return;
    }

    alert('Ouvre Aster dans Chrome (Android) ou Safari (iPhone) pour l’installer.');
  };

  return (
    <button type="button" className="little-button" onClick={onClick} disabled={isInstalled}>
      {isInstalled ? 'Aster est déjà installé ✅' : 'Installer Aster'}
    </button>
  );
}
