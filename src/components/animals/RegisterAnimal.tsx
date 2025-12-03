'use client';

import { registerAnimal } from '@/actions/animals/registerAnimal';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { showToast } from '../providers/ToastProvider';
import { AnimalForm } from './AnimalForm';

export const RegisterAnimal = () => {
  const [res, handleRegisterAnimal, isLoading] = useActionState(registerAnimal, null);

  const router = useRouter();

  useEffect(() => {
    if (!res) return;
    showToast(res);
    if (res.ok) router.replace('/animals');
  }, [res]);

  return (
    <div className="register-form">
      <h3>Ajouter un animal</h3>
      <AnimalForm action={handleRegisterAnimal} isLoading={isLoading} />
    </div>
  );
};
