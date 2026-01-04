'use client';

import { useTranslations } from 'next-intl';

export const DeniedPage = ({ cause }: { cause: 'error' | 'refused' | 'soon' }) => {
  const t = useTranslations();

  return (
    <div className="denied-page">
      {cause === 'error' && <h3>{t('common.errorOccurred')}</h3>}
      {cause === 'refused' && <h3>{t('common.accessDenied')}</h3>}
      {cause === 'soon' && <h3>{t('common.soonToCome')}</h3>}
    </div>
  );
};
