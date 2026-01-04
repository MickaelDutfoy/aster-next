import { MemberRole } from '@prisma/client';
import { prisma } from '../prisma';
import { ActionValidation, Member } from '../types';
import { getUser } from '../user/getUser';

export const isNotOrgAdmin = async (
  orgId: number,
): Promise<{ validation: ActionValidation; user: Member | null }> => {
  const user: Member | null = await getUser();
  if (!user) {
    return {
      validation: { ok: false, status: 'error', message: 'toasts.noUser' },
      user: null,
    };
  }

  const membership = await prisma.memberOrganization.findUnique({
    where: { memberId_orgId: { memberId: user.id, orgId } },
    select: { role: true },
  });

  if (membership?.role === MemberRole.SUPERADMIN) {
    return {
      validation: { ok: false, status: 'error', message: 'toasts.notAllowed' },
      user: null,
    };
  }

  return { validation: { ok: true }, user };
};
