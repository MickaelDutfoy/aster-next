'use server';

import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';

export const deleteFamily = async (familyId: number): Promise<ActionValidation> => {
  try {
    await prisma.family.delete({ where: { id: familyId } });

    return { ok: true, status: 'success', message: 'toasts.familyDelete' };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error', message: 'toasts.genericError' };
  }
};
