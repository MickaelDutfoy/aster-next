'use client';

import { Link } from '@/i18n/routing';
import { Animal, Family } from '@/lib/types';
import { displayDate } from '@/lib/utils/displayDate';
import { getAge } from '@/lib/utils/getAge';
import { AnimalStatus } from '@prisma/client';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

export const AnimalDetails = ({ animal, family }: { animal: Animal; family: Family | null }) => {
  const t = useTranslations();
  const locale = useLocale();
  const [hiddenHealth, setHiddenHealth] = useState<boolean>(
    animal.status === AnimalStatus.ADOPTED ? true : false,
  );
  const [hiddenAdoption, setHiddenAdoption] = useState<boolean>(
    animal.status === AnimalStatus.ADOPTED ? false : true,
  );

  const hasHealthInfo = !!animal.lastVax || !!animal.lastDeworm || !!animal.information;

  return (
    <>
      <div className="links-box">
        <Link href={`/animals/${animal.id}/delete`} className="little-button">
          {t('animals.deleteTitle')}
        </Link>
        <Link href={`/animals/${animal.id}/edit`} className="little-button">
          {t('animals.editInfoTitle')}
        </Link>
      </div>
      <div>
        <h3>{animal.name}</h3>
        <p className="fixed-p">
          {animal.species}, {t(`animals.sex.${animal.sex}`).toLowerCase()},{' '}
          {animal.color?.toLowerCase()}, {getAge(animal.birthDate, locale, true)}
          {animal.isNeutered ? t('animals.neuteredSuffix') : ''}.
        </p>
        {animal.findLocation && (
          <p className="fixed-p">
            {t('animals.findLocationLabel')} {animal.findLocation}.
          </p>
        )}
        <h4 className="collapse-expand" onClick={() => setHiddenHealth(!hiddenHealth)}>
          {t('animals.toggleHealth')} {hiddenHealth ? '▸' : '▾'}
        </h4>
        {!hiddenHealth && hasHealthInfo && (
          <div className="animal-details">
            {animal.lastVax && (
              <div className="animal-details-section">
                <h4>{t('animals.lastVaxLabel')}</h4>
                <p>
                  {displayDate(animal.lastVax)}
                  {animal.isPrimoVax ? t('animals.primoShort') : ''}, {t('common.agoPrefix')}
                  {getAge(animal.lastVax, locale, true)}
                  {t('common.agoSuffix')}.
                </p>
                {animal.vaxHistory.length > 0 && (
                  <div className="health-historic">
                    <p>{t('animals.vaxHistoryLabel')}</p>
                    <ul>
                      {animal.vaxHistory.map((date) => (
                        <li key={Number(date)}>
                          {displayDate(date)}, {t('common.agoPrefix')}
                          {getAge(date, locale, true)}
                          {t('common.agoSuffix')}.
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            {animal.lastDeworm && (
              <div className="animal-details-section">
                <h4>{t('animals.lastDewormLabel')}</h4>
                <p>
                  {displayDate(animal.lastDeworm)}
                  {animal.isFirstDeworm ? t('animals.firstDewormShort') : ''},{' '}
                  {t('common.agoPrefix')}
                  {getAge(animal.lastDeworm, locale, true)}
                  {t('common.agoSuffix')}.
                </p>
                {animal.dewormHistory.length > 0 && (
                  <div className="health-historic">
                    <p>{t('animals.dewormHistoryLabel')}</p>
                    <ul style={{ paddingLeft: 40 }}>
                      {animal.dewormHistory.map((date) => (
                        <li key={Number(date)}>
                          {displayDate(date)}, {t('common.agoPrefix')}
                          {getAge(date, locale, true)}
                          {t('common.agoSuffix')}.
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            {animal.information && (
              <div className="animal-details-section">
                <h4>{t('animals.additionalInfoLabel')}</h4>
                <p>{animal.information}</p>
              </div>
            )}
          </div>
        )}
        <p className="fixed-p">
          {t('animals.currentStatusLabel')} {t(`animals.status.${animal.status}`)}.
        </p>
        {family && (
          <p className="fixed-p">
            {t('animals.fosterFamilyLabel')}
            <Link className="link" href={`/families/${family.id}`}>
              {family.contactFullName}
            </Link>
          </p>
        )}
        <h4 className="collapse-expand" onClick={() => setHiddenAdoption(!hiddenAdoption)}>
          {t('animals.toggleAdoption')} {hiddenAdoption ? '▸' : '▾'}
        </h4>
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
          </div>
        )}
      </div>
    </>
  );
};
