'use client';

import { Animal, Organization } from '@/lib/types';
import { getAge } from '@/lib/utils/getAge';
import { AnimalStatus } from '@prisma/client';
import Link from 'next/link';
import { useState } from 'react';

export const AnimalsList = ({ org, animals }: { org: Organization; animals: Animal[] | null }) => {
  const [hiddenAdopted, setHiddenAdopted] = useState<boolean>(true);

  return (
    <>
      {animals && (
        <div className="entities-list">
          <h3>Animaux enregistrés pour {org.name} :</h3>
          {animals.length === 0 && <p style={{ padding: '10px' }}>Aucun animal enregistré.</p>}
          {animals.length > 0 && (
            <ul>
              {animals
                .filter((animal) => animal.status !== AnimalStatus.ADOPTED)
                .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
                .map((animal) => (
                  <li key={animal.id}>
                    <Link className="link" href={`/animals/${animal.id}`}>
                      <strong>{animal.name}</strong> — {animal.species}{' '}
                      <span
                        style={{
                          color: animal.sex === 'M' ? '#8AB6F5' : '#F5A6A6',
                          textShadow: '1px 1px 0px #777',
                        }}
                      >
                        {animal.sex === 'M' ? '♂' : '♀'}
                      </span>{' '}
                      — {getAge(animal.birthDate)}
                    </Link>
                  </li>
                ))}
            </ul>
          )}
          <h4 className="collapse-expand" onClick={() => setHiddenAdopted(!hiddenAdopted)}>
            Afficher les animaux adoptés {hiddenAdopted ? '▸' : '▾'}
          </h4>
          {!hiddenAdopted && (
            <ul>
              {animals
                .filter((animal) => animal.status === AnimalStatus.ADOPTED)
                .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
                .map((animal) => (
                  <li key={animal.id}>
                    <Link className="link" href={`/animals/${animal.id}`}>
                      <strong>{animal.name}</strong> — {animal.species}{' '}
                      <span
                        style={{
                          color: animal.sex === 'M' ? '#8AB6F5' : '#F5A6A6',
                          textShadow: '1px 1px 0px #777',
                        }}
                      >
                        {animal.sex === 'M' ? '♂' : '♀'}
                      </span>{' '}
                      — {getAge(animal.birthDate)}
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
