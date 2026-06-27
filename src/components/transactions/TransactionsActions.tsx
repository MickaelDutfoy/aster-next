'use client';

import { useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { DonwloadButton } from '../tools/DownloadButton';

export const TransactionsActions = ({ orgId }: { orgId: number }) => {
  const locale = useLocale();
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className="share-and-links-box">
      <DonwloadButton href={`/api/organizations/${orgId}/transactions/export?locale=${locale}`} />
      <div className="links-box">
        <button onClick={() => router.push('/transactions/new')} className="little-button">
          {t('transactions.addTitle')}
        </button>
        <button
          onClick={() => router.push('/transactions/edit-categories')}
          className="little-button"
        >
          {t('transactions.editCategories')}
        </button>
      </div>
    </div>
  );
};
