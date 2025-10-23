'use client';

import { logout } from '@/actions/auth/logout';
import { useRouter } from 'next/navigation';
import { showToast } from '../providers/ToastProvider';

export const Logout = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const res = await logout();
    showToast(res);

    if (res.ok) router.replace('/');
  };

  return (
    <form style={{ textAlign: 'right', margin: '10px 0' }} action={handleLogout}>
      <button type="submit" className="little-button">
        Se déconnecter ?
      </button>
    </form>
  );
};
