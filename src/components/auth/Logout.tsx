'use client';

import { logout } from '@/actions/auth/logout';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { showToast } from '../providers/ToastProvider';

export const Logout = () => {
  const [res, handleLogout, isLoading] = useActionState(logout, null);

  const router = useRouter();

  useEffect(() => {
    if (!res) return;
    showToast(res);
    if (res.ok) router.replace('/');
  }, [res]);

  return (
    <form style={{ textAlign: 'right', margin: '10px 0' }} action={handleLogout}>
      <button type="submit" className="little-button" aria-busy={isLoading} disabled={isLoading}>
        {isLoading ? 'Déconnexion...' : 'Se déconnecter'}
      </button>
    </form>
  );
};
