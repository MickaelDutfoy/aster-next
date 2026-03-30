'use server';

import { prisma } from '@/lib/prisma';
import { ActionValidation, Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import { MemberRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { parseTransactionData } from './parseTransactionData';

export const updateTransaction = async (
  transactionId: number,
  formData: FormData,
  createCategory?: boolean,
): Promise<ActionValidation> => {
  const user: Member | null = await getUser();

  if (!user || !user.selectedOrgId) {
    return { ok: false, status: 'error', message: 'toasts.notAllowed' };
  }

  let orgId = user.selectedOrgId;

  const membership = await prisma.memberOrganization.findUnique({
    where: { memberId_orgId: { memberId: user.id, orgId } },
    select: { role: true },
  });

  if (membership?.role !== MemberRole.SUPERADMIN && membership?.role !== MemberRole.ADMIN) {
    return { ok: false, status: 'error', message: 'toasts.notAllowed' };
  }

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
