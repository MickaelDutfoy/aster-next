'use server';

import { revalidatePath } from 'next/cache';

export const updateAnimal = async (animalId: number, formdata: FormData) => {
  try {
    // prisma.animal.update
  } catch (error) {
    console.log('erreur');
  }

  revalidatePath('/animals');
};
