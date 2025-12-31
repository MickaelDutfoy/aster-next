'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { showToast } from './ToastProvider';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations();

  useEffect(() => {
    if (window.innerWidth > 768) {
      showToast(
        {
          status: 'info',
          message: t('toasts.mobileAlert'),
        },
        30000,
      );
    }
  }, []);

  return <>{children}</>;
}
