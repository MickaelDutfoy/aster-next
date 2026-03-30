import { prisma } from '../prisma';
import { Transaction } from '../types';

export const getTransactionsById = async (transactionId: number): Promise<Transaction | null> => {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
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
  });

  return transaction;
};
