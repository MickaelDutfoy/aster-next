'use client';

import { useTranslations } from 'next-intl';
import { InstallProvider } from './InstallProvider';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations();

  return <InstallProvider>{children}</InstallProvider>;
}