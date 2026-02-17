'use client';

import { login } from '@/actions/auth/login';
import { Link, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { showToast } from '../tools/ToastProvider';
import { PasswordInput } from './PasswordInput';

export const Login = () => {
  const t = useTranslations();
  const router = useRouter();

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
        message: t('auth.login.invalid'),
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(formData);
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
        <h2>{t('auth.login.notMemberTitle')}</h2>
        <Link href="/register" className="main-button">
          {t('auth.login.register')}
        </Link>
      </div>
      <div className="auth-block">
        <h2>{t('auth.login.memberTitle')}</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="userEmail">{t('auth.emailLabel')}</label>
          <input
            className="auth-field"
            type="text"
            name="userEmail"
            placeholder={t('auth.emailPlaceholder')}
          />

          <label htmlFor="userPassword">{t('auth.passwordLabel')}</label>
          <PasswordInput name="userPassword" placeholder={t('auth.passwordPlaceholder')} />

          <Link className="public-link" href="/reset-password">
            {t('auth.login.forgotPasswordLink')}
          </Link>

          <button type="submit" className="main-button" aria-busy={isLoading} disabled={isLoading}>
            {isLoading ? t('auth.login.loading') : t('auth.login.submit')}
          </button>
          <p className="version-login">Aster v1.2.2</p>
        </form>
      </div>
    </div>
  );
};
