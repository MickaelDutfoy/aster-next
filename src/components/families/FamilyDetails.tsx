'use client';

import { Link } from '@/i18n/routing';
import { Animal, Family, Member, Organization } from '@/lib/types';
import { getAge } from '@/lib/utils/getAge';
import { MemberRole } from '@prisma/client';
import clsx from 'clsx';
import { SquareArrowRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

export const FamilyDetails = ({
  user,
  org,
  family,
  animals,
}: {
  user: Member;
  org: Organization;
  family: Family;
  animals: Animal[];
}) => {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <>
      <div className="links-box">
        <Link
          href={`/families/${family.id}/delete`}
          className={
            'little-button ' +
            clsx(
              family.memberId &&
                family.memberId !== user.id &&
                org.userRole !== MemberRole.SUPERADMIN &&
                'disabled',
            )
          }
        >
          {t('families.deleteTitle')}
        </Link>
        <Link
          href={`/families/${family.id}/edit`}
          className={
            'little-button ' + clsx(family.memberId && family.memberId !== user.id && 'disabled')
          }
        >
          {t('families.editInfoTitle')}
        </Link>
      </div>

      <div>
        <h3>{family.contactFullName}</h3>
        {family.memberId === user.id && <p className="notice">{t('families.isSelf')}</p>}
        {family.memberId && family.memberId !== user.id && (
          <p className="notice">{t('families.cantEdit')}</p>
        )}
        <div className="family-contact-display">
          <p>
            {family.address} {family.zip} {family.city}
          </p>
          {family.email && <p>{family.email}</p>}
          {family.phoneNumber && <p>{family.phoneNumber}</p>}
        </div>

        {family.hasChildren && <p>{t('families.hasChildren')}</p>}
      </div>

      {animals && animals.length > 0 && (
        <div>
          <p>{t('families.animalsInCareLabel', { count: animals.length })}</p>
          <ul className="animals-list">
            {animals
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
                  <span>{getAge(animal.birthDate, locale)}</span>
                  <Link className="action link" href={`/animals/${animal.id}`}>
                    <SquareArrowRight size={26} />
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      )}

      {family.otherAnimals && (
        <>
          <p>{t('families.otherAnimalsLabel')}</p>
          <p className="family-animals">{family.otherAnimals}</p>
        </>
      )}
    </>
  );
};
