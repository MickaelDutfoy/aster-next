import { prisma } from '../prisma';
import { Animal } from '../types';

export const getAnimalsByFamilyId = async (id: number): Promise<Animal[] | null> => {
  const animals: Animal[] | null = await prisma.animal.findMany({
    where: { familyId: id },
    include: { adoption: true },
  });

  return animals;
};
