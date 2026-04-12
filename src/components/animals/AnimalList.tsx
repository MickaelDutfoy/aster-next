'use client';

import { AnimalWithoutDetails, Organization } from '@/lib/types';
import { AnimalStatus } from '@prisma/client';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { AnimalDisplayList } from './AnimalDisplayList';

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
  const [hiddenDeceased, setHiddenDeceased] = useState<boolean>(true);
  const [nameFilter, setNameFilter] = useState<string>('');

  const activeAnimals = animals
    .filter(
      (animal) => animal.status !== AnimalStatus.ADOPTED && animal.status !== AnimalStatus.DECEASED,
    )
    .filter((animal) => animal.name.toLowerCase().includes(nameFilter.toLowerCase())).length;
  const adoptedAnimals = animals
    .filter((animal) => animal.status === AnimalStatus.ADOPTED)
    .filter((animal) => animal.name.toLowerCase().includes(nameFilter.toLowerCase())).length;
  const deceasedAnimals = animals
    .filter((animal) => animal.status === AnimalStatus.DECEASED)
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
            <AnimalDisplayList
              animals={animals}
              statusFilter={[AnimalStatus.UNHOSTED, AnimalStatus.FOSTERED, AnimalStatus.IN_TRIAL]}
              nameFilter={nameFilter}
            />
          )}

          <button className="collapse-expand" onClick={() => setHiddenAdopted(!hiddenAdopted)}>
            {t('animals.toggleAdopted', { count: adoptedAnimals })} {hiddenAdopted ? '▸' : '▾'}
          </button>

          {!hiddenAdopted && (
            <AnimalDisplayList
              animals={animals}
              statusFilter={[AnimalStatus.ADOPTED]}
              nameFilter={nameFilter}
            />
          )}

          <button className="collapse-expand" onClick={() => setHiddenDeceased(!hiddenDeceased)}>
            {t('animals.toggleDeceased', { count: deceasedAnimals })} {hiddenDeceased ? '▸' : '▾'}
          </button>

          {!hiddenDeceased && (
            <AnimalDisplayList
              animals={animals}
              statusFilter={[AnimalStatus.DECEASED]}
              nameFilter={nameFilter}
            />
          )}
        </div>
      )}
    </>
  );
};
