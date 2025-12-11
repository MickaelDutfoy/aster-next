'use client';

import { Link } from '@/i18n/routing';
import { Family, Organization } from '@/lib/types';
import { SquareArrowRight } from 'lucide-react';

export const FamiliesList = ({ org, families }: { org: Organization; families: Family[] }) => {
  return (
    <>
      {families && (
        <div>
          <h3>Familles enregistrées pour {org.name} :</h3>
          {families.length === 0 && <p style={{ padding: '10px' }}>Aucune famille enregistrée.</p>}
          {families.length > 0 && (
            <ul className="families-list">
              {families
                .sort((a, b) =>
                  a.contactFullName.localeCompare(b.contactFullName, undefined, {
                    sensitivity: 'base',
                  }),
                )
                .map((family) => (
                  <li key={family.id}>
                    <span>{family.contactFullName}</span>
                    <span>{family.city}</span>
                    <Link className="action link" href={`/families/${family.id}`}>
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
