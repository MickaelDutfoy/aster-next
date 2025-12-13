'use server';

import { prisma } from '@/lib/prisma';
import { ActionValidation, Member } from '@/lib/types';
import { getUser } from '@/lib/user/getUser';
import { MemberStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const approveOrgRequest = async (
  memberId: number,
  orgId: number,
): Promise<ActionValidation> => {
  const user: Member | null = await getUser();
  if (!user) return { ok: false };

  try {
    await prisma.memberOrganization.update({
      where: { memberId_orgId: { memberId, orgId } },
      data: { status: MemberStatus.VALIDATED },
    });

    revalidatePath('/organizations');

    return { ok: true, status: 'success', message: "Cette demande d'adhésion a été approuvée." };
  } catch (err) {
    console.error(err);
        return {
          ok: false,
          status: 'error',
          message: 'toasts.errorGeneric',
        };
  }
};
