'use client';

import { login } from '@/actions/auth/login';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { showToast } from '../providers/ToastProvider';

export const Login = () => {
  const [res, handleLogin, isLoading] = useActionState(login, null);

  const router = useRouter();

  useEffect(() => {
    if (!res) return;
    showToast(res);
    if (res.ok) router.replace('/');
  }, [res]);

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
        <form action={handleLogin}>
          <label htmlFor="userEmail">E-mail :</label>
          <input className="auth-field" type="text" name="userEmail" placeholder="E-mail" />
          <label htmlFor="userPassword">Mot de passe :</label>
          <input
            className="auth-field"
            type="password"
            name="userPassword"
            placeholder="Password"
          />
          <button className="main-button" aria-busy={isLoading} disabled={isLoading}>
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
};
