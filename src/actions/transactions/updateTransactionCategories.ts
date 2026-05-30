'use server';

import { prisma } from '@/lib/prisma';
import { ActionValidation, Member, TransactionCategory } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import { MemberRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const updateTransactionCategories = async (
  categories: TransactionCategory[],
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
