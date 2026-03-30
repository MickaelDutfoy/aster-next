'use client';

import { useRouter } from '@/i18n/routing';
import { Transaction, TransactionCategory } from '@/lib/types';
import { displayDate } from '@/lib/utils/displayDate';
import { TransactionType } from '@prisma/client';
import { SquarePen, Trash2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

export const TransactionsList = ({
  transactions,
  categories,
  displayCurrency,
}: {
  transactions: Transaction[];
  categories: TransactionCategory[];
  displayCurrency: string;
}) => {
  const t = useTranslations();
  const lang = useLocale();
  const router = useRouter();

  const localeMap: Record<string, string> = {
    fr: 'fr-FR',
    en: 'en-UK',
    nb: 'nb-NO',
  };

  const years = Array.from(
    new Set(transactions.map((transaction) => new Date(transaction.date).getFullYear())),
  ).sort((a, b) => b - a);

  const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name));

  const [openedTransaction, setOpenedTransaction] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory | null>(null);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesYear = !selectedYear || new Date(transaction.date).getFullYear() === selectedYear;
    const matchesCategory = !selectedCategory || transaction.category.id === selectedCategory.id;

    return matchesYear && matchesCategory;
  });

  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const totalIncome =
    filteredTransactions
      .filter((transaction) => transaction.type === TransactionType.INCOME)
      .reduce((acc, transaction) => acc + transaction.amountInCents, 0) / 100;

  const totalExpense =
    filteredTransactions
      .filter((transaction) => transaction.type === TransactionType.EXPENSE)
      .reduce((acc, transaction) => acc + transaction.amountInCents, 0) / 100;

  console.log(totalExpense);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(lang, {
      style: 'currency',
      currency: displayCurrency,
    }).format(amount);
  };

  const getMonthLabel = (date: Date) =>
    new Intl.DateTimeFormat(localeMap[lang], {
      month: 'long',
      year: selectedYear ? undefined : 'numeric',
    }).format(date);

  const groupedTransactions = sortedTransactions.reduce<
    { key: string; label: string; transactions: Transaction[] }[]
  >((groups, transaction) => {
    const date = new Date(transaction.date);
    const year = date.getFullYear();
    const month = date.getMonth();

    const key = selectedYear ? `${month}` : `${year}-${month}`;
    const label = getMonthLabel(date).charAt(0).toUpperCase() + getMonthLabel(date).slice(1);

    const existingGroup = groups.find((group) => group.key === key);

    if (existingGroup) {
      existingGroup.transactions.push(transaction);
    } else {
      groups.push({
        key,
        label,
        transactions: [transaction],
      });
    }

    return groups;
  }, []);

  const openOrCollapseTransaction = (transactionId: number) => {
    if (transactionId === openedTransaction) {
      setOpenedTransaction(null);
    } else {
      setOpenedTransaction(transactionId);
    }
  };

  const changeActiveYear = (year: number) => {
    setOpenedTransaction(null);
    setSelectedYear((prev) => (prev === year ? null : year));
  };

  const changeActiveCategory = (category: TransactionCategory) => {
    setOpenedTransaction(null);
    setSelectedCategory((prev) => (prev?.id === category.id ? null : category));
  };

  return (
    <>
      {(years.length > 0 || sortedCategories.length > 0) && (
        <div className="filters">
          {years.length > 0 && (
            <div className="filter-select">
              <h4>{t('transactions.yearLabel')}</h4>
              <div className="filter-buttons">
                {years.map((year) => (
                  <button
                    key={year}
                    className="filter-button"
                    style={year !== selectedYear ? { opacity: 0.5 } : { opacity: 1 }}
                    onClick={() => changeActiveYear(year)}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          )}

          {sortedCategories.length > 0 && (
            <div className="filter-select">
              <h4>{t('transactions.categoryLabel')}</h4>
              <div className="filter-buttons">
                {sortedCategories.map((category) => (
                  <button
                    key={category.id}
                    className="filter-button"
                    style={category !== selectedCategory ? { opacity: 0.5 } : { opacity: 1 }}
                    onClick={() => changeActiveCategory(category)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {filteredTransactions.length > 0 && (
        <div className="balance">
          <h4>{t('transactions.balanceTitle')}</h4>
          <div>
            {totalIncome > 0 && (
              <p>
                {t('transactions.incomesLabel')} <strong>{formatCurrency(totalIncome)}</strong>
              </p>
            )}
            {totalExpense > 0 && (
              <p>
                {t('transactions.expensesLabel')} <strong>−{formatCurrency(totalExpense)}</strong>
              </p>
            )}
          </div>
        </div>
      )}

      {filteredTransactions.length === 0 && (
        <p style={{ margin: '0 10px' }}>{t('transactions.noTransactions')}</p>
      )}

      {groupedTransactions.map((group) => (
        <div key={group.key}>
          <h4 className="month-separator">{group.label}</h4>
          <ul className="clickable-list">
            {group.transactions.map((transaction) => (
              <li key={transaction.id}>
                <div
                  className="transaction link"
                  onClick={() => openOrCollapseTransaction(transaction.id)}
                >
                  <p>{displayDate(transaction.date).slice(0, 5)}</p>
                  <p className="transaction-category">{transaction.category.name}</p>
                  <span>
                    {transaction.type === TransactionType.EXPENSE && '−'}
                    {formatCurrency(transaction.amountInCents / 100)}
                  </span>
                  <span>{openedTransaction === transaction.id ? '▾' : '▸'}</span>
                </div>

                {openedTransaction === transaction.id && (
                  <div className="transaction-details">
                    <div className="method-and-actions">
                      <div className="actions link">
                        <button
                          onClick={() => {
                            router.push(`/transactions/edit/${transaction.id}`);
                          }}
                        >
                          <SquarePen size={26} />
                        </button>
                        <button
                          onClick={() => {
                            router.push(`/transactions/delete/${transaction.id}`);
                          }}
                        >
                          <Trash2 style={{ transform: 'translateY(-1px)' }} size={26} />
                        </button>
                      </div>
                      <p>
                        {t('transactions.methodLabelNotNeeded')}{' '}
                        {t(`transactions.paymentMethod.${transaction.paymentMethod}`)}
                      </p>
                    </div>
                    {transaction.counterparty && (
                      <p>
                        {t('transactions.counterpartyLabel')} {transaction.counterparty}
                      </p>
                    )}
                    {transaction.note && (
                      <p>
                        {t('transactions.additionalInfoLabel')} {transaction.note}
                      </p>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
};
