import { Language } from '../types';

export const formatCurrency = (amount: number, lang: Language, displayCurrency: string) => {
  return new Intl.NumberFormat(lang, {
    style: 'currency',
    currency: displayCurrency,
  }).format(amount);
};
