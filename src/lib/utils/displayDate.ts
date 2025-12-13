export const displayDate = (date: Date): string => {
  return date
    .toISOString()
    .split('T')[0]
    .split('-')
    .reduceRight((acc, cur) => `${acc}.${cur}`);
};
