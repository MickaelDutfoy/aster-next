'use client';

import { Link } from '@/i18n/routing';
import { normalizeSpeciesToLocale } from '@/lib/animals/normalizeSpeciesToLocale';
import { AnimalWithoutDetails, Organization } from '@/lib/types';
import { displayAge } from '@/lib/utils/displayAge';
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
  const [nameFilter, setNameFilter] = useState<string>('');

  const activeAnimals = animals
    .filter((animal) => animal.status !== AnimalStatus.ADOPTED)
    .filter((animal) => animal.name.toLowerCase().includes(nameFilter.toLowerCase())).length;
  const adoptedAnimals = animals
    .filter((animal) => animal.status === AnimalStatus.ADOPTED)
    .filter((animal) => animal.name.toLowerCase().includes(nameFilter.toLowerCase())).length;

  return (
    <>
      {animals && (
        <div>
          {animals.length > 0 && (
            <div className="search-filter">
              <p>{t('common.nameFilter')}</p>
              <input
                type="text"
                placeholder={t('common.name')}
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
              />
            </div>
          )}
          <h3>{t('animals.listTitle', { orgName: org.name, count: activeAnimals })}</h3>

          {animals.length === 0 && <p style={{ padding: '10px' }}>{t('animals.none')}</p>}

          {animals.length > 0 && (
            <ul className="animals-list">
              {animals
                .filter((animal) => animal.name.toLowerCase().includes(nameFilter.toLowerCase()))
                .filter((animal) => animal.status !== AnimalStatus.ADOPTED)
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
                        {animal.sex === 'M' ? '♂' : '♀'}
                      </span>
                    </span>
                    <span>{displayAge(animal.birthDate, locale)}</span>
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
                .filter((animal) => animal.name.toLowerCase().includes(nameFilter.toLowerCase()))
                .filter((animal) => animal.status === AnimalStatus.ADOPTED)
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
                        {animal.sex === 'M' ? '♂' : '♀'}
                      </span>
                    </span>
                    <span>{displayAge(animal.birthDate, locale)}</span>
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
