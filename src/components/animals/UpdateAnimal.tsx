'use client';

import { updateAnimal } from '@/actions/animals/updateAnimal';
import { Animal } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { showToast } from '../providers/ToastProvider';
import { AnimalForm } from './AnimalForm';

export const UpdateAnimal = ({ animal }: { animal: Animal }) => {
  const [res, handleUpdateAnimal, isLoading] = useActionState(
    updateAnimal.bind(null, animal.id),
    null,
  );

  const router = useRouter();

  useEffect(() => {
    if (!res) return;
    showToast(res);
    if (res.ok) router.replace(`/animals/${animal.id}`);
  }, [res]);

  return (
    <>
      <div className="register-form">
        <h3>Éditer les informations</h3>
        <AnimalForm animal={animal} action={handleUpdateAnimal} isLoading={isLoading} />
      </div>
    </>
  );
};
