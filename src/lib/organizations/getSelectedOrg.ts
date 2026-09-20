import { prisma } from '../prisma';
import { Member, Organization } from '../types';

export const getSelectedOrg = async (user: Member): Promise<Organization | null> => {
  if (!user.selectedOrgId) return null;

  const membership = await prisma.memberOrganization.findUnique({
    where: {
      memberId_orgId: {
        memberId: user.id,
        orgId: user.selectedOrgId,
      },
    },
    select: {
      role: true,
      status: true,
      organization: true,
    },
  });

  if (!membership) return null;

  return {
    ...membership.organization,
    userRole: membership.role,
    userStatus: membership.status,
  };
};
