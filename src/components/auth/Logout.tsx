'use client';

import { logout } from '@/actions/auth/logout';
import { useRouter } from '@/i18n/routing';
import { useState } from 'react';
import { showToast } from '../providers/ToastProvider';

export const Logout = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const res = await logout();
      showToast(res);
      if (res.ok) router.replace('/login');
    } catch (err) {
      console.error(err);
      showToast({
        ok: false,
        status: 'error',
        message: 'Une erreur est survenue.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="links-box">
      <button
        onClick={handleLogout}
        className="little-button"
        aria-busy={isLoading}
        disabled={isLoading}
      >
        {isLoading ? 'Déconnexion...' : 'Se déconnecter'}
      </button>
    </div>
  );
};
