'use client';

import { sendResetPasswordMail } from '@/actions/auth/sendResetPasswordMail';
import { resetPasswordSchema } from '@/lib/schemas/authSchemas';
import { zodErrorMessage } from '@/lib/utils/zodErrorMessage';
import { useState } from 'react';
import { showToast } from '../providers/ToastProvider';

export const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const emailForm = formData.get('userEmail')?.toString().trim();
    const parsedEmail = resetPasswordSchema.safeParse(emailForm);

    if (!parsedEmail.success) {
      showToast({
        ok: false,
        status: 'error',
        message: zodErrorMessage(parsedEmail.error),
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendResetPasswordMail(formData);
      showToast(res);
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
          <label htmlFor="userEmail">E-mail :</label>
          <input className="auth-field" type="text" name="userEmail" placeholder="E-mail" />
          <p className="disclaimer">
            Indiquez l'adresse e-mail de votre compte pour réinitialiser votre mot de passe.
          </p>
          <button type="submit" className="main-button" aria-busy={isLoading} disabled={isLoading}>
            {isLoading ? 'Envoi...' : 'Envoyer'}
          </button>
        </form>
      </div>
    </div>
  );
};
