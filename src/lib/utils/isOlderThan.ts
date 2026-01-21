export const isOlderThan = (date: Date, days: number): boolean => {
  const now = new Date();
  const threshold = new Date(now);

  threshold.setDate(threshold.getDate() - days);

  return date <= threshold;
};
