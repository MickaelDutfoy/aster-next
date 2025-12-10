'use client';

import { register } from '@/actions/auth/register';
import { registerSchema } from '@/lib/schemas/authSchemas';
import { zodErrorMessage } from '@/lib/utils/zodErrorMessage';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { showToast } from '../providers/ToastProvider';

export const Register = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newUserForm = {
      firstName: formData.get('userFirstName')?.toString().trim(),
      lastName: formData.get('userLastName')?.toString().trim(),
      email: formData.get('userEmail')?.toString().trim(),
      phoneNumber: formData.get('userPhoneNumber')?.toString().trim(),
      password: formData.get('userPassword')?.toString(),
      passwordConfirm: formData.get('userPasswordConfirm')?.toString(),
    };

    const parsedNewUser = registerSchema.safeParse(newUserForm);

    if (!parsedNewUser.success) {
      showToast({
        ok: false,
        status: 'error',
        message: zodErrorMessage(parsedNewUser.error),
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await register(formData);
      showToast(res);
      if (res.ok) router.replace('/');
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
          <label htmlFor="userFirstName">Prénom :</label>
          <input className="auth-field" type="text" name="userFirstName" placeholder="Prénom" />
          <label htmlFor="userLastName">Nom :</label>
          <input className="auth-field" type="text" name="userLastName" placeholder="Nom" />
          <label htmlFor="userEmail">E-mail :</label>
          <input className="auth-field" type="text" name="userEmail" placeholder="E-mail" />
          <label htmlFor="userPhoneNumber">Téléphone :</label>
          <input
            className="auth-field"
            type="text"
            name="userPhoneNumber"
            placeholder="Téléphone"
          />
          <label htmlFor="userPassword">Mot de passe :</label>
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
          <p className="disclaimer">
            Le numéro de téléphone n'est requis que par commodité de communication pour les membres
            d'une association. Aster n'utilisera jamais votre numéro.
          </p>
          <button type="submit" className="main-button" aria-busy={isLoading} disabled={isLoading}>
            {isLoading ? 'Connexion...' : 'Créer un compte'}
          </button>
        </form>
      </div>
    </div>
  );
};
