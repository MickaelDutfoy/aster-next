'use client';

import { sendResetPasswordMail } from '@/actions/auth/sendResetPasswordMail';
import { resetPasswordSchema } from '@/lib/schemas/authSchemas';
import { zodErrorMessage } from '@/lib/utils/zodErrorMessage';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { showToast } from '../providers/ToastProvider';

export const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const tAuth = useTranslations('Auth');
  const t = useTranslations('Auth.ResetPassword');
  const tToasts = useTranslations('Toasts');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const emailForm = formData.get('userEmail')?.toString().trim().toLowerCase();
    const parsedEmail = resetPasswordSchema.safeParse(emailForm);

    if (!parsedEmail.success) {
      showToast({
        ok: false,
        status: 'error',
        message: zodErrorMessage(parsedEmail.error),
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendResetPasswordMail(formData);
      showToast(res);
    } catch (err) {
      showToast({
        ok: false,
        status: 'error',
        message: tToasts('errorGeneric'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-block">
        <form onSubmit={handleSubmit}>
          <label htmlFor="userEmail">{tAuth('emailLabel')}</label>
          <input
            className="auth-field"
            type="text"
            name="userEmail"
            placeholder={tAuth('emailPlaceholder')}
          />
          <p className="disclaimer">{t('disclaimer')}</p>
          <button type="submit" className="main-button" aria-busy={isLoading} disabled={isLoading}>
            {isLoading ? t('loading') : t('submit')}
          </button>
        </form>
      </div>
    </div>
  );
};
