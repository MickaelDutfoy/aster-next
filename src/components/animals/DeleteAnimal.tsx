'use client';

import { deleteAnimal } from '@/actions/animals/deleteAnimal';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { showToast } from '../providers/ToastProvider';

export const DeleteAnimal = ({ id }: { id: string }) => {
  const animalId = Number(id);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await deleteAnimal(animalId);
      showToast(res);
      if (res.ok) router.replace('/animals');
    } catch (err) {
      console.error(err);
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
      <h3 style={{ paddingBottom: 10 }}>Supprimer l'animal</h3>
      <p>Êtes-vous sûr(e) ?</p>
      <div className="yes-no">
        <button
          onClick={handleSubmit}
          className="little-button"
          aria-busy={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Suppression...' : 'Confirmer'}
        </button>
        <button className="little-button" onClick={() => router.back()}>
          Annuler
        </button>
      </div>
    </>
  );
};
