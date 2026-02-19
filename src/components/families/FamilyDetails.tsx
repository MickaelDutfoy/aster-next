'use client';

import { Link, useRouter } from '@/i18n/routing';
import { normalizeSpeciesToLocale } from '@/lib/animals/normalizeSpeciesToLocale';
import { Animal, Family, Member, Organization } from '@/lib/types';
import { displayAge } from '@/lib/utils/displayAge';
import { MemberRole } from '@prisma/client';
import clsx from 'clsx';
import { MailOpen, Phone, SquareArrowRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { ShareButton } from '../tools/ShareButton';

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
  const router = useRouter();

  const isFamilyMember = family.members.some((member) => member.id === user.id);
  const canEditFamily =
    org.userRole === MemberRole.SUPERADMIN ||
    org.userRole === MemberRole.ADMIN ||
    isFamilyMember ||
    user.id === family.createdByMemberId;
  const canDeleteFamily = org.userRole === MemberRole.SUPERADMIN;

  return (
    <>
      <div className="share-and-links-box">
        <ShareButton />
        <div>
          <button
            onClick={() => router.push(`/families/${family.id}/delete`)}
            className={'little-button' + clsx(!canDeleteFamily && ' disabled')}
          >
            {t('families.deleteTitle')}
          </button>
          <button
            onClick={() => router.push(`/families/${family.id}/edit`)}
            className={'little-button' + clsx(!canEditFamily && ' disabled')}
          >
            {t('families.editInfoTitle')}
          </button>
        </div>
      </div>

      <div className="family-page">
        <h3>{family.contactFullName}</h3>

        <div className="contact-display">
          <address>
            <p>{family.address}</p>
            <p>
              {family.zip} {family.city}
            </p>
          </address>
          {family.email && (
            <div className="contact-item">
              <MailOpen size={18} />
              <span>:</span>
              <a className="link" href={`mailto:${family.email}`}>
                {family.email}
              </a>
            </div>
          )}
          {family.phoneNumber && (
            <div className="contact-item">
              <Phone size={18} />
              <span>:</span>
              <a className="link" href={`tel:${family.phoneNumber}`}>
                {family.phoneNumber}
              </a>
            </div>
          )}
        </div>

        <div className="text-with-link">
          <p>{isFamilyMember ? t('families.familyMember') : t('families.notFamilyMember')}</p>
          {canEditFamily && (
            <Link className="little-button" href={`/families/${family.id}/add-members`}>
              {t('families.manageMembers')}
            </Link>
          )}
        </div>

        <div className="family-members-list">
          <p>{t('families.membersListTitle')}</p>
          <ul>
            {family.members.map((member) => (
              <li key={member.id}>
                <span>
                  {member.firstName} {member.lastName}
                </span>
                <Link className="action link" href={`/members/${member.id}`}>
                  <SquareArrowRight size={26} />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {family.hasChildren && <p>{t('families.hasChildren')}</p>}

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
                      {normalizeSpeciesToLocale(animal.species, t.raw('animals.commonSpecies'))}{' '}
                      <span
                        style={{
                          color: animal.sex === 'M' ? '#8AB6F5' : '#F5A6A6',
                          textShadow: '1px 1px 0px #777',
                        }}
                      >
                        {animal.sex === 'M' ? '♂' : '♀'}
                      </span>
                    </span>
                    <span>{displayAge(animal.birthDate, locale)}</span>
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
      </div>
    </>
  );
};
