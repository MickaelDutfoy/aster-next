'use client';

import { Link } from '@/i18n/routing';
import { AnimalWithoutDetails } from '@/lib/types';
import { displayAge } from '@/lib/utils/displayAge';
import { AnimalStatus } from '@prisma/client';
import { SquareArrowRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { isCommonSpecies } from './isCommonSpecies';

export const AnimalDisplayList = ({ animals }: { animals: AnimalWithoutDetails[] }) => {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <ul className="animals-list">
      {animals.map((animal) => (
        <li key={animal.id}>
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
