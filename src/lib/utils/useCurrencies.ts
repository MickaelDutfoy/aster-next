import currencyCodes from 'currency-codes';

export const useCurrencies = () => {
  const allowedX = ['XOF', 'XAF', 'XPF', 'XCD'];

  const currencies = currencyCodes.data
    .filter((curr) => !curr.code.startsWith('X') || allowedX.includes(curr.code))
    .sort((a, b) => a.currency.localeCompare(b.currency))
    .map((curr) => ({
      value: curr.code,
      label: `${curr.currency} (${curr.code})`,
    }));

  return currencies;
};
