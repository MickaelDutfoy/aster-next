'use client';

import { isAppContext } from '@/lib/utils/isAppContext';
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

export function InstallProvider({ children }: { children: React.ReactNode }) {
  const [bipEvent, setBipEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    setIsInstalled(isAppContext());

    // If something captured it earlier, restore it
    const cached = (window as any).__ASTER_BIP_EVENT__ as BeforeInstallPromptEvent | null;
    if (cached) setBipEvent(cached);

    const onBip = (e: Event) => {
      e.preventDefault?.();
      (window as any).__ASTER_BIP_EVENT__ = e;
      setBipEvent(e as BeforeInstallPromptEvent);
    };

    const onAppInstalled = () => {
      setIsInstalled(true);
      (window as any).__ASTER_BIP_EVENT__ = null;
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
        (window as any).__ASTER_BIP_EVENT__ = null;
        setBipEvent(null);
      },
    }),
    [bipEvent, isInstalled],
  );

  return <InstallPromptContext.Provider value={value}>{children}</InstallPromptContext.Provider>;
}

export function useInstallPrompt() {
  const ctx = useContext(InstallPromptContext);
  if (!ctx) throw new Error('useInstallPrompt must be used within InstallProvider');
  return ctx;
}