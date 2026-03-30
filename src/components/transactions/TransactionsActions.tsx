'use client';

import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export const TransactionsActions = () => {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className="links-box">
      <button onClick={() => router.push('/transactions/new')} className="little-button">
        {t('transactions.addTitle')}
      </button>
    </div>
  );
};
