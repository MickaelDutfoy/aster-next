'use client';

import { changePassword } from '@/actions/auth/changePassword';
import { useRouter } from '@/i18n/routing';
import { newPasswordSchema } from '@/lib/schemas/authSchemas';
import { zodErrorMessage } from '@/lib/utils/zodErrorMessage';
import { useState } from 'react';
import { showToast } from '../providers/ToastProvider';

export const NewPassword = ({ token }: { token: string }) => {
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
        message: zodErrorMessage(parsedNewPassword.error),
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await changePassword(formData);
      showToast(res);
      if (res.ok) router.replace('/login');
    } catch (err) {
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
    <div className="auth-page">
      <div className="auth-block">
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="main-button" aria-busy={isLoading} disabled={isLoading}>
            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </form>
      </div>
    </div>
  );
};
