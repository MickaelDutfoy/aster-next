'use client';

import { registerOrg } from '@/actions/organizations/registerOrg';
import { showToast } from '@/components/providers/ToastProvider';

export const RegisterOrg = () => {
  const handleRegisterOrg = async (formdata: FormData) => {
    const res = await registerOrg(formdata);
    showToast(res);
  };

  return (
    <>
      <h3>Enregistrer une nouvelle association ?</h3>
      <form action={handleRegisterOrg}>
        <input type="text" name="orgName" placeholder="Nom de l'association" />
        <button className="little-button">Enregistrer</button>
      </form>
    </>
  );
};
