'use client';

import { AnimalWithoutDetails, FamilyWithoutDetails, Organization } from '@/lib/types';
import { AnimalStatus } from '@prisma/client';
import { Grid2x2, List } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { AnimalDisplayCards } from './AnimalDisplayCards';
import { AnimalDisplayList } from './AnimalDisplayList';

export const AnimalsList = ({
  org,
  animals,
  families,
}: {
  org: Organization;
  animals: AnimalWithoutDetails[];
  families: FamilyWithoutDetails[];
}) => {
  const t = useTranslations();

  const [hiddenPlaced, setHiddenPlaced] = useState<boolean>(true);
  const [hiddenAdopted, setHiddenAdopted] = useState<boolean>(true);
  const [hiddenDeceased, setHiddenDeceased] = useState<boolean>(true);
  const [nameFilter, setNameFilter] = useState<string>('');
  const [familyFilter, setfamilyFilter] = useState<number>(0);
  const [displayMode, setDisplayMode] = useState<'list' | 'cards' | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('preferredDisplayMode');

    if (stored === 'list' || stored === 'cards') {
      setDisplayMode(stored);
    } else {
      setDisplayMode('list');
    }
  }, []);

  const handleChangeMode = (mode: 'list' | 'cards') => {
    setDisplayMode(mode);
    localStorage.setItem('preferredDisplayMode', mode);
  };

  const countAnimalsByStatus = (status: AnimalStatus) => {
    return animals
      .filter((animal) => animal.status === status)
      .filter((animal) => familyFilter === 0 || animal.familyId === familyFilter)
      .filter((animal) => animal.name.toLowerCase().includes(nameFilter.toLowerCase())).length;
  };

  if (!displayMode) return null;

  return (
    <>
      {animals && (
        <div>
          {animals.length > 0 && (
            <div className="filters">
              <div className="search-filter">
                <p>{t('common.nameFilter')}</p>
                <input
                  type="text"
                  placeholder={t('common.name')}
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                />
              </div>
              <div className="search-filter">
                <p>{t('animals.familyFilter')}</p>
                <select
                  name="familyFilter"
                  value={familyFilter}
                  onChange={(e) => setfamilyFilter(Number(e.target.value))}
                >
                  <option value={0}>{t('common.noneM')}</option>
                  {families.map((family) => (
                    <option key={family.id} value={family.id}>
                      {family.contactFullName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <h3>
            {t('animals.listTitle', {
              orgName: org.name,
              count:
                countAnimalsByStatus(AnimalStatus.UNHOSTED) +
                countAnimalsByStatus(AnimalStatus.FOSTERED) +
                countAnimalsByStatus(AnimalStatus.IN_TRIAL),
            })}
          </h3>

          <div className="display-mode">
            <div className="display-mode-buttons">
              <button
                style={displayMode === 'cards' ? { opacity: 0.5 } : {}}
                onClick={() => handleChangeMode('list')}
              >
                <List size={26} />
              </button>
              <button
                style={displayMode === 'list' ? { opacity: 0.5 } : {}}
                onClick={() => handleChangeMode('cards')}
              >
                <Grid2x2 size={26} />
              </button>
            </div>
          </div>

          {animals.length === 0 && <p style={{ padding: '10px' }}>{t('animals.none')}</p>}

          {animals.length > 0 &&
            (displayMode === 'list' ? (
              <AnimalDisplayList
                animals={animals}
                statusFilter={[AnimalStatus.UNHOSTED, AnimalStatus.FOSTERED, AnimalStatus.IN_TRIAL]}
                nameFilter={nameFilter}
                familyFilter={familyFilter}
                showAge={true}
              />
            ) : (
              <AnimalDisplayCards
                animals={animals}
                statusFilter={[AnimalStatus.UNHOSTED, AnimalStatus.FOSTERED, AnimalStatus.IN_TRIAL]}
                nameFilter={nameFilter}
                familyFilter={familyFilter}
                showAge={true}
                displayStatus={true}
              />
            ))}

          {countAnimalsByStatus(AnimalStatus.PERMANENT_PLACEMENT) > 0 && (
            <button className="collapse-expand" onClick={() => setHiddenPlaced(!hiddenPlaced)}>
              {t('animals.togglePlaced', {
                count: countAnimalsByStatus(AnimalStatus.PERMANENT_PLACEMENT),
              })}{' '}
              {hiddenPlaced ? '▸' : '▾'}
            </button>
          )}

          {!hiddenPlaced &&
            (displayMode === 'list' ? (
              <AnimalDisplayList
                animals={animals}
                statusFilter={[AnimalStatus.PERMANENT_PLACEMENT]}
                nameFilter={nameFilter}
                familyFilter={familyFilter}
              />
            ) : (
              <AnimalDisplayCards
                animals={animals}
                statusFilter={[AnimalStatus.PERMANENT_PLACEMENT]}
                nameFilter={nameFilter}
                familyFilter={familyFilter}
              />
            ))}

          {countAnimalsByStatus(AnimalStatus.ADOPTED) > 0 && (
            <button className="collapse-expand" onClick={() => setHiddenAdopted(!hiddenAdopted)}>
              {t('animals.toggleAdopted', { count: countAnimalsByStatus(AnimalStatus.ADOPTED) })}{' '}
              {hiddenAdopted ? '▸' : '▾'}
            </button>
          )}

          {!hiddenAdopted &&
            (displayMode === 'list' ? (
              <AnimalDisplayList
                animals={animals}
                statusFilter={[AnimalStatus.ADOPTED]}
                nameFilter={nameFilter}
                familyFilter={familyFilter}
              />
            ) : (
              <AnimalDisplayCards
                animals={animals}
                statusFilter={[AnimalStatus.ADOPTED]}
                nameFilter={nameFilter}
                familyFilter={familyFilter}
              />
            ))}

          {countAnimalsByStatus(AnimalStatus.DECEASED) > 0 && (
            <button className="collapse-expand" onClick={() => setHiddenDeceased(!hiddenDeceased)}>
              {t('animals.toggleDeceased', { count: countAnimalsByStatus(AnimalStatus.DECEASED) })}{' '}
              {hiddenDeceased ? '▸' : '▾'}
            </button>
          )}

          {!hiddenDeceased &&
            familyFilter === 0 &&
            (displayMode === 'list' ? (
              <AnimalDisplayList
                animals={animals}
                statusFilter={[AnimalStatus.DECEASED]}
                nameFilter={nameFilter}
                familyFilter={familyFilter}
              />
            ) : (
              <AnimalDisplayCards
                animals={animals}
                statusFilter={[AnimalStatus.DECEASED]}
                nameFilter={nameFilter}
                familyFilter={familyFilter}
              />
            ))}
        </div>
      )}
    </>
  );
};
