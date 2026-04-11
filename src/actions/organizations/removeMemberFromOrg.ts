'use server';

import { isOrgAdmin } from '@/lib/permissions/isOrgAdmin';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export const removeMemberFromOrg = async (memberId: number, orgId: number): Promise<ActionValidation> => {
  const guard = await isOrgAdmin(orgId);
  if (!guard.validation.ok) return guard.validation;

  try {
    await prisma.$transaction(async (prismaTransaction) => {
      const member = await prismaTransaction.member.findUnique({
        where: { id: memberId },
        select: { selectedOrgId: true },
      });

      if (!member) {
        throw new Error('Member not found');
      }

      await prismaTransaction.familyMember.deleteMany({
        where: {
          memberId,
          family: {
            is: {
              orgId,
            },
          },
        },
      });

      await prismaTransaction.memberOrganization.delete({
        where: { memberId_orgId: { memberId, orgId } },
      });

      if (member.selectedOrgId === orgId) {
        const fallbackMembership = await prismaTransaction.memberOrganization.findFirst({
          where: { memberId },
          select: { orgId: true },
          orderBy: { joinedAt: 'asc' },
        });

        await prismaTransaction.member.update({
          where: { id: memberId },
          data: {
            selectedOrgId: fallbackMembership?.orgId ?? null,
          },
        });
      }
    });

    revalidatePath(`/organizations/${orgId}`);

    return { ok: true, status: 'success', message: 'toasts.orgMemberRemoved' };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
      status: 'error',
      message: 'toasts.errorGeneric',
    };
  }
};