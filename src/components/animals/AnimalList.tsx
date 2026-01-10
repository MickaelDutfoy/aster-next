'use client';

import { Link } from '@/i18n/routing';
import { AnimalWithoutDetails, Organization } from '@/lib/types';
import { getAge } from '@/lib/utils/getAge';
import { AnimalStatus } from '@prisma/client';
import { SquareArrowRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

export const AnimalsList = ({
  org,
  animals,
}: {
  org: Organization;
  animals: AnimalWithoutDetails[];
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const [hiddenAdopted, setHiddenAdopted] = useState<boolean>(true);

  const activeAnimals = animals.filter((animal) => animal.status !== AnimalStatus.ADOPTED).length;
  const adoptedAnimals = animals.filter((animal) => animal.status === AnimalStatus.ADOPTED).length;

  return (
    <>
      {animals && (
        <div>
          <h3>{t('animals.listTitle', { orgName: org.name, count: activeAnimals })}</h3>

          {animals.length === 0 && <p style={{ padding: '10px' }}>{t('animals.none')}</p>}

          {animals.length > 0 && (
            <ul className="animals-list">
              {animals
                .filter((animal) => animal.status !== AnimalStatus.ADOPTED)
                .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
                .map((animal) => (
                  <li key={animal.id}>
                    <span>
                      <strong>{animal.name}</strong>
                    </span>{' '}
                    <span>
                      {animal.species}{' '}
                      <span
                        style={{
                          color: animal.sex === 'M' ? '#8AB6F5' : '#F5A6A6',
                          textShadow: '1px 1px 0px #777',
                        }}
                      >
                        {animal.sex === 'M' ? '♂' : '♀'}
                      </span>
                    </span>
                    <span>{getAge(animal.birthDate, locale)}</span>
                    <Link className="action link" href={`/animals/${animal.id}`}>
                      <SquareArrowRight size={26} />
                    </Link>
                  </li>
                ))}
            </ul>
          )}

          <button className="collapse-expand" onClick={() => setHiddenAdopted(!hiddenAdopted)}>
            {t('animals.toggleAdopted', { count: adoptedAnimals })} {hiddenAdopted ? '▸' : '▾'}
          </button>

          {!hiddenAdopted && (
            <ul className="animals-list">
              {animals
                .filter((animal) => animal.status === AnimalStatus.ADOPTED)
                .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
                .map((animal) => (
                  <li key={animal.id}>
                    <span>
                      <strong>{animal.name}</strong>
                    </span>{' '}
                    <span>
                      {animal.species}{' '}
                      <span
                        style={{
                          color: animal.sex === 'M' ? '#8AB6F5' : '#F5A6A6',
                          textShadow: '1px 1px 0px #777',
                        }}
                      >
                        {animal.sex === 'M' ? '♂' : '♀'}
                      </span>
                    </span>
                    <span>{getAge(animal.birthDate, locale)}</span>
                    <Link className="action link" href={`/animals/${animal.id}`}>
                      <SquareArrowRight size={26} />
                    </Link>
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
};
