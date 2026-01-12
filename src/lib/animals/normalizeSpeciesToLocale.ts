// speciesMapper.ts
export const SPECIES_MAP: Record<string, string[]> = {
  cat: ['Chat', 'Cat', 'Katt'],
  dog: ['Chien', 'Dog', 'Hund'],
  ferret: ['Furet', 'Ferret', 'Ilder'],
  rabbit: ['Lapin', 'Rabbit', 'Kanin'],
};

export function normalizeSpeciesToLocale(
  species: string,
  localeSpeciesList: string[],
): string | 'other' {
  for (const variants of Object.values(SPECIES_MAP)) {
    if (variants.includes(species)) {
      const target = variants.find((variant) => localeSpeciesList.includes(variant));
      if (target) return target;
    }
  }
  return 'other';
}
