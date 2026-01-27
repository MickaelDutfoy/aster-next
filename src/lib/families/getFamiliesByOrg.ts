import { prisma } from '../prisma';
import type { FamilyWithoutDetails } from '../types';

export const getFamiliesByOrg = async (orgId: number): Promise<FamilyWithoutDetails[]> => {
  const families = await prisma.family.findMany({
    where: { orgId },
    select: {
      id: true,
      contactFullName: true,
      city: true,
      familyMembers: {
        select: {
          member: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
      },
    },
    orderBy: { contactFullName: 'asc' },
  });

  return families.map((family) => ({
    id: family.id,
    contactFullName: family.contactFullName,
    city: family.city,
    members: family.familyMembers.map((famMem) => famMem.member),
  }));
};
