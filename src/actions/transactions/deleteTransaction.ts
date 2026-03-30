'use server';

import { prisma } from '@/lib/prisma';
import { ActionValidation, Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import { MemberRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const deleteTransaction = async (transactionId: number): Promise<ActionValidation> => {
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
