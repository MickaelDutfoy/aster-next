'use client';

import { usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export const Header = () => {
  const t = useTranslations();

  const pathname = usePathname().split('/')[1] || 'home';

  return (
    <div>
      <header>
        <h2>{t(`header.${pathname}`)}</h2>
      </header>
    </div>
  );
};
