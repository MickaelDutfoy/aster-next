'use client';

import { login } from '@/actions/auth/login';
import { Link, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { showToast } from '../providers/ToastProvider';
import { PasswordInput } from './PasswordInput';

export const Login = () => {
  const router = useRouter();

  const tAuth = useTranslations('Auth');
  const t = useTranslations('Auth.Login');
  const tToasts = useTranslations('Toasts');

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const user = {
      email: formData.get('userEmail')?.toString().trim().toLowerCase(),
      password: formData.get('userPassword')?.toString(),
    };

    if (!user.email || !user.password) {
      showToast({
        ok: false,
        status: 'error',
        message: tToasts('invalidCredentials'),
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(formData);
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
        <h2>{t('notMemberTitle')}</h2>
        <Link href="/register" className="main-button">
          {t('registerCta')}
        </Link>
      </div>
      <div className="auth-block">
        <h2>{t('memberTitle')}</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="userEmail">{tAuth('emailLabel')}</label>
          <input
            className="auth-field"
            type="text"
            name="userEmail"
            placeholder={tAuth('emailPlaceholder')}
          />

          <label htmlFor="userPassword">{tAuth('passwordLabel')}</label>
          <PasswordInput name="userPassword" placeholder={tAuth('passwordPlaceholder')} />

          <Link className="public-link" href="/reset-password">
            <u>{t('forgotPasswordLink')}</u>
          </Link>

          <button type="submit" className="main-button" aria-busy={isLoading} disabled={isLoading}>
            {isLoading ? t('loading') : t('submit')}
          </button>
        </form>
      </div>
    </div>
  );
};
