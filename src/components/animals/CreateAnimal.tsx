'use client';

import { registerAnimal } from '@/actions/animals/registerAnimal';
import { useRouter } from 'next/navigation';
import { showToast } from '../providers/ToastProvider';
import { AnimalForm } from './AnimalForm';

export const CreateAnimal = () => {
  const router = useRouter();

  const handleCreateAnimal = async (formdata: FormData) => {
    const res = await registerAnimal(formdata);
    router.push('/animals');
    showToast(res);
  };

  return (
    <div className="post-animal-form">
      <h3>Ajouter un animal</h3>
      <form action={handleCreateAnimal}>
        <AnimalForm />
      </form>
    </div>
  );
};
