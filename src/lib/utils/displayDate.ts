export const displayDate = (date: Date, locale: string): string => {
  return new Intl.DateTimeFormat(locale).format(date);
};
