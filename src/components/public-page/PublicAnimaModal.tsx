'use client';

import { AnimalPublicSheet } from '@/lib/types';
import { displayAge } from '@/lib/utils/displayAge';
import { displayDate } from '@/lib/utils/displayDate';
import { AnimalStatus } from '@prisma/client';
import { CircleX } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { AnimalImage } from '../animals/AnimalImage';

export const PublicAnimalModal = ({
  animal,
  animalFooter,
  displayHealthInfo,
  displayLocations,
  onClose,
}: {
  animal: AnimalPublicSheet;
  animalFooter: string;
  displayHealthInfo: boolean;
  displayLocations: boolean;
  onClose: () => void;
}) => {
  const t = useTranslations();
  const locale = useLocale();

  const getLastActByType = (
    acts: AnimalPublicSheet['healthActs'] = [],
    type: 'VACCINATION' | 'DEWORM' | 'ANTIFLEA',
  ) => {
    return acts
      .filter((act) => act.type === type)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  };

  const getLatestTestsByName = (tests: AnimalPublicSheet['testEntries'] = []) => {
    const latestTests = new Map<string, NonNullable<AnimalPublicSheet['testEntries']>[number]>();

    for (const test of tests) {
      const key = test.testName.trim().toLowerCase();
      const existing = latestTests.get(key);

      if (!existing || new Date(test.date).getTime() > new Date(existing.date).getTime()) {
        latestTests.set(key, test);
      }
    }

    return Array.from(latestTests.values()).sort((a, b) =>
      a.testName.localeCompare(b.testName, undefined, { sensitivity: 'base' }),
    );
  };

  const lastVaxAct = getLastActByType(animal.healthActs, 'VACCINATION');
  const lastDewormAct = getLastActByType(animal.healthActs, 'DEWORM');
  const lastAntifleaAct = getLastActByType(animal.healthActs, 'ANTIFLEA');

  const latestTests = getLatestTestsByName(animal.testEntries);

  const hasHealthActs = lastVaxAct || lastDewormAct || lastAntifleaAct;
  const hasTests = latestTests.length > 0;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal animal-modal" onClick={(e) => e.stopPropagation()}>
        <CircleX className="close" size={35} onClick={onClose} />
        <h3>
          {animal.name}
          <span
            style={{
              color: animal.sex === 'M' ? '#8AB6F5' : '#F5A6A6',
              textShadow: '1px 1px 0px #777',
            }}
          >
            {(animal.sex === 'M' && ' ♂') || (animal.sex === 'F' && ' ♀')}{' '}
          </span>
          {' — '}
          {animal.birthDate && <span>{`${displayAge(animal.birthDate, locale, true)}`}</span>}
        </h3>
        <AnimalImage animal={animal} canEditAnimal={false} />
        {animal.status === AnimalStatus.IN_TRIAL && (
          <section>
            <p>{t('publish.page.trialInProgress', { name: animal.name })}</p>
          </section>
        )}
        {displayHealthInfo && (
          <section>
            <h3>{t('publish.page.animalHealthInfo')}</h3>
            {animal.isNeutered ? (
              <p>{t('animals.neuteredSuffix')}.</p>
            ) : (
              <p>{t('animals.notNeuteredSuffix')}.</p>
            )}
            {hasHealthActs && (
              <div className="public-health-section">
                {lastVaxAct && (
                  <p>
                    {t('animals.lastVaxLabel')}
                    {displayDate(lastVaxAct.date)}
                    {lastVaxAct.isFirst ? t('animals.primoShort') : ''}.
                  </p>
                )}
                {lastDewormAct && (
                  <p>
                    {t('animals.lastDewormLabel')} {displayDate(lastDewormAct.date)}.
                  </p>
                )}
                {lastAntifleaAct && (
                  <p>
                    {t('animals.lastFleaTreatmentLabel')} {displayDate(lastAntifleaAct.date)}.
                  </p>
                )}
              </div>
            )}
            {hasTests && (
              <div className="public-tests-section">
                {latestTests.map((test) => (
                  <p key={`${test.testName}-${test.date}`}>
                    {t('publish.page.testPrefix')}
                    {test.testName}
                    {test.result === 'NEGATIVE' ? '-' : '+'}
                    {locale === 'fr' && ' '}: {displayDate(test.date)}.
                  </p>
                ))}
              </div>
            )}
          </section>
        )}
        {displayLocations && animal.family && (
          <section>
            <p>
              {t('publish.page.locationPrefix', { name: animal.name })}
              {animal.family.city}.
            </p>
          </section>
        )}
        <section>
          <h3>{t('publish.page.animalDescTitle', { name: animal.name })}</h3>
          <p className="description">{animal.publicDescription}</p>
          <p className="animal-footer">{animalFooter}</p>
        </section>
      </div>
    </div>
  );
};
