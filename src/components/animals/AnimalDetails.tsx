'use client';

import { Link, useRouter } from '@/i18n/routing';
import { Animal, Family, Member, Organization } from '@/lib/types';
import { displayDate } from '@/lib/utils/displayDate';
import { getAge } from '@/lib/utils/getAge';
import { AnimalStatus, MemberRole } from '@prisma/client';
import clsx from 'clsx';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

export const AnimalDetails = ({
  user,
  org,
  animal,
  family,
}: {
  user: Member;
  org: Organization;
  animal: Animal;
  family: Family | null;
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [hiddenHealth, setHiddenHealth] = useState<boolean>(
    animal.status === AnimalStatus.ADOPTED ? true : false,
  );
  const [hiddenAdoption, setHiddenAdoption] = useState<boolean>(
    animal.status === AnimalStatus.ADOPTED ? false : true,
  );

  const acts = animal.healthActs ?? [];

  const lastVaxAct = acts.find((act) => act.type === 'VACCINATION') ?? null;
  const lastDewormAct = acts.find((act) => act.type === 'DEWORM') ?? null;
  const lastAntifleaAct = acts.find((act) => act.type === 'ANTIFLEA') ?? null;
  const vaxHistory = acts.filter((act) => act.type === 'VACCINATION').slice(1);
  const dewormHistory = acts.filter((act) => act.type === 'DEWORM').slice(1);
  const antifleaHistory = acts.filter((act) => act.type === 'ANTIFLEA').slice(1);

  const hasHealthInfo =
    !!lastVaxAct || !!lastDewormAct || !!lastAntifleaAct || !!animal.healthInformation;

  return (
    <>
      <div className="links-box">
        <button
          onClick={() => router.push(`/animals/${animal.id}/delete`)}
          className={
            'little-button ' +
            clsx(
              animal.createdByMemberId !== user.id &&
                org.userRole !== MemberRole.SUPERADMIN &&
                'disabled',
            )
          }
        >
          {t('animals.deleteTitle')}
        </button>
        <button onClick={() => router.push(`/animals/${animal.id}/edit`)} className="little-button">
          {t('animals.editInfoTitle')}
        </button>
      </div>
      <div className="animal-page">
        <h3>{animal.name}</h3>
        <p>
          {animal.species}, {t(`animals.sex.${animal.sex}`).toLowerCase()},{' '}
          {animal.color?.toLowerCase()}, {getAge(animal.birthDate, locale, true)}
          {animal.isNeutered && t('animals.neuteredSuffix')}.
        </p>
        {animal.findLocation && (
          <p>
            {t('animals.findLocationLabel')} {animal.findLocation}.
          </p>
        )}
        <button className="collapse-expand" onClick={() => setHiddenHealth(!hiddenHealth)}>
          {t('animals.toggleHealth')} {hiddenHealth ? '▸' : '▾'}
        </button>
        {!hiddenHealth && hasHealthInfo && (
          <div className="animal-details">
            {lastVaxAct && (
              <div className="animal-details-section">
                <h4>{t('animals.lastVaxLabel')}</h4>
                <p>
                  {displayDate(lastVaxAct.date)}
                  {lastVaxAct.isFirst && t('animals.primoShort')}, {t('common.agoPrefix')}
                  {getAge(lastVaxAct.date, locale, true)}
                  {t('common.agoSuffix')}.
                </p>

                {vaxHistory.length > 0 && (
                  <div className="health-historic">
                    <p>{t('animals.vaxHistoryLabel')}</p>
                    <ul>
                      {vaxHistory.map((act) => (
                        <li key={act.id}>
                          {displayDate(act.date)}, {t('common.agoPrefix')}
                          {getAge(act.date, locale, true)}
                          {t('common.agoSuffix')}.
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {lastDewormAct && (
              <div className="animal-details-section">
                <h4>{t('animals.lastDewormLabel')}</h4>
                <p>
                  {displayDate(lastDewormAct.date)}
                  {lastDewormAct.isFirst && t('animals.firstDewormShort')}, {t('common.agoPrefix')}
                  {getAge(lastDewormAct.date, locale, true)}
                  {t('common.agoSuffix')}.
                </p>

                {dewormHistory.length > 0 && (
                  <div className="health-historic">
                    <p>{t('animals.dewormHistoryLabel')}</p>
                    <ul style={{ paddingLeft: 40 }}>
                      {dewormHistory.map((act) => (
                        <li key={act.id}>
                          {displayDate(act.date)}, {t('common.agoPrefix')}
                          {getAge(act.date, locale, true)}
                          {t('common.agoSuffix')}.
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {lastAntifleaAct && (
              <div className="animal-details-section">
                <h4>{t('animals.lastFleaTreatmentLabel')}</h4>
                <p>
                  {displayDate(lastAntifleaAct.date)}
                  {lastAntifleaAct.isFirst && t('animals.firstDewormShort')},{' '}
                  {t('common.agoPrefix')}
                  {getAge(lastAntifleaAct.date, locale, true)}
                  {t('common.agoSuffix')}.
                </p>

                {antifleaHistory.length > 0 && (
                  <div className="health-historic">
                    <p>{t('animals.antifleaHistoryLabel')}</p>
                    <ul style={{ paddingLeft: 40 }}>
                      {antifleaHistory.map((act) => (
                        <li key={act.id}>
                          {displayDate(act.date)}, {t('common.agoPrefix')}
                          {getAge(act.date, locale, true)}
                          {t('common.agoSuffix')}.
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {animal.healthInformation && (
              <div className="animal-details-section">
                <h4>{t('animals.additionalInfoLabel')}</h4>
                <p>{animal.healthInformation}</p>
              </div>
            )}
          </div>
        )}
        <p>
          {t('animals.currentStatusLabel')} {t(`animals.status.${animal.status}`)}.
        </p>
        {family && (
          <p>
            {t('animals.fosterFamilyLabel')}
            <Link className="link" href={`/families/${family.id}`}>
              {family.contactFullName}
            </Link>
          </p>
        )}
        <button className="collapse-expand" onClick={() => setHiddenAdoption(!hiddenAdoption)}>
          {t('animals.toggleAdoption')} {hiddenAdoption ? '▸' : '▾'}
        </button>
        {!hiddenAdoption && (
          <div className="animal-details">
            {animal.adoption?.adopterFullName && (
              <div className="animal-details-section">
                <h4>{t('animals.adopterLabel')}</h4>
                <p>{animal.adoption.adopterFullName}</p>
                <p>{animal.adoption.adopterAddress}</p>
                <p>
                  {animal.adoption.adopterZip} {animal.adoption.adopterCity}
                </p>
                <p>{animal.adoption.adopterEmail}</p>
                <p>{animal.adoption.adopterPhoneNumber}</p>
              </div>
            )}
            <div className="animal-details-section">
              <h4>{t('animals.aboutAdoption')}</h4>
              {animal.adoption?.homeVisitDone && <p>{t('animals.homeVisitDone')}</p>}
              {animal.adoption?.neuteringPlannedAt && (
                <p>
                  {t('animals.neuteringPlannedLabel')}
                  {displayDate(animal.adoption.neuteringPlannedAt)}
                </p>
              )}
              {animal.adoption?.adoptionContractSignedAt && (
                <p>
                  {t('animals.contractSignedLabel')}
                  {displayDate(animal.adoption.adoptionContractSignedAt)}
                </p>
              )}
              {animal.adoption?.adoptionFeePaid ? (
                <p>{t('animals.feesPaid')}</p>
              ) : (
                <p>{t('animals.feesNotPaid')}</p>
              )}
              {animal.adoption?.legalTransferAt && (
                <p>
                  {t('animals.legalTransferLabel')} {displayDate(animal.adoption.legalTransferAt)}
                </p>
              )}
            </div>
            {animal.adoption?.information && (
              <div className="animal-details-section">
                <h4>{t('animals.adoptionNotes')}</h4>
                <p>{animal.adoption?.information}</p>
              </div>
            )}
          </div>
        )}
        {animal.information && (
          <div className="animal-general-info">
            <h4>{t('animals.additionalInfoLabel')}</h4>
            <p>{animal.information}</p>
          </div>
        )}
      </div>
    </>
  );
};
