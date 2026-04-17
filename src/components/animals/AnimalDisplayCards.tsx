'use client';

import { useRouter } from '@/i18n/routing';
import { AnimalWithoutDetails } from '@/lib/types';
import { displayAge } from '@/lib/utils/displayAge';
import { AnimalStatus } from '@prisma/client';
import { useLocale, useTranslations } from 'next-intl';
import { isCommonSpecies } from './isCommonSpecies';

export const AnimalDisplayCards = ({
  animals,
  statusFilter,
  nameFilter,
  familyFilter,
  showAge = false,
  displayStatus = false,
}: {
  animals: AnimalWithoutDetails[];
  statusFilter?: AnimalStatus[];
  nameFilter?: string;
  familyFilter?: number;
  showAge?: boolean;
  displayStatus?: boolean;
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  return (
    <ul className="animals-cards">
      {animals
        .filter(
          (animal) => !nameFilter || animal.name.toLowerCase().includes(nameFilter.toLowerCase()),
        )
        .filter((animal) => !statusFilter || statusFilter.includes(animal.status))
        .filter((animal) => !familyFilter || animal.familyId === familyFilter)
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
        .map((animal) => (
          <li key={animal.id} onClick={() => router.push(`/animals/${animal.id}`)}>
            <span>
              <strong>{animal.name}</strong>
            </span>{' '}
            <span>
              {isCommonSpecies(animal.species)
                ? t(`animals.species.${animal.species}`)
                : animal.species}{' '}
              <span
                style={{
                  color: animal.sex === 'M' ? '#8AB6F5' : '#F5A6A6',
                  textShadow: '1px 1px 0px #777',
                }}
              >
                {(animal.sex === 'M' && ' ♂') || (animal.sex === 'F' && ' ♀')}
              </span>
            </span>
            {displayStatus && <span>{t(`animals.status.${animal.status}`)}</span>}
            {animal.birthDate && showAge && (
              <span>{displayAge(animal.birthDate as Date, locale)}</span>
            )}
          </li>
        ))}
    </ul>
  );
};
