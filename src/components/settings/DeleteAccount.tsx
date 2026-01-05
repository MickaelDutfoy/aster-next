'use client';

import { deleteAccount } from '@/actions/auth/deleteAccount';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { showToast } from '../tools/ToastProvider';

export const DeleteAccount = () => {
  const t = useTranslations();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const deleteFosterFamilies = formData.has('deleteFosterFamilies');

    if (!isAccepted) {
      showToast({
        ok: false,
        status: 'error',
        message: t('toasts.termsNotAccepted'),
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await deleteAccount(deleteFosterFamilies);
      showToast({
        ...res,
        message: res.message ? t(res.message) : undefined,
      });
      if (res.ok) router.replace(`/login`);
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
    <form className="delete-account-or-org" onSubmit={handleSubmit}>
      <h3>{t('settings.deleteAccount.title')}</h3>
      <p className="notice" style={{ fontSize: '0.8rem' }}>
        {t('common.requiredFieldsNotice')}
      </p>
      <p>{t('settings.deleteAccount.explainIntro')}</p>
      <ul>
        {t.raw('settings.deleteAccount.items').map((item: string, index: number) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <p>{t('settings.deleteAccount.fosterExplain1')}</p>
      <div className="labeled-checkbox">
        <p>{t('settings.deleteAccount.fosterRequest')}</p>
        <input type="checkbox" name="deleteFosterFamilies" id="deleteFosterFamilies" />
      </div>
      <p>{t('settings.deleteAccount.fosterExplain2')}</p>
      <div className="labeled-checkbox">
        <p>{t('settings.deleteAccount.hasConfirmed')}</p>
        <input
          type="checkbox"
          name="isAccepted"
          id="isAccepted"
          onChange={(e) => setIsAccepted(e.target.checked)}
        />
      </div>
      <div className="yes-no">
        <button
          type="submit"
          className="little-button"
          aria-busy={isLoading || !isAccepted}
          disabled={isLoading || !isAccepted}
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
    </form>
  );
};
