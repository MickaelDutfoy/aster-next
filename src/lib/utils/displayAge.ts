export const displayAge = (birthDate: Date, lang: string, full = false): string => {
  type Language = 'fr' | 'en' | 'nb';

  const AGE_LABELS = {
    fr: {
      day: 'jour(s)',
      month: 'mois',
      year: 'an(s)',
    },
    en: {
      day: 'day(s)',
      month: 'month(s)',
      year: 'year(s)',
    },
    nb: {
      day: 'dag(er)',
      month: 'måned(er)',
      year: 'år',
    },
  };

  const birth = new Date(birthDate);
  const now = new Date();

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

  const labels = AGE_LABELS[lang as Language] ?? AGE_LABELS.fr;

  // Si tout est à zéro, on arrondit à 1 jour
  if (years === 0 && months === 0 && days === 0) {
    days = 1;
  }

  // Moins d’un an
  if (years === 0) {
    if (months === 0) {
      return `${days} ${labels.day}`;
    }

    if (!full || days === 0) {
      return `${months} ${labels.month}`;
    }

    return `${months} ${labels.month} ${days} ${labels.day}`;
  }

  // Un an ou plus
  if (!full || months === 0) {
    return `${years} ${labels.year}`;
  }

  return `${years} ${labels.year} ${months} ${labels.month}`;
};
