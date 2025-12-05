'use client';

import { useEffect } from 'react';
import { showToast } from './providers/ToastProvider';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.innerWidth > 768) {
      showToast(
        {
          ok: true,
          status: 'info',
          message: 'Aster est optimisé pour mobile — pensez au mode responsive (Ctrl+Shift+M).',
        },
        30000, // 30 secondes
      );
    }
  }, []);

  return <>{children}</>;
}
