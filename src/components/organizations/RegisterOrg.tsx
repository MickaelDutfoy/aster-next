'use client';

import { registerOrg } from '@/actions/organizations/registerOrg';
import { useState } from 'react';
import { showToast } from '../providers/ToastProvider';

export const RegisterOrg = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const orgName = formData.get('orgName')?.toString().trim();

    if (!orgName) {
      showToast({
        ok: false,
        status: 'error',
        message: "Vous devez saisir un nom d'association.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await registerOrg(formData);
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
    <>
      <h3>Enregistrer une nouvelle association ?</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" name="orgName" placeholder="Nom de l'association" />
        <button type="submit" className="little-button" aria-busy={isLoading} disabled={isLoading}>
          {isLoading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>
    </>
  );
};
