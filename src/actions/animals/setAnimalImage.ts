'use server';

import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { del, put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

export const setAnimalImage = async (formData: FormData): Promise<ActionValidation> => {
  const animalId = Number(formData.get('animalId'));
  const image = formData.get('image');

  if (!animalId || !(image instanceof File)) {
    throw new Error('Invalid input');
  }

  const previousAnimal = await prisma.animal.findUnique({
    where: { id: animalId },
    select: { imageKey: true },
  });

  const blobPrefix = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';

  const pathname = `${blobPrefix}/animals/${animalId}/photo-${Date.now()}.jpg`;

  try {
    const blob = await put(pathname, image, {
      access: 'private',
    });

    await prisma.animal.update({
      where: { id: animalId },
      data: { imageKey: blob.pathname, imageUpdatedAt: new Date() },
    });

    if (previousAnimal?.imageKey) {
      await del(previousAnimal.imageKey);
    }

    revalidatePath(`/animals/${animalId}`);

    return { ok: true, status: 'success', message: 'toasts.imageUploaded' };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }
};
