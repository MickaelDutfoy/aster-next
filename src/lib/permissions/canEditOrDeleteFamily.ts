import { MemberStatus } from '@prisma/client';
import { prisma } from '../prisma';
import { ActionValidation, Member } from '../types';
import { getUser } from '../user/getUser';

export const canEditOrDeleteFamily = async (
  familyId: number,
): Promise<{ validation: ActionValidation; memberId: number | undefined }> => {
  const user: Member | null = await getUser();
  if (!user) {
    return {
      validation: { ok: false, status: 'error', message: 'toasts.noUser' },
      memberId: undefined,
    };
  }

  const familyPrev = await prisma.family.findUnique({
    where: { id: familyId },
    select: { orgId: true },
  });

  if (!familyPrev) {
    return {
      validation: { ok: false, status: 'error', message: 'toasts.genericError' },
      memberId: undefined,
    };
  }

  const membership = await prisma.memberOrganization.findUnique({
    where: { memberId_orgId: { memberId: user.id, orgId: familyPrev.orgId } },
    select: { status: true },
  });

  if (membership?.status !== MemberStatus.VALIDATED) {
    return {
      validation: { ok: false, status: 'error', message: 'toasts.notAllowed' },
      memberId: undefined,
    };
  }

  return { validation: { ok: true }, memberId: user.id };
};
