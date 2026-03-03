'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

type InstallPromptContextValue = {
  bipEvent: BeforeInstallPromptEvent | null;
  isInstalled: boolean;
  markInstalled: () => void;
};

const InstallPromptContext = createContext<InstallPromptContextValue | null>(null);

function computeIsInstalled() {
  return (
    window.matchMedia?.('(display-mode: standalone)')?.matches ||
    // @ts-expect-error - iOS Safari
    window.navigator.standalone === true
  );
}

export function InstallProvider({ children }: { children: React.ReactNode }) {
  const [bipEvent, setBipEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    setIsInstalled(computeIsInstalled());

    const onBip = (e: Event) => {
      e.preventDefault?.();
      setBipEvent(e as BeforeInstallPromptEvent);
    };

    const onAppInstalled = () => {
      setIsInstalled(true);
      setBipEvent(null);
    };

    window.addEventListener('beforeinstallprompt', onBip);
    window.addEventListener('appinstalled', onAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBip);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  const value = useMemo<InstallPromptContextValue>(
    () => ({
      bipEvent,
      isInstalled,
      markInstalled: () => {
        setIsInstalled(true);
        setBipEvent(null);
      },
    }),
    [bipEvent, isInstalled],
  );

  return <InstallPromptContext.Provider value={value}>{children}</InstallPromptContext.Provider>;
}

export function useInstallPrompt() {
  const ctx = useContext(InstallPromptContext);
  if (!ctx) throw new Error('useInstallPrompt must be used within InstallPromptProvider');
  return ctx;
}
