'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const deleteAnimal = async (animalId: number) => {
  try {
    await prisma.animal.delete({ where: { id: animalId } });
  } catch (error) {
    console.log('erreur');
  }

  revalidatePath('/animals');
};
