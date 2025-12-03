import { prisma } from '../prisma';
import { Family } from '../types';

export const getFamiliesByOrg = async (id: number): Promise<Family[] | null> => {
  const families: Family[] | null = await prisma.family.findMany({
    where: { orgId: id },
  });

  return families;
};
