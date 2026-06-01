'use server';

import { isOrgAdmin } from '@/lib/permissions/isOrgAdmin';
import { prisma } from '@/lib/prisma';
import { ActionValidation, TransactionCategory } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export const updateTransactionCategories = async (
  categories: TransactionCategory[],
): Promise<ActionValidation> => {
  const guard = await isOrgAdmin();
  if (!guard.validation.ok) return guard.validation;
  if (!guard.orgId) {
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }

  const orgId = guard.orgId;

  const existingCategories = await prisma.transactionCategory.findMany({
    where: { orgId },
    select: { id: true },
  });

  const existingIds = existingCategories.map((category) => category.id);
  const receivedIds = categories.map((category) => category.id);

  const hasInvalidId = receivedIds.some((id) => !existingIds.includes(id));

  if (hasInvalidId) {
    return { ok: false, status: 'error', message: 'toasts.notAllowed' };
  }

  const idsToDelete = existingIds.filter((id) => !receivedIds.includes(id));

  try {
    await prisma.$transaction(async (prismaTransaction) => {
      await prismaTransaction.transactionCategory.deleteMany({
        where: {
          id: { in: idsToDelete },
          orgId,
        },
      });

      await Promise.all(
        categories.map((category) =>
          prismaTransaction.transactionCategory.update({
            where: { id: category.id },
            data: {
              name: category.name,
              defaultType: category.defaultType,
            },
          }),
        ),
      );
    });

    revalidatePath('/transactions');

    return { ok: true, status: 'success', message: 'toasts.modifySuccess' };
  } catch (err) {
    console.log(err);
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }
};
