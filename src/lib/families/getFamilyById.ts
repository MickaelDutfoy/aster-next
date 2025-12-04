import { prisma } from '../prisma';
import { Family } from '../types';

export const getFamilyById = async (id: number): Promise<Family | null> => {
  const family: Family | null = await prisma.family.findUnique({
    where: { id: id },
  });

  return family;
};
