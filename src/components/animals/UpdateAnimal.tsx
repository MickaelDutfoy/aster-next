'use client';

import { updateAnimal } from '@/actions/animals/updateAnimal';
import { Animal } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { showToast } from '../providers/ToastProvider';
import { AnimalForm } from './AnimalForm';

export const UpdateAnimal = ({ animal }: { animal: Animal }) => {
  const router = useRouter();

  const handleUpdateAnimal = async (formdata: FormData) => {
    const res = await updateAnimal(animal.id, formdata);
    router.push(`/animals/${animal.id}`);
    router.refresh();
    showToast(res);
  };

  return (
    <>
      <div className="post-animal-form">
        <h3>Éditer les informations</h3>
        <form action={handleUpdateAnimal}>
          <AnimalForm animal={animal} />
        </form>
      </div>
    </>
  );
};
