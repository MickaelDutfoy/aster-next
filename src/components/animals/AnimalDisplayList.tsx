'use client';

import { Link } from '@/i18n/routing';
import { normalizeSpeciesToLocale } from '@/lib/animals/normalizeSpeciesToLocale';
import { AnimalWithoutDetails } from '@/lib/types';
import { displayAge } from '@/lib/utils/displayAge';
import { AnimalStatus } from '@prisma/client';
import { SquareArrowRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

export const AnimalDisplayList = ({
  animals,
  statusFilter,
  nameFilter,
}: {
  animals: AnimalWithoutDetails[];
  statusFilter?: AnimalStatus[];
  nameFilter?: string;
}) => {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <ul className="animals-list">
      {animals
        .filter(
          (animal) => !nameFilter || animal.name.toLowerCase().includes(nameFilter.toLowerCase()),
        )
        .filter((animal) => !statusFilter || statusFilter.includes(animal.status))
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
        .map((animal) => (
          <li key={animal.id}>
            <span>
              <strong>{animal.name}</strong>
            </span>{' '}
            <span>
              {normalizeSpeciesToLocale(animal.species, t.raw('animals.commonSpecies'))}{' '}
              <span
                style={{
                  color: animal.sex === 'M' ? '#8AB6F5' : '#F5A6A6',
                  textShadow: '1px 1px 0px #777',
                }}
              >
                {(animal.sex === 'M' && ' ♂') || (animal.sex === 'F' && ' ♀')}
              </span>
            </span>
            <span
              style={
                !animal.birthDate || animal.status === AnimalStatus.DECEASED ? { opacity: 0 } : {}
              }
            >
              {displayAge(animal.birthDate as Date, locale)}
            </span>
            <Link className="action link" href={`/animals/${animal.id}`}>
              <SquareArrowRight size={26} />
            </Link>
          </li>
        ))}
    </ul>
  );
};
