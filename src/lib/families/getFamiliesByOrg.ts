import { prisma } from '../prisma';
import { FamilyWithoutDetails } from '../types';

export const getFamiliesByOrg = async (id: number): Promise<FamilyWithoutDetails[]> => {
  const families: FamilyWithoutDetails[] = await prisma.family.findMany({
    where: { orgId: id },
    select: {
      id: true,
      contactFullName: true,
      city: true,
      memberId: true,
    },
  });

  return families;
};
