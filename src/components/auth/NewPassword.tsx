'use client';

import { changePassword } from '@/actions/auth/changePassword';
import { useRouter } from '@/i18n/routing';
import { newPasswordSchema } from '@/lib/schemas/authSchemas';
import { zodErrorMessage } from '@/lib/utils/zodErrorMessage';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { showToast } from '../app/ToastProvider';
import { PasswordInput } from './PasswordInput';

export const NewPassword = ({ token }: { token: string }) => {
  const t = useTranslations();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newPasswordForm = {
      password: formData.get('userPassword')?.toString(),
      passwordConfirm: formData.get('userPasswordConfirm')?.toString(),
    };

    const parsedNewPassword = newPasswordSchema.safeParse(newPasswordForm);

    if (!parsedNewPassword.success) {
      showToast({
        ok: false,
        status: 'error',
        message: t(zodErrorMessage(parsedNewPassword.error)),
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await changePassword(formData);
      showToast({
        ...res,
        message: res.message ? t(res.message) : undefined,
      });
      if (res.ok) router.replace('/login');
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
          <input type="hidden" name="token" value={token} />
          <label htmlFor="userPassword">{t('auth.newPasswordLabel')}</label>
          <PasswordInput name="userPassword" placeholder={t('auth.passwordPlaceholder')} />
          <PasswordInput
            name="userPasswordConfirm"
            placeholder={t('auth.passwordConfirmPlaceholder')}
          />
          <button type="submit" className="main-button" aria-busy={isLoading} disabled={isLoading}>
            {isLoading ? t('common.loading') : t('common.ubmit')}
          </button>
        </form>
      </div>
    </div>
  );
};
