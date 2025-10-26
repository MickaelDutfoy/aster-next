'use client';

import { deleteAnimal } from '@/actions/animals/deleteAnimal';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { showToast } from '../providers/ToastProvider';

export const DeleteAnimal = ({ id }: { id: string }) => {
  const animalId = Number(id);

  const [res, handleDeleteAnimal, isLoading] = useActionState(
    deleteAnimal.bind(null, animalId),
    null,
  );

  const router = useRouter();

  useEffect(() => {
    if (!res) return;
    showToast(res);
    if (res.ok) {
      router.replace(`/animals`);
      router.refresh();
    }
  }, [res]);

  return (
    <>
      <h3 style={{ paddingBottom: 10 }}>Supprimer l'animal</h3>
      <p>Êtes-vous sûr(e) ?</p>
      <div className="yes-no">
        <form action={handleDeleteAnimal}>
          <button className="little-button" aria-busy={isLoading} disabled={isLoading}>
            {isLoading ? 'Suppression...' : 'Confirmer'}
          </button>
        </form>
        <button className="little-button" onClick={() => router.back()}>
          Annuler
        </button>
      </div>
    </>
  );
};
