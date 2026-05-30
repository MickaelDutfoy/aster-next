import { prisma } from '../prisma';

export const countTransactionsByCategory = async (categoryId: number): Promise<number> => {
  const count = await prisma.transaction.count({
    where: { categoryId },
  });

  return count;
};
