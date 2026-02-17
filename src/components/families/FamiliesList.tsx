'use client';

import { Link } from '@/i18n/routing';
import { FamilyWithoutDetails, Organization } from '@/lib/types';
import { SquareArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export const FamiliesList = ({
  org,
  families,
}: {
  org: Organization;
  families: FamilyWithoutDetails[];
}) => {
  const t = useTranslations();

  const [nameFilter, setNameFilter] = useState<string>('');

  return (
    <>
      {families && (
        <div>
          {families.length > 0 && (
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
          <h3>
            {t('families.listTitle', {
              orgName: org.name,
              count: families.filter((family) => family.contactFullName.includes(nameFilter))
                .length,
            })}
          </h3>

          {families.length === 0 && <p style={{ padding: '10px' }}>{t('families.none')}</p>}

          {families.length > 0 && (
            <ul className="families-list">
              {families
                .filter((family) => family.contactFullName.includes(nameFilter))
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
