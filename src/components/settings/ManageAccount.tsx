'use client';

import { logout } from '@/actions/auth/logout';
import { Link, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { showToast } from '../tools/ToastProvider';

export const ManageAccount = () => {
  const router = useRouter();

  const t = useTranslations();

  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const res = await logout();
      showToast({
        ...res,
        message: res.message ? t(res.message) : undefined,
      });
      if (res.ok) router.replace('/login');
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
    <>
      <div className="links-box">
        <button
          onClick={handleLogout}
          className="little-button"
          aria-busy={isLoading}
          disabled={isLoading}
        >
          {isLoading ? t('auth.logout.loading') : t('auth.logout.submit')}
        </button>
        <Link href={`/settings/delete-account`} className="little-button">
          {t('settings.deleteAccount.title')}
        </Link>
      </div>
      <p className="version">Aster v0.14.0</p>
      <p className="notice" style={{ textAlign: 'justify' }}>
        {t('privacy.links.settingsPrefix')}{' '}
        <Link className="link" href="/privacy">
          {t('privacy.links.link')}
        </Link>
        {t('privacy.links.suffix')}
      </p>
    </>
  );
};
