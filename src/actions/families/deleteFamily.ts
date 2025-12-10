'use server';

import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';

export const deleteFamily = async (familyId: number): Promise<ActionValidation> => {
  try {
    await prisma.family.delete({ where: { id: familyId } });

    return { ok: true, status: 'success', message: 'La famille a bien été supprimée.' };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error', message: "Une erreur s'est produite." };
  }
};
