'use client';

import { register } from '@/actions/auth/register';
import { useRouter } from '@/i18n/routing';
import { registerSchema } from '@/lib/schemas/authSchemas';
import { zodErrorMessage } from '@/lib/utils/zodErrorMessage';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { showToast } from '../providers/ToastProvider';
import { PasswordInput } from './PasswordInput';

export const Register = () => {
  const router = useRouter();
  const tAuth = useTranslations('Auth');
  const t = useTranslations('Auth.Register');
  const tToasts = useTranslations('Toasts');

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newUserForm = {
      firstName: formData.get('userFirstName')?.toString().trim(),
      lastName: formData.get('userLastName')?.toString().trim(),
      email: formData.get('userEmail')?.toString().trim().toLowerCase(),
      phoneNumber: formData.get('userPhoneNumber')?.toString().trim(),
      password: formData.get('userPassword')?.toString(),
      passwordConfirm: formData.get('userPasswordConfirm')?.toString(),
    };

    const parsedNewUser = registerSchema.safeParse(newUserForm);

    if (!parsedNewUser.success) {
      showToast({
        ok: false,
        status: 'error',
        message: zodErrorMessage(parsedNewUser.error),
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await register(formData);
      showToast(res);
      if (res.ok) router.replace('/');
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
          <label htmlFor="userFirstName">{t('firstNameLabel')}</label>
          <input
            className="auth-field"
            type="text"
            name="userFirstName"
            placeholder={t('firstNamePlaceholder')}
          />

          <label htmlFor="userLastName">{t('lastNameLabel')}</label>
          <input
            className="auth-field"
            type="text"
            name="userLastName"
            placeholder={t('lastNamePlaceholder')}
          />

          <label htmlFor="userEmail">{tAuth('emailLabel')}</label>
          <input
            className="auth-field"
            type="text"
            name="userEmail"
            placeholder={tAuth('emailPlaceholder')}
          />

          <label htmlFor="userPhoneNumber">{t('phoneLabel')}</label>
          <input
            className="auth-field"
            type="text"
            name="userPhoneNumber"
            placeholder={t('phonePlaceholder')}
          />

          <label htmlFor="userPassword">{tAuth('passwordLabel')}</label>
          <PasswordInput name="userPassword" placeholder={tAuth('passwordPlaceholder')} />

          <PasswordInput
            name="userPasswordConfirm"
            placeholder={tAuth('passwordConfirmPlaceholder')}
          />

          <p className="disclaimer">{t('phoneDisclaimer')}</p>

          <button type="submit" className="main-button" aria-busy={isLoading} disabled={isLoading}>
            {isLoading ? t('loading') : t('submit')}
          </button>
        </form>
      </div>
    </div>
  );
};
