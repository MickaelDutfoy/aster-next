import { MemberRole } from '@prisma/client';
import { prisma } from '../prisma';
import { Member } from '../types';

export const getOrgAdmins = async (orgId: number): Promise<Member[]> => {
  const adminLinks = await prisma.memberOrganization.findMany({
    where: { orgId, role: { in: [MemberRole.ADMIN, MemberRole.SUPERADMIN] } },
    select: {
      member: {
        select: { id: true, firstName: true, lastName: true, email: true, phoneNumber: true },
      },
    },
  });

  return adminLinks.map((link) => link.member);
};
