import { MemberRole } from '@prisma/client';
import { prisma } from '../prisma';
import { Member } from '../types';

export const getOrgAdmin = async (orgId: number): Promise<Member | null> => {
  const adminLink = await prisma.memberOrganization.findFirst({
    where: { orgId, role: MemberRole.SUPERADMIN },
    select: {
      member: {
        select: { id: true, firstName: true, lastName: true, email: true, phoneNumber: true },
      },
    },
  });

  if (!adminLink) return null;

  return adminLink?.member;
};
