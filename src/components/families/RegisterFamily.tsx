'use client';

import { registerFamily } from '@/actions/families/registerFamily';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { showToast } from '../providers/ToastProvider';
import { FamilyForm } from './FamilyForm';

export const RegisterFamily = () => {
  const [res, handleRegisterAnimal, isLoading] = useActionState(registerFamily, null);

  const router = useRouter();

  useEffect(() => {
    if (!res) return;
    showToast(res);
    if (res.ok) router.replace('/families');
  }, [res]);

  return (
    <div className="register-form">
      <h3>Ajouter une famille</h3>
      <FamilyForm action={handleRegisterAnimal} isLoading={isLoading} />
    </div>
  );
};
