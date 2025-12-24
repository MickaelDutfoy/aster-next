'use client';

import { deleteFamily } from '@/actions/families/deleteFamily';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { showToast } from '../app/ToastProvider';

export const DeleteFamily = ({ id }: { id: string }) => {
  const t = useTranslations();
  const familyId = Number(id);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await deleteFamily(familyId);
      showToast({
        ...res,
        message: res.message ? t(res.message) : undefined,
      });
      if (res.ok) router.replace('/families');
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
      <h3>{t('families.deleteTitle')}</h3>
      <p>{t('common.areYouSure')}</p>
      <div className="yes-no">
        <button
          onClick={handleSubmit}
          className="little-button"
          aria-busy={isLoading}
          disabled={isLoading}
        >
          {isLoading ? t('common.deleting') : t('common.confirm')}
        </button>
        <button className="little-button" onClick={() => router.back()}>
          {t('common.cancel')}
        </button>
      </div>
    </div>
  );
};
