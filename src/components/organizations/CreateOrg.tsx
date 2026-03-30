'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export const CreateOrg = () => {
  const t = useTranslations();

  return (
    <div className="org-picker">
      <h3>{t('organizations.registerTitle')}</h3>
      <Link className="little-button" href={`/organizations/new`}>
        {t('organizations.createOrg')}
      </Link>
    </div>
  );
};
