export const displayAge = (birthDate: Date, lang: string, full = false): string => {
  type Language = 'fr' | 'en' | 'nb';

  const AGE_LABELS = {
    fr: {
      today: "aujourd'hui",
      day: 'jour(s)',
      month: 'mois',
      year: 'an(s)',
    },
    en: {
      today: 'today',
      day: 'day(s)',
      month: 'month(s)',
      year: 'year(s)',
    },
    nb: {
      today: 'i dag',
      day: 'dag(er)',
      month: 'måned(er)',
      year: 'år',
    },
  };

  const labels = AGE_LABELS[lang as Language] ?? AGE_LABELS.fr;

  const toLocalDateOnly = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const birth = toLocalDateOnly(new Date(birthDate));
  const now = toLocalDateOnly(new Date());

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();

  if (days < 0) {
    months--;

    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years === 0 && months === 0 && days === 0) {
    return labels.today;
  }

  if (years === 0) {
    if (months === 0) {
      return `${days} ${labels.day}`;
    }

    if (!full || days === 0) {
      return `${months} ${labels.month}`;
    }

    return `${months} ${labels.month} ${days} ${labels.day}`;
  }

  if (!full || months === 0) {
    return `${years} ${labels.year}`;
  }

  return `${years} ${labels.year} ${months} ${labels.month}`;
};