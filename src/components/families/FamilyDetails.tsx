'use client';

import { Family } from '@/lib/types';
import Link from 'next/link';

export const FamilyDetails = ({ family }: { family: Family }) => {
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
        <p className="fixed-p">
          {family.address} {family.zip} {family.city}
        </p>
        {family.email && <p className="fixed-p">{family.email}</p>}
        {family.phoneNumber && <p className="fixed-p">{family.phoneNumber}</p>}
        {family.hasChildren && <p>Cette famille a des enfants.</p>}
        {family.otherAnimals && <p>Autres animaux : {family.otherAnimals}</p>}
      </div>
    </>
  );
};
