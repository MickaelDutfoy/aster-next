import { Transaction } from '../types';

type CsvValue = string | number | null | undefined;

type TranslateFn = (key: string, values?: Record<string, string | number>) => string;

const escapeCsvValue = (value: CsvValue): string => {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = String(value);

  const mustBeQuoted =
    stringValue.includes(';') ||
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n') ||
    stringValue.includes('\r');

  if (!mustBeQuoted) {
    return stringValue;
  }

  return `"${stringValue.replaceAll('"', '""')}"`;
};

const buildCsvRow = (values: CsvValue[]): string => {
  return values.map(escapeCsvValue).join(';');
};

const formatDate = (date: Date, locale: string): string => {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

const formatAmount = (amountInCents: number): string => {
  return (amountInCents / 100).toFixed(2).replace('.', ',');
};

export const buildTransactionsCsv = (
  transactions: Transaction[],
  locale: string,
  t: TranslateFn,
): string => {
  const header = buildCsvRow([
    t('common.date'),
    t('transactions.csv.type'),
    t('transactions.csv.category'),
    t('transactions.csv.amount'),
    t('transactions.csv.paymentMethod'),
    t('transactions.csv.counterparty'),
    t('transactions.csv.note'),
  ]);

  const rows = transactions.map((transaction) =>
    buildCsvRow([
      formatDate(transaction.date, locale),
      t(`transactions.type.${transaction.type}`),
      transaction.category.name,
      formatAmount(transaction.amountInCents),
      t(`transactions.paymentMethod.${transaction.paymentMethod}`),
      transaction.counterparty,
      transaction.note,
    ]),
  );

  return [header, ...rows].join('\r\n');
};
