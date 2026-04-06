'use client';

import { useTranslations } from 'next-intl';

export const DeniedPage = ({
  cause,
}: {
  cause: 'error' | 'refused' | 'soon' | 'treasury' | 'publish';
}) => {
  const t = useTranslations();

  return (
    <div className="denied-page">
      {cause === 'error' && <h3>{t('common.errorOccurred')}</h3>}
      {cause === 'refused' && <h3>{t('common.accessDenied')}</h3>}
      {cause === 'treasury' && <h3>{t('transactions.accessDenied')}</h3>}
      {cause === 'publish' && <h3>{t('publish.soonToCome')}</h3>}
    </div>
  );
};
