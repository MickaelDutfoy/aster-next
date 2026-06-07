'use server';
import { isRelatedToAnimal } from '@/lib/permissions/isRelatedToAnimal';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export const setAnimalPublicDescription = async (
  animalId: number,
  description: string,
): Promise<ActionValidation> => {
  const guard = await isRelatedToAnimal(animalId);
  if (!guard.validation.ok) return guard.validation;
  if (!guard.user) {
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }

  try {
    await prisma.animal.update({
      where: {
        id: animalId,
      },
      data: {
        publicDescription: description,
      },
    });

    revalidatePath('/publish');

    return { ok: true, status: 'success', message: 'toasts.animalPublicDescriptionSubmit' };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }
};
