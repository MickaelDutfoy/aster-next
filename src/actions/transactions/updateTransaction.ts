'use server';

import { isAllowedToTreasury } from '@/lib/permissions/isAllowedToTreasury';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { parseTransactionData } from './parseTransactionData';

export const updateTransaction = async (
  transactionId: number,
  formData: FormData,
  createCategory?: boolean,
): Promise<ActionValidation> => {
  const guard = await isAllowedToTreasury();
  if (!guard.validation.ok) return guard.validation;
  if (!guard.orgId) {
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }

  const orgId = guard.orgId;

  const { category, transaction } = parseTransactionData(formData);

  if (!category || !transaction) {
    return {
      ok: false,
      status: 'error',
      message: 'toasts.requiredFieldsMissing',
    };
  }

  try {
    let categoryId: number;

    if (createCategory) {
      const res = await prisma.transactionCategory.create({
        data: { orgId, name: category.categoryNameOrId, defaultType: category.defaultType },
      });

      categoryId = res.id;
    } else {
      categoryId = Number(category.categoryNameOrId);
    }

    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        ...transaction,
        orgId,
        categoryId,
      },
    });

    revalidatePath('/transactions');

    return { ok: true, status: 'success', message: 'toasts.modifySuccess' };
  } catch (err) {
    console.log(err);
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }
};
