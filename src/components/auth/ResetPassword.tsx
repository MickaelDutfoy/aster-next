'use client';

import { sendResetPasswordMail } from '@/actions/auth/sendResetPasswordMail';
import { useActionState, useEffect } from 'react';
import { showToast } from '../providers/ToastProvider';

export const ResetPassword = () => {
  const [res, handleSendResetMail, isLoading] = useActionState(sendResetPasswordMail, null);

  useEffect(() => {
    if (!res) return;
    showToast(res);
  }, [res]);

  return (
    <div className="auth-page">
      <div className="auth-block">
        <form action={handleSendResetMail}>
          <label htmlFor="userEmail">E-mail :</label>
          <input className="auth-field" type="text" name="userEmail" placeholder="E-mail" />
          <p className="disclaimer">
            Indiquez l'adresse e-mail de votre compte pour réinitialiser votre mot de passe.
          </p>
          <button className="main-button" aria-busy={isLoading} disabled={isLoading}>
            {isLoading ? 'Envoi...' : 'Envoyer'}
          </button>
        </form>
      </div>
    </div>
  );
};
