'use server';

import { isAllowedToTreasury } from '@/lib/permissions/isAllowedToTreasury';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export const deleteTransaction = async (transactionId: number): Promise<ActionValidation> => {
  const guard = await isAllowedToTreasury();
  if (!guard.validation.ok) return guard.validation;

  try {
    await prisma.transaction.delete({
      where: { id: transactionId },
    });

    revalidatePath('/transactions');

    return { ok: true, status: 'success', message: 'toasts.transactionDelete' };
  } catch (err) {
    console.log(err);
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }
};
