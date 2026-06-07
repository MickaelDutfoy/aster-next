import { MemberRole } from '@prisma/client';
import { prisma } from '../prisma';
import { ActionValidation, Member } from '../types';
import { getUser } from '../user/getUser';

export const isOrgAdmin = async (): Promise<{
  validation: ActionValidation;
  orgId: number | null;
}> => {
  const user: Member | null = await getUser();

  if (!user || !user.selectedOrgId) {
    return {
      validation: { ok: false, status: 'error', message: 'toasts.notAllowed' },
      orgId: null,
    };
  }

  let orgId = user.selectedOrgId;

  const membership = await prisma.memberOrganization.findUnique({
    where: { memberId_orgId: { memberId: user.id, orgId } },
    select: { role: true },
  });

  if (membership?.role !== MemberRole.SUPERADMIN && membership?.role !== MemberRole.ADMIN) {
    return {
      validation: { ok: false, status: 'error', message: 'toasts.notAllowed' },
      orgId: null,
    };
  }

  return { validation: { ok: true }, orgId };
};
