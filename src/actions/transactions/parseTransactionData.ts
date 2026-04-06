import { PaymentMethod, TransactionType } from '@prisma/client';

export const parseTransactionData = (formData: FormData) => {
  const existingCategory = formData.get('existingCategory')?.toString();
  const newCategory = formData.get('newCategory')?.toString().trim();
  const categoryNameOrId = !existingCategory ? newCategory : existingCategory;

  const defaultType = formData.get('defaultType') as TransactionType;

  const type = formData.get('type') as TransactionType;
  const amountInCents = Math.abs(
    Number(formData.get('amount')?.toString().replace(',', '.')) * 100,
  );
  const date = formData.get('date')?.toString();
  const counterparty = formData.get('counterparty')?.toString().trim();
  const paymentMethod = formData.get('paymentMethod') as PaymentMethod;
  const note = formData.get('note')?.toString().trim();

  if (!categoryNameOrId || !amountInCents || !date) {
    return {
      category: undefined,
      transaction: undefined,
    };
  }

  const category = {
    categoryNameOrId,
    defaultType,
  };

  const transaction = {
    type,
    amountInCents,
    date: new Date(date),
    counterparty,
    paymentMethod,
    note,
  };

  return { category, transaction };
};
