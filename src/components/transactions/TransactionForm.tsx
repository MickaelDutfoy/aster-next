'use client';

import { registerTransaction } from '@/actions/transactions/registerTransaction';
import { updateTransaction } from '@/actions/transactions/updateTransaction';
import { useRouter } from '@/i18n/routing';
import { Transaction, TransactionCategory } from '@/lib/types';
import { PaymentMethod, TransactionType } from '@prisma/client';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { showToast } from '../tools/ToastProvider';

export const TransactionForm = ({
  categories,
  transaction,
}: {
  categories: TransactionCategory[];
  transaction?: Transaction;
}) => {
  const t = useTranslations();
  const router = useRouter();

  const [category, setCategory] = useState<string>(
    transaction?.category.id.toString() ?? categories[0]?.id.toString() ?? '',
  );
  const [type, setType] = useState<string>(transaction?.type ?? TransactionType.EXPENSE);
  const [defaultType, setDefaultType] = useState<string>(
    transaction?.category.defaultType ?? TransactionType.EXPENSE,
  );
  const [isLoading, setIsLoading] = useState(false);

  const changeTypeFromCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = Number(e.target.value);

    const selectedCategory = categories.find((category) => category.id === categoryId);

    if (selectedCategory) {
      setType(selectedCategory.defaultType);
      setDefaultType(selectedCategory.defaultType);
    }

    setCategory(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const existingCategory = formData.get('existingCategory')?.toString();
    const newCategory = formData.get('newCategory')?.toString().trim();
    const category = !existingCategory ? newCategory : existingCategory;

    const amount = Number(formData.get('amount'));
    const date = formData.get('date')?.toString();

    if (!category || !amount || !date) {
      showToast({
        ok: false,
        status: 'error',
        message: t('toasts.requiredFieldsMissing'),
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = !transaction
        ? newCategory
          ? await registerTransaction(formData, true)
          : await registerTransaction(formData)
        : newCategory
          ? await updateTransaction(transaction.id, formData, true)
          : await updateTransaction(transaction.id, formData);

      showToast({
        ...res,
        message: res.message ? t(res.message) : undefined,
      });

      if (res.ok) {
        router.replace('/transactions');
      }
    } catch (err) {
      console.error(err);
      showToast({
        ok: false,
        status: 'error',
        message: t('toasts.errorGeneric'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="transaction-form">
      <h3>{transaction ? t('transactions.editTitle') : t('transactions.addTitle')}</h3>
      <p className="notice">{t('common.requiredFieldsNotice')}</p>
      <form className="new-transaction" onSubmit={handleSubmit}>
        <div className="category">
          <h4>{t('transactions.categoryTitle')}</h4>
          <div className="select-and-field">
            <select
              name="existingCategory"
              value={category}
              onChange={(e) => changeTypeFromCategory(e)}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
              <option value="">{t('transactions.other')}</option>
            </select>
            <input
              type="text"
              name="newCategory"
              disabled={!!category}
              className={clsx(!!category && 'disabled')}
              placeholder={t('transactions.newCategoryPlaceholder') + (!category ? ' *' : '')}
            />
          </div>
          <div className={'labeled-select' + clsx(!!category && ' disabled')}>
            <p>{t('transactions.defaultCategoryType')}</p>
            <select
              name="defaultType"
              value={defaultType}
              onChange={(e) => {
                setDefaultType(e.target.value);
                setType(e.target.value);
              }}
            >
              <option value={TransactionType.EXPENSE}>{t('transactions.type.EXPENSE')}</option>
              <option value={TransactionType.INCOME}>{t('transactions.type.INCOME')}</option>
            </select>
          </div>
        </div>
        <div className="details">
          <h4>{t('transactions.inputDetails')}</h4>
          <div className="select-and-field">
            <select name="type" value={type} onChange={(e) => setType(e.target.value)}>
              <option value={TransactionType.EXPENSE}>{t('transactions.type.EXPENSE')}</option>
              <option value={TransactionType.INCOME}>{t('transactions.type.INCOME')}</option>
            </select>
            <input
              type="text"
              name="amount"
              placeholder={t('transactions.amountPlaceholder')}
              defaultValue={transaction?.amountInCents ? transaction.amountInCents / 100 : ''}
            />
          </div>
          <p className="notice" style={{ margin: '-10px 0' }}>
            {t('transactions.amountNotice')}
          </p>
          <div className="labeled-date">
            <p>{t('transactions.dateLabel')}</p>
            <input
              type="date"
              name="date"
              defaultValue={transaction?.date.toISOString().slice(0, 10)}
            />
          </div>
          <div className="labeled-text">
            <p>{t('transactions.counterpartyLabel')}</p>
            <input
              type="text"
              name="counterparty"
              placeholder={
                type === TransactionType.INCOME
                  ? t('transactions.senderPlaceholder')
                  : t('transactions.beneficiaryPlaceholder')
              }
              defaultValue={transaction?.counterparty ?? ''}
            />
          </div>
          <div className="labeled-select">
            <p>{t('transactions.methodLabel')}</p>
            <select name="paymentMethod" defaultValue={transaction?.paymentMethod}>
              <option value={PaymentMethod.BANK_TRANSFER}>
                {t('transactions.paymentMethod.BANK_TRANSFER')}
              </option>
              <option value={PaymentMethod.CARD}>{t('transactions.paymentMethod.CARD')}</option>
              <option value={PaymentMethod.CASH}>{t('transactions.paymentMethod.CASH')}</option>
              <option value={PaymentMethod.CHECK}>{t('transactions.paymentMethod.CHECK')}</option>
              <option value={PaymentMethod.OTHER}>{t('transactions.paymentMethod.OTHER')}</option>
            </select>
          </div>
          <p>{t('transactions.additionalInfoLabel')}</p>
          <textarea
            name="note"
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = 'auto';
              el.style.height = `${el.scrollHeight}px`;
            }}
            defaultValue={transaction?.note ?? ''}
          />
        </div>
        <button type="submit" className="little-button" aria-busy={isLoading} disabled={isLoading}>
          {isLoading ? t('common.loading') : t('common.submit')}
        </button>
      </form>
    </div>
  );
};
