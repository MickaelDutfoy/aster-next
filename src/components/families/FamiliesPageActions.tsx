'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export const FamiliesPageActions = () => {
  const t = useTranslations();

  return (
    <div className="links-box">
      <Link href={'/families/new'} className="little-button">
        {t('families.addTitle')}
      </Link>
    </div>
  );
};
