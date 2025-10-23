'use server';

import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export const deleteAnimal = async (animalId: number): Promise<ActionValidation> => {
  try {
    await prisma.animal.delete({ where: { id: animalId } });

    revalidatePath('/animals');

    return { ok: true, status: 'success', message: "L'animal a bien été supprimé." };
  } catch (err) {
    console.log(err);
    return { ok: false, status: 'error', message: "Une erreur s'est produite." };
  }
};
