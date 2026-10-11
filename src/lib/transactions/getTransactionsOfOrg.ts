import { prisma } from '../prisma';
import { Transaction } from '../types';

export const getTransactionsOfOrg = async (orgId: number): Promise<Transaction[]> => {
  const transactions = await prisma.transaction.findMany({
    where: { orgId },
    select: {
      id: true,
      type: true,
      amountInCents: true,
      date: true,
      counterparty: true,
      paymentMethod: true,
      animalId: true,
      note: true,
      category: true,
      animal: {
        select: { id: true, name: true, species: true, sex: true, birthDate: true, status: true },
      },
    },
    orderBy: { date: 'desc' },
  });

  return transactions;
};
