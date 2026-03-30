import { prisma } from '../prisma';
import { Transaction } from '../types';

export const getTransactionsOfOrg = async (orgId: number): Promise<Transaction[]> => {
  const categories = await prisma.transaction.findMany({
    where: { orgId },
    select: {
      id: true,
      type: true,
      amountInCents: true,
      date: true,
      counterparty: true,
      paymentMethod: true,
      note: true,
      category: true,
    },
    orderBy: { date: 'desc' },
  });

  return categories;
};
