'use client';

import { Animal, Family } from '@/lib/types';
import { getAge } from '@/lib/utils/getAge';
import Link from 'next/link';

export const FamilyDetails = ({
  family,
  animals,
}: {
  family: Family;
  animals: Animal[] | null;
}) => {
  return (
    <>
      <div className="links-box">
        <Link href={`/families/${family.id}/delete`} className="little-button">
          Supprimer la famille
        </Link>
        <Link href={`/families/${family.id}/edit`} className="little-button">
          Éditer la famille
        </Link>
      </div>
      <div>
        <h3>{family.contactFullName}</h3>
        <div className="family-contact-display">
          <p>
            {family.address} {family.zip} {family.city}
          </p>
          {family.email && <p>{family.email}</p>}
          {family.phoneNumber && <p>{family.phoneNumber}</p>}
        </div>

        {family.hasChildren && <p>Cette famille a des enfants.</p>}
      </div>
      {animals && animals.length > 0 && (
        <div className="entities-list">
          <p>Animaux en charge :</p>
          <ul>
            {animals
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
        </div>
      )}
      {family.otherAnimals && (
        <>
          <p>Autres animaux :</p>
          <p className="family-animals">{family.otherAnimals}</p>
        </>
      )}
    </>
  );
};
