import { prisma } from '../prisma';
import { TransactionCategory } from '../types';

export const getTransactionCategoriesOfOrg = async (
  orgId: number,
): Promise<TransactionCategory[]> => {
  const categories = await prisma.transactionCategory.findMany({
    where: { orgId },
    select: { id: true, name: true, defaultType: true },
  });

  return categories;
};
