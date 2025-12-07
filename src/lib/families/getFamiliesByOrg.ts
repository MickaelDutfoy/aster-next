import { prisma } from '../prisma';
import { Family } from '../types';

export const getFamiliesByOrg = async (id: number): Promise<Family[]> => {
  const families: Family[] = await prisma.family.findMany({
    where: { orgId: id },
  });

  return families;
};
