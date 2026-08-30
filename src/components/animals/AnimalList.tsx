'use client';

import { AnimalWithoutDetails, FamilyWithoutDetails, Organization } from '@/lib/types';
import { AnimalStatus } from '@prisma/client';
import { ArrowBigDown, ArrowBigUp, Grid2x2, List } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
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

  const [sortMode, setSortMode] = useState<string | null>(null);
  const [sortDesc, setSortDesc] = useState<boolean>(false);
  const [displayMode, setDisplayMode] = useState<'list' | 'cards' | null>(null);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
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
    AnimalStatus.RELEASED,
  ];

  const sortedAnimals = useMemo(() => {
    const filteredAnimals = animals
      .filter(
        (animal) => !nameFilter || animal.name.toLowerCase().includes(nameFilter.toLowerCase()),
      )
      .filter((animal) => !familyFilter || animal.familyId === familyFilter)
      .filter((animal) => selectedStatuses.includes(animal.status));

    const direction = sortDesc ? -1 : 1;

    if (sortMode === 'name') {
      return filteredAnimals.sort(
        (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }) * direction,
      );
    }

    return filteredAnimals.sort((a, b) => {
      if (!a.birthDate && !b.birthDate) return 0;
      if (!a.birthDate) return 1;
      if (!b.birthDate) return -1;

      return (b.birthDate.getTime() - a.birthDate.getTime()) * direction;
    });
  }, [animals, nameFilter, familyFilter, selectedStatuses, sortMode, displayMode, sortDesc]);

  useEffect(() => {
    const display = localStorage.getItem('preferredDisplayMode');
    const sort = localStorage.getItem('preferredSortMode');
    const sortDesc = localStorage.getItem('preferredSortDesc');

    if (display === 'list' || display === 'cards') {
      setDisplayMode(display);
    } else {
      setDisplayMode('list');
    }

    if (sort === 'name' || sort === 'age') {
      setSortMode(sort);
    } else {
      setSortMode('name');
    }

    setSortDesc(sortDesc === 'true');

    setPreferencesLoaded(true);
  }, []);

  const toggleStatus = (status: AnimalStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((item) => item !== status) : [...prev, status],
    );
    setfamilyFilter(0);
  };

  const handleChangeDisplay = (mode: 'list' | 'cards') => {
    setDisplayMode(mode);
    localStorage.setItem('preferredDisplayMode', mode);
  };

  const handleChangeSort = (mode: string) => {
    setSortMode(mode);
    localStorage.setItem('preferredSortMode', mode);
  };

  const handleChangeSortOrder = () => {
    setSortDesc((prev) => {
      const next = !prev;
      localStorage.setItem('preferredSortDesc', String(next));
      return next;
    });
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
              count: sortedAnimals.length,
            })}
          </h3>

          <div className="display-mode">
            <div className="sort">
              <p>{t('animals.sortLabel')}</p>
              <select onChange={(e) => handleChangeSort(e.target.value)}>
                <option value="name">{t('animals.name')}</option>
                <option value="age">{t('animals.age')}</option>
              </select>
              <button className="link" onClick={() => handleChangeSortOrder()}>
                {sortDesc ? <ArrowBigDown size={26} /> : <ArrowBigUp size={26} />}
              </button>
            </div>
            <div className="display-mode-buttons">
              <button
                className="display-button"
                style={displayMode === 'cards' ? { opacity: 0.5 } : {}}
                onClick={() => handleChangeDisplay('list')}
              >
                <List size={26} />
              </button>
              <button
                className="display-button"
                style={displayMode === 'list' ? { opacity: 0.5 } : {}}
                onClick={() => handleChangeDisplay('cards')}
              >
                <Grid2x2 size={26} />
              </button>
            </div>
          </div>

          {sortedAnimals.length === 0 && <p style={{ padding: '10px' }}>{t('animals.none')}</p>}

          {preferencesLoaded &&
            sortedAnimals.length > 0 &&
            (displayMode === 'list' ? (
              <AnimalDisplayList animals={sortedAnimals} />
            ) : (
              <AnimalDisplayCards animals={sortedAnimals} />
            ))}
        </div>
      )}
    </>
  );
};
