import { COMMON_SPECIES } from '@/lib/types';

export const isCommonSpecies = (species: string | undefined): boolean => {
  if (!species) return false;
  return COMMON_SPECIES.includes(species);
};
