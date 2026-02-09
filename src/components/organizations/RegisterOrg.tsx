'use client';

import { registerOrg } from '@/actions/organizations/registerOrg';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { showToast } from '../tools/ToastProvider';

export const RegisterOrg = () => {
  const t = useTranslations();
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const orgName = formData.get('orgName')?.toString().trim();

    if (!orgName) {
      showToast({
        ok: false,
        status: 'error',
        message: t('toasts.orgNameRequired'),
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await registerOrg(formData);
      showToast({
        ...res,
        message: res.message ? t(res.message) : undefined,
      });
      if (res.ok) {
        formRef.current?.reset();
      }
    } catch (err) {
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
    <div>
      <h3>{t('organizations.registerTitle')}</h3>

      <form ref={formRef} onSubmit={handleSubmit}>
        <input type="text" name="orgName" placeholder={t('organizations.orgNamePlaceholder')} />

        <button type="submit" className="little-button" aria-busy={isLoading} disabled={isLoading}>
          {isLoading ? t('common.loading') : t('common.submit')}
        </button>
      </form>
    </div>
  );
};
