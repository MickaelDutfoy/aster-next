'use client';

import { registerOrg } from '@/actions/organizations/registerOrg';
import { showToast } from '@/components/providers/ToastProvider';
import { useActionState, useEffect } from 'react';

export const RegisterOrg = () => {
  const [res, handleRegisterOrg, isLoading] = useActionState(registerOrg, null);

  useEffect(() => {
    if (!res) return;
    showToast(res);
  }, [res]);

  return (
    <>
      <h3>Enregistrer une nouvelle association ?</h3>
      <form action={handleRegisterOrg}>
        <input type="text" name="orgName" placeholder="Nom de l'association" />
        <button className="little-button" aria-busy={isLoading} disabled={isLoading}>
          {isLoading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>
    </>
  );
};
