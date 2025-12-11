'use client';

import { login } from '@/actions/auth/login';
import { Link, useRouter } from '@/i18n/routing';
import { useState } from 'react';
import { showToast } from '../providers/ToastProvider';

export const Login = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const user = {
      email: formData.get('userEmail')?.toString().trim(),
      password: formData.get('userPassword')?.toString(),
    };

    if (!user.email || !user.password) {
      showToast({
        ok: false,
        status: 'error',
        message: 'Identifiants invalides.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(formData);
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
        <h2>Pas encore membre ?</h2>
        <Link href="/register" className="main-button">
          Créer un compte
        </Link>
      </div>
      <div className="auth-block">
        <h2>Déjà membre ?</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="userEmail">E-mail :</label>
          <input className="auth-field" type="text" name="userEmail" placeholder="E-mail" />
          <label htmlFor="userPassword">Mot de passe :</label>
          <input
            className="auth-field"
            type="password"
            name="userPassword"
            placeholder="Password"
          />
          <Link className="public-link" href="/reset-password">
            <u>Mot de passe oublié</u> ?
          </Link>
          <button type="submit" className="main-button" aria-busy={isLoading} disabled={isLoading}>
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
};
