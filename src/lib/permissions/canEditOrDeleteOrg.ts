import { MemberRole } from '@prisma/client';
import { prisma } from '../prisma';
import { ActionValidation, Member } from '../types';
import { getUser } from '../user/getUser';

export const canEditOrDeleteOrg = async (orgId: number): Promise<ActionValidation> => {
  const user: Member | null = await getUser();
  if (!user) {
    return {
      ok: false,
      status: 'error',
      message: 'toasts.noUser',
    };
  }

  const membership = await prisma.memberOrganization.findUnique({
    where: { memberId_orgId: { memberId: user.id, orgId } },
    select: { role: true },
  });

  if (membership?.role !== MemberRole.SUPERADMIN) {
    return {
      ok: false,
      status: 'error',
      message: 'toasts.notAllowed',
    };
  }

  return { ok: true };
};
