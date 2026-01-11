import { prisma } from '../prisma';
import { Member, Organization } from '../types';

export const getSelectedOrg = async (user: Member): Promise<Organization | null> => {
  if (!user.selectedOrgId) return null;

  const org: Organization | null = await prisma.organization.findUnique({
    where: { id: user.selectedOrgId },
  });

  if (!org) return null;

  const memberId = user.id;
  const orgId = org.id;

  const memberOrg = await prisma.memberOrganization.findUnique({
    where: { memberId_orgId: { memberId, orgId } },
    select: {
      status: true,
      role: true,
    },
  });

  org.userRole = memberOrg?.role;
  org.userStatus = memberOrg?.status;

  return org;
};
