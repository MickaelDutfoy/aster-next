'use client';

import { register } from '@/actions/auth/register';
import { useRouter } from 'next/navigation';
import { showToast } from '../providers/ToastProvider';

export const Register = () => {
  const router = useRouter();

  const handleRegister = async (formdata: FormData) => {
    const res = await register(formdata);
    if (res.ok) {
      router.replace('/');
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-block">
        <form action={handleRegister}>
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
          <p className="disclaimer">
            Le numéro de téléphone n'est requis que par commodité de communication pour les membres
            d'une association. Aster n'utilisera jamais votre numéro.
          </p>
          <button type="submit" className="main-button">
            Créer un compte
          </button>
        </form>
      </div>
    </div>
  );
};
