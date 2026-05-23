'use server';

import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { del } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

export const deleteAnimalImage = async (animalId: number): Promise<ActionValidation> => {
  const animal = await prisma.animal.findUnique({
    where: { id: animalId },
    select: { imageKey: true },
  });

  if (!animal?.imageKey) {
    return { ok: true };
  }

  try {
    await prisma.animal.update({
      where: { id: animalId },
      data: { imageKey: null },
    });

    await del(animal.imageKey);

    revalidatePath(`/animals/${animalId}`);

    return { ok: true, status: 'success', message: 'toasts.imageDeleted' };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }
};
