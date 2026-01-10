'use server';

import { MemberRole } from '@prisma/client';
import { prisma } from '../prisma';
import { Organization } from '../types';

export const getMatchingOrgs = async (input: string): Promise<Organization[]> => {
  const orgs = await prisma.organization.findMany({
    where: { name: { contains: input, mode: 'insensitive' } },
    select: {
      id: true,
      name: true,
      memberOrganizations: {
        where: { role: MemberRole.SUPERADMIN },
        select: {
          member: { select: { firstName: true, lastName: true } },
        },
      },
    },
    take: 10,
    orderBy: { name: 'asc' },
  });

  const orgsWithAdmin: Organization[] = orgs.map((org) => {
    const admin: string = org.memberOrganizations[0]
      ? org.memberOrganizations[0].member.firstName +
        ' ' +
        org.memberOrganizations[0].member.lastName
      : '';
    return {
      id: org.id,
      name: org.name,
      superAdminName: admin,
    };
  });

  return orgsWithAdmin;
};
