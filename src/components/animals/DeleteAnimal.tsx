'use client';

import { deleteAnimal } from '@/actions/animals/deleteAnimal';
import { useRouter } from 'next/navigation';
import { showToast } from '../providers/ToastProvider';

export const DeleteAnimal = ({ id }: { id: string }) => {
  const router = useRouter();
  const animalId = Number(id);

  const handleDeleteAnimal = async (id: number) => {
    const res = await deleteAnimal(id);
    router.push('/animals');
    router.refresh();
    showToast(res);
  };

  return (
    <>
      <h3 style={{ paddingBottom: 10 }}>Supprimer l'animal</h3>
      <p>Êtes-vous sûr(e) ?</p>
      <div className="yes-no">
        <button className="little-button" onClick={() => handleDeleteAnimal(animalId)}>
          Confirmer
        </button>
        <button className="little-button" onClick={() => router.back()}>
          Annuler
        </button>
      </div>
    </>
  );
};
