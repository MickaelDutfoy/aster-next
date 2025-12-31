'use client';

import { register } from '@/actions/auth/register';
import { Link, useRouter } from '@/i18n/routing';
import { registerSchema } from '@/lib/schemas/authSchemas';
import { zodErrorMessage } from '@/lib/utils/zodErrorMessage';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { showToast } from '../tools/ToastProvider';
import { PasswordInput } from './PasswordInput';

export const Register = () => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

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
        message: t(zodErrorMessage(parsedNewUser.error)),
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await register(formData, locale);
      showToast({
        ...res,
        message: res.message ? t(res.message) : undefined,
      });
      if (res.ok) router.replace('/');
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
          <label htmlFor="userFirstName">{t('auth.register.firstNameLabel')}</label>
          <input
            className="auth-field"
            type="text"
            name="userFirstName"
            placeholder={t('auth.register.firstNamePlaceholder')}
          />

          <label htmlFor="userLastName">{t('auth.register.lastNameLabel')}</label>
          <input
            className="auth-field"
            type="text"
            name="userLastName"
            placeholder={t('auth.register.lastNamePlaceholder')}
          />

          <label htmlFor="userEmail">{t('auth.emailLabel')}</label>
          <input
            className="auth-field"
            type="text"
            name="userEmail"
            placeholder={t('auth.emailPlaceholder')}
          />

          <label htmlFor="userPhoneNumber">{t('auth.register.phoneLabel')}</label>
          <input
            className="auth-field"
            type="text"
            name="userPhoneNumber"
            placeholder={t('auth.register.phonePlaceholder')}
          />

          <label htmlFor="userPassword">{t('auth.passwordLabel')}</label>
          <PasswordInput name="userPassword" placeholder={t('auth.passwordPlaceholder')} />

          <PasswordInput
            name="userPasswordConfirm"
            placeholder={t('auth.passwordConfirmPlaceholder')}
          />

          <p className="disclaimer">
            {t('privacy.links.registerPrefix')}{' '}
            <Link className="public-link" href="/privacy">
              {t('privacy.links.link')}
            </Link>
            {t('privacy.links.suffix')}
          </p>

          <button type="submit" className="main-button" aria-busy={isLoading} disabled={isLoading}>
            {isLoading ? t('auth.register.loading') : t('auth.register.submit')}
          </button>
        </form>
      </div>
    </div>
  );
};
