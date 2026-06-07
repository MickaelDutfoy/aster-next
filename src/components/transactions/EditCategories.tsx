'use client';

import { updateTransactionCategories } from '@/actions/transactions/updateTransactionCategories';
import { useRouter } from '@/i18n/routing';
import { TransactionCategory } from '@/lib/types';
import { TransactionType } from '@prisma/client';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { showToast } from '../tools/ToastProvider';

export const EditCategories = ({ categories }: { categories: TransactionCategory[] }) => {
  const t = useTranslations();
  const router = useRouter();

  const [editedCategories, setEditedCategories] = useState(categories);
  const [isLoading, setIsLoading] = useState(false);
  const [saveWarning, setSaveWarning] = useState(false);
  const [transactionsToDelete, setTransactionsToDelete] = useState(0);

  const updateName = (id: number, name: string) => {
    if (!saveWarning) setSaveWarning(true);

    setEditedCategories((prev) =>
      prev.map((category) => (category.id === id ? { ...category, name } : category)),
    );
  };

  const updateType = (id: number, defaultType: TransactionType) => {
    if (!saveWarning) setSaveWarning(true);

    setEditedCategories((prev) =>
      prev.map((category) => (category.id === id ? { ...category, defaultType } : category)),
    );
  };

  const deleteCategory = async (category: TransactionCategory) => {
    if (!saveWarning) setSaveWarning(true);

    setTransactionsToDelete((prev) => prev + (category.transactionsCount as number));
    setEditedCategories((prev) => prev.filter((cat) => cat.id !== category.id));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const res = await updateTransactionCategories(editedCategories);

      showToast({
        ...res,
        message: res.message ? t(res.message) : undefined,
      });

      if (res.ok) {
        router.back();
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
      <h3>{t('transactions.editCategories')}</h3>
      <form onSubmit={handleSubmit}>
        <ul className="categories-editor">
          {editedCategories.map((category) => (
            <li key={category.id}>
              <input
                type="text"
                placeholder={t('transactions.categoryNamePlaceholder')}
                defaultValue={category.name}
                onChange={(e) => updateName(category.id, e.target.value)}
              />
              <select
                defaultValue={category.defaultType}
                onChange={(e) => updateType(category.id, e.target.value as TransactionType)}
              >
                <option value={TransactionType.EXPENSE}>{t('transactions.type.EXPENSE')}</option>
                <option value={TransactionType.INCOME}>{t('transactions.type.INCOME')}</option>
              </select>
              <button
                type="button"
                className="action link"
                onClick={() => deleteCategory(category)}
              >
                <Trash2 size={26} />
              </button>
            </li>
          ))}
        </ul>

        {saveWarning && <p className="save-warning">{t('common.saveWarning')}</p>}
        {transactionsToDelete > 0 && (
          <p className="save-warning">
            {t('transactions.deleteCategoryWarning', { count: transactionsToDelete })}
          </p>
        )}
        <div className="yes-no">
          <button
            type="submit"
            className="little-button"
            aria-busy={isLoading || editedCategories.some((category) => !category.name)}
            disabled={isLoading || editedCategories.some((category) => !category.name)}
          >
            {isLoading ? t('common.loading') : t('common.submit')}
          </button>
          <button
            type="button"
            className="little-button"
            onClick={() => router.back()}
            aria-busy={isLoading}
            disabled={isLoading}
          >
            {t('common.cancel')}
          </button>
        </div>
      </form>
    </div>
  );
};
