'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export const AnimalsPageActions = () => {
  const t = useTranslations();

  return (
    <div className="links-box">
      <Link href={'/animals/new'} className="little-button">
        {t('animals.addTitle')}
      </Link>
    </div>
  );
};
