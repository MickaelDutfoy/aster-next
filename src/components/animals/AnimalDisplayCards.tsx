'use client';

import { Link } from '@/i18n/routing';
import { AnimalWithoutDetails } from '@/lib/types';
import { displayAge } from '@/lib/utils/displayAge';
import { AnimalStatus } from '@prisma/client';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { isCommonSpecies } from './isCommonSpecies';

export const AnimalDisplayCards = ({ animals }: { animals: AnimalWithoutDetails[] }) => {
  const t = useTranslations();
  const locale = useLocale();

  useEffect(() => {
    const animalId = sessionStorage.getItem('lastViewedAnimalId');

    if (!animalId) return;

    const element = document.getElementById(`animal-${animalId}`);

    if (!element) return;

    element.scrollIntoView({
      block: 'center',
    });

    sessionStorage.removeItem('lastViewedAnimalId');
  }, []);

  return (
    <ul className="animals-cards">
      {animals.map((animal) => (
        <li className="in-app-animal-card" key={animal.id} id={`animal-${animal.id}`}>
          <Link
            href={`/animals/${animal.id}`}
            onClick={() => sessionStorage.setItem('lastViewedAnimalId', String(animal.id))}
          >
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
            <span>{t(`animals.status.${animal.status}`)}</span>
            {animal.birthDate && animal.status !== AnimalStatus.DECEASED && (
              <span className="capitalize">{displayAge(animal.birthDate as Date, locale)}</span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
};
