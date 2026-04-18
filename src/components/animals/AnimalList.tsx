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

  const [displayMode, setDisplayMode] = useState<'list' | 'cards' | null>(null);

  const [nameFilter, setNameFilter] = useState<string>('');
  const [familyFilter, setfamilyFilter] = useState<number>(0);

  const [selectedStatuses, setSelectedStatuses] = useState<AnimalStatus[]>([
    AnimalStatus.UNHOSTED,
    AnimalStatus.FOSTERED,
    AnimalStatus.IN_TRIAL,
  ]);

  const statusOptions = [
    AnimalStatus.UNHOSTED,
    AnimalStatus.FOSTERED,
    AnimalStatus.ADOPTED,
    AnimalStatus.IN_TRIAL,
    AnimalStatus.DECEASED,
    AnimalStatus.PERMANENT_PLACEMENT,
  ];

  const filteredAnimals = animals
    .filter((animal) => !nameFilter || animal.name.toLowerCase().includes(nameFilter.toLowerCase()))
    .filter((animal) => !familyFilter || animal.familyId === familyFilter)
    .filter((animal) => selectedStatuses.includes(animal.status))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

  useEffect(() => {
    const stored = localStorage.getItem('preferredDisplayMode');

    if (stored === 'list' || stored === 'cards') {
      setDisplayMode(stored);
    } else {
      setDisplayMode('list');
    }
  }, []);

  const toggleStatus = (status: AnimalStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((item) => item !== status) : [...prev, status],
    );
    setfamilyFilter(0);
  };

  const handleChangeMode = (mode: 'list' | 'cards') => {
    setDisplayMode(mode);
    localStorage.setItem('preferredDisplayMode', mode);
  };

  if (!displayMode) return null;

  return (
    <>
      {animals && (
        <div>
          {animals.length > 0 && (
            <div className="animal-filters">
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
                  onChange={(e) => {
                    setfamilyFilter(Number(e.target.value));
                    if (Number(e.target.value) !== 0) {
                      setSelectedStatuses([
                        AnimalStatus.FOSTERED,
                        AnimalStatus.PERMANENT_PLACEMENT,
                      ]);
                    } else {
                      setSelectedStatuses([
                        AnimalStatus.UNHOSTED,
                        AnimalStatus.FOSTERED,
                        AnimalStatus.IN_TRIAL,
                      ]);
                    }
                  }}
                >
                  <option value={0}>{t('common.noneM')}</option>
                  {families.map((family) => (
                    <option key={family.id} value={family.id}>
                      {family.contactFullName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="status-filters">
                {statusOptions.map((status) => (
                  <label key={status}>
                    <input
                      type="checkbox"
                      checked={selectedStatuses.includes(status)}
                      onChange={() => toggleStatus(status)}
                    />
                    <span>{t(`animals.status.${status}`)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <h3>
            {t('animals.listTitle', {
              orgName: org.name,
              count: filteredAnimals.length,
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

          {filteredAnimals.length === 0 && <p style={{ padding: '10px' }}>{t('animals.none')}</p>}

          {filteredAnimals.length > 0 &&
            (displayMode === 'list' ? (
              <AnimalDisplayList animals={filteredAnimals} />
            ) : (
              <AnimalDisplayCards animals={filteredAnimals} />
            ))}
        </div>
      )}
    </>
  );
};
