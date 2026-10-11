'use server';

import { isOrgAdmin } from '@/lib/permissions/isOrgAdmin';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { parseTransactionData } from './parseTransactionData';

export const registerTransaction = async (
  formData: FormData,
  createCategory?: boolean,
): Promise<ActionValidation> => {
  const guard = await isOrgAdmin();
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
    if (transaction.animalId) {
      const animal = await prisma.animal.findUnique({
        where: {
          id: transaction.animalId,
          orgId,
        },
        select: {
          id: true,
        },
      });

      if (!animal) {
        return {
          ok: false,
          status: 'error',
          message: 'toasts.notAllowed',
        };
      }
    }

    let categoryId: number;

    if (createCategory) {
      const res = await prisma.transactionCategory.create({
        data: { orgId, name: category.categoryNameOrId, defaultType: category.defaultType },
      });

      categoryId = res.id;
    } else {
      const requestedCategoryId = Number(category.categoryNameOrId);

      const existingCategory = await prisma.transactionCategory.findUnique({
        where: {
          id: requestedCategoryId,
          orgId,
        },
        select: {
          id: true,
        },
      });

      if (!existingCategory) {
        return {
          ok: false,
          status: 'error',
          message: 'toasts.notAllowed',
        };
      }

      categoryId = existingCategory.id;
    }

    await prisma.transaction.create({
      data: {
        ...transaction,
        orgId,
        categoryId,
      },
    });

    revalidatePath('/transactions');

    return { ok: true, status: 'success', message: 'toasts.transactionAdd' };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }
};
