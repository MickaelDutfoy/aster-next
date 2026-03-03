'use client';

import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

function isStandalone() {
  // iOS Safari + Chromium
  return (
    window.matchMedia?.('(display-mode: standalone)')?.matches ||
    // @ts-expect-error - iOS Safari
    window.navigator.standalone === true
  );
}

function detectEnv() {
  const ua = navigator.userAgent || '';
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isFirefox = /Firefox\//.test(ua) || /FxiOS\//.test(ua);
  const isFirefoxIOS = /FxiOS\//.test(ua);
  const isAndroid = /Android/.test(ua);

  const isChromiumAndroid =
    isAndroid && !isFirefox && /(Chrome|EdgA|Brave|SamsungBrowser)\//.test(ua);

  return { isIOS, isAndroid, isFirefox, isFirefoxIOS, isChromiumAndroid };
}

export function InstallAsterButton() {
  const [bipEvent, setBipEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  const env = useMemo(() => (typeof window === 'undefined' ? null : detectEnv()), []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setInstalled(isStandalone());

    const onBip = (e: Event) => {
      // Empêche le mini-infobar auto → on contrôle via bouton
      e.preventDefault?.();
      setBipEvent(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', onBip);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBip);
    };
  }, []);

  const openInChromeAndroid = () => {
    const url = 'https://aster-pearl.vercel.app/';
    const intent = `intent://aster-pearl.vercel.app/#Intent;scheme=https;package=com.android.chrome;end`;
    // best-effort
    window.location.href = intent;
    // fallback: copie URL (si intent échoue silencieusement)
    setTimeout(async () => {
      try {
        await navigator.clipboard.writeText(url);
        alert("Lien copié ✅ Ouvre Chrome et colle-le dans la barre d'adresse.");
      } catch {
        alert('Ouvre Chrome et va sur : ' + url);
      }
    }, 800);
  };

  const onClick = async () => {
    if (installed) return;

    // Android Chromium installable
    if (bipEvent) {
      await bipEvent.prompt();
      const choice = await bipEvent.userChoice;
      if (choice.outcome === 'accepted') {
        setInstalled(true);
        setBipEvent(null);
      }
      return;
    }

    // Guidance branches
    if (!env) return;

    if (env.isIOS || env.isFirefoxIOS) {
      // Ici tu peux ouvrir un modal + bouton vers ton PDF
      window.open('/doc/Install_iPhone_FR.pdf', '_blank');
      return;
    }

    if (env.isFirefox && env.isAndroid) {
      openInChromeAndroid();
      return;
    }

    // Autres navigateurs: fallback simple
    alert(
      "Si le bouton d'installation n'apparaît pas, ouvre Aster dans Chrome (Android) ou Safari (iPhone).",
    );
  };

  const label = installed
    ? 'Aster est déjà installé ✅'
    : bipEvent
      ? 'Installer Aster'
      : 'Installer Aster';

  return (
    <div className="text-with-link">
      <p>Envie d'une meilleure expérience ?</p>
      <button
        type="button"
        className={'little-button ' + clsx(installed && 'disabled')}
        onClick={onClick}
        disabled={installed}
        style={{
          padding: '12px 14px',
          borderRadius: 10,
          border: '1px solid currentColor',
          width: '100%',
        }}
      >
        {label}
      </button>
    </div>
  );
}
