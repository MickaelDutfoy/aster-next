import { prisma } from '../prisma';
import { Animal } from '../types';

export const getAnimalsByFamily = async (id: number): Promise<Animal[]> => {
  const animals: Animal[] = await prisma.animal.findMany({
    where: { familyId: id },
    include: { adoption: true },
  });

  return animals;
};
