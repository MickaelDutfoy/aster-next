'use client';

import { Animal, Organization } from '@/lib/types';
import { getAge } from '@/lib/utils/getAge';
import { AnimalStatus } from '@prisma/client';
import { SquareArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export const AnimalsList = ({ org, animals }: { org: Organization; animals: Animal[] }) => {
  const [hiddenAdopted, setHiddenAdopted] = useState<boolean>(true);

  return (
    <>
      {animals && (
        <div>
          <h3>Animaux enregistrés pour {org.name} :</h3>
          {animals.length === 0 && <p style={{ padding: '10px' }}>Aucun animal enregistré.</p>}
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
                    <span>{getAge(animal.birthDate)}</span>
                    <Link className="action link" href={`/animals/${animal.id}`}>
                      <SquareArrowRight size={26} />
                    </Link>
                  </li>
                ))}
            </ul>
          )}
          <h4 className="collapse-expand" onClick={() => setHiddenAdopted(!hiddenAdopted)}>
            Afficher les animaux adoptés {hiddenAdopted ? '▸' : '▾'}
          </h4>
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
                    <span>{getAge(animal.birthDate)}</span>
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
