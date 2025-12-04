import { prisma } from '../prisma';
import { Family } from '../types';

export const getFamilyById = async (id: number | null): Promise<Family | null> => {
  if (!id) return null;

  const family: Family | null = await prisma.family.findUnique({
    where: { id: id },
  });

  return family;
};
