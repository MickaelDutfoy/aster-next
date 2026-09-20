'use server';

import { isRelatedToAnimal } from '@/lib/permissions/isRelatedToAnimal';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { del, put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import sharp from 'sharp';

export const setAnimalImage = async (formData: FormData): Promise<ActionValidation> => {
  const animalId = Number(formData.get('animalId'));
  const image = formData.get('image');

  if (!animalId || !(image instanceof File) || image.size === 0 || image.size > 1.5 * 1024 * 1024) {
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }

  const guard = await isRelatedToAnimal(animalId);
  if (!guard.validation.ok) return guard.validation;

  const previousAnimal = await prisma.animal.findUnique({
    where: { id: animalId },
    select: { imageKey: true },
  });

  const blobPrefix = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';

  const pathname = `${blobPrefix}/animals/${animalId}/photo-${Date.now()}.jpg`;

  try {
    const buffer = Buffer.from(await image.arrayBuffer());

    const processor = sharp(buffer, {
      limitInputPixels: 4_000_000,
      failOn: 'warning',
    });

    const metadata = await processor.metadata();

    if (metadata.format !== 'jpeg') {
      return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
    }

    const validatedImage = await processor
      .rotate()
      .resize({
        width: 1600,
        height: 1600,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 90 })
      .toBuffer();

    const blob = await put(pathname, validatedImage, {
      access: 'private',
      contentType: 'image/jpeg',
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
