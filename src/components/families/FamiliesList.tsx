'use client';

import { Family, Organization } from '@/lib/types';
import Link from 'next/link';

export const FamiliesList = ({
  org,
  families,
}: {
  org: Organization;
  families: Family[] | null;
}) => {
  return (
    <>
      {families && (
        <div className="entities-list">
          <h3>Familles enregistrées pour {org.name} :</h3>
          {families.length === 0 && <p style={{ padding: '10px' }}>Aucune famille enregistrée.</p>}
          {families.length > 0 && (
            <ul>
              {families
                .sort((a, b) =>
                  a.contactFullName.localeCompare(b.contactFullName, undefined, {
                    sensitivity: 'base',
                  }),
                )
                .map((family) => (
                  <li key={family.id}>
                    <Link className="link" href={`/families/${family.id}`}>
                      <strong>{family.contactFullName}</strong>
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
