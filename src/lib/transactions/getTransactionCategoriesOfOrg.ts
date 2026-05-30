import { prisma } from '../prisma';
import { TransactionCategory } from '../types';
import { countTransactionsByCategory } from './countTransactionsByCategory';

export const getTransactionCategoriesOfOrg = async (
  orgId: number,
  count: boolean = false,
): Promise<TransactionCategory[]> => {
  const categories = await prisma.transactionCategory.findMany({
    where: { orgId },
    select: { id: true, name: true, defaultType: true },
  });

  if (!count) return categories;

  return Promise.all(
    categories.map(async (category) => ({
      ...category,
      transactionsCount: await countTransactionsByCategory(category.id),
    })),
  );
};