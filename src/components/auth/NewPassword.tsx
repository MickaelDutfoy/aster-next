'use client';

import { changePassword } from '@/actions/auth/changePassword';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { showToast } from '../providers/ToastProvider';

export const NewPassword = ({ token }: { token: string }) => {
  const [res, handleChangePassword, isLoading] = useActionState(changePassword, null);

  const router = useRouter();

  useEffect(() => {
    if (!res) return;
    showToast(res);
    if (res.ok) router.replace('/login');
  }, [res]);

  return (
    <div className="auth-page">
      <div className="auth-block">
        <form action={handleChangePassword}>
          <input type="hidden" name="token" value={token} />
          <label htmlFor="userPassword">Nouveau mot de passe :</label>
          <input
            className="auth-field"
            type="password"
            name="userPassword"
            placeholder="Mot de passe"
          />
          <input
            className="auth-field"
            type="password"
            name="userPasswordConfirm"
            placeholder="Confirmer le mot de passe"
          />
          <button className="main-button" aria-busy={isLoading} disabled={isLoading}>
            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </form>
      </div>
    </div>
  );
};
