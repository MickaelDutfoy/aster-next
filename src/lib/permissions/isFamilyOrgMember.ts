import { MemberStatus } from '@prisma/client';
import { prisma } from '../prisma';
import { ActionValidation, Member } from '../types';
import { getUser } from '../user/getUser';

export const isFamilyOrgMember = async (
  familyId: number,
): Promise<{ validation: ActionValidation; user: Member | null }> => {
  const user: Member | null = await getUser();
  if (!user) {
    return {
      validation: { ok: false, status: 'error', message: 'toasts.noUser' },
      user: null,
    };
  }

  const familyPrev = await prisma.family.findUnique({
    where: { id: familyId },
    select: { orgId: true },
  });

  if (!familyPrev) {
    return {
      validation: { ok: false, status: 'error', message: 'toasts.genericError' },
      user: null,
    };
  }

  const membership = await prisma.memberOrganization.findUnique({
    where: { memberId_orgId: { memberId: user.id, orgId: familyPrev.orgId } },
    select: { status: true },
  });

  if (membership?.status !== MemberStatus.VALIDATED) {
    return {
      validation: { ok: false, status: 'error', message: 'toasts.notAllowed' },
      user: null,
    };
  }

  return { validation: { ok: true }, user };
};
