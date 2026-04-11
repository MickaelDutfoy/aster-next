'use server';

import { isNotOrgSuperAdmin } from '@/lib/permissions/isNotOrgSuperAdmin';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export const leaveOrg = async (orgId: number): Promise<ActionValidation> => {
  const guard = await isNotOrgSuperAdmin(orgId);
  if (!guard.validation.ok) return guard.validation;
  if (!guard.user) {
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }

  const userId = guard.user.id;

  try {
    await prisma.$transaction(async (prismaTransaction) => {
      const member = await prismaTransaction.member.findUnique({
        where: { id: userId },
        select: { selectedOrgId: true },
      });

      if (!member) {
        throw new Error('Member not found');
      }

      await prismaTransaction.familyMember.deleteMany({
        where: {
          memberId: userId,
          family: {
            is: {
              orgId,
            },
          },
        },
      });

      await prismaTransaction.memberOrganization.delete({
        where: { memberId_orgId: { memberId: userId, orgId } },
      });

      if (member.selectedOrgId === orgId) {
        const fallbackMembership = await prismaTransaction.memberOrganization.findFirst({
          where: { memberId: userId },
          select: { orgId: true },
          orderBy: { joinedAt: 'asc' },
        });

        await prismaTransaction.member.update({
          where: { id: userId },
          data: { selectedOrgId: fallbackMembership?.orgId ?? null },
        });
      }
    });

    revalidatePath('/organizations');

    return { ok: true, message: 'toasts.orgLeft' };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
      status: 'error',
      message: 'toasts.errorGeneric',
    };
  }
};