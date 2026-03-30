'use client';

import { deleteTransaction } from '@/actions/transactions/deleteTransaction';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { showToast } from '../tools/ToastProvider';

export const DeleteTransaction = ({ id }: { id: string }) => {
  const transactionId = Number(id);
  const t = useTranslations();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const res = await deleteTransaction(transactionId);

      showToast({
        ...res,
        message: res.message ? t(res.message) : undefined,
      });

      if (res.ok) router.back();
    } catch (err) {
      console.error(err);
      showToast({
        ok: false,
        status: 'error',
        message: t('toasts.errorGeneric'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="delete-popup">
      <h3>{t('transactions.deleteTitle')}</h3>
      <p>{t('common.areYouSure')}</p>
      <p>{t('common.actionWarning')}</p>
      <div className="yes-no">
        <button
          type="submit"
          onClick={handleSubmit}
          className="little-button"
          aria-busy={isLoading}
          disabled={isLoading}
        >
          {isLoading ? t('common.deleting') : t('common.confirm')}
        </button>
        <button
          type="button"
          className="little-button"
          onClick={() => router.back()}
          aria-busy={isLoading}
          disabled={isLoading}
        >
          {t('common.cancel')}
        </button>
      </div>
    </div>
  );
};
