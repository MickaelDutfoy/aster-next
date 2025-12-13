'use client';

import { sendResetPasswordMail } from '@/actions/auth/sendResetPasswordMail';
import { resetPasswordSchema } from '@/lib/schemas/authSchemas';
import { zodErrorMessage } from '@/lib/utils/zodErrorMessage';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { showToast } from '../providers/ToastProvider';

export const ResetPassword = () => {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const emailForm = formData.get('userEmail')?.toString().trim().toLowerCase();
    const parsedEmail = resetPasswordSchema.safeParse(emailForm);

    if (!parsedEmail.success) {
      showToast({
        ok: false,
        status: 'error',
        message: t(zodErrorMessage(parsedEmail.error)),
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendResetPasswordMail(formData);
      showToast({
        ...res,
        message: res.message ? t(res.message) : undefined,
      });
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
    <div className="auth-page">
      <div className="auth-block">
        <form onSubmit={handleSubmit}>
          <label htmlFor="userEmail">{t('auth.emailLabel')}</label>
          <input
            className="auth-field"
            type="text"
            name="userEmail"
            placeholder={t('auth.emailPlaceholder')}
          />
          <p className="disclaimer">{t('disclaimer')}</p>
          <button type="submit" className="main-button" aria-busy={isLoading} disabled={isLoading}>
            {isLoading ? t('auth.resetPassword.loading') : t('auth.resetPassword.submit')}
          </button>
        </form>
      </div>
    </div>
  );
};
