'use client';

import { AnimalPublicSheet } from '@/lib/types';
import { displayAge } from '@/lib/utils/displayAge';
import { AnimalStatus } from '@prisma/client';
import { useLocale, useTranslations } from 'next-intl';
import { AnimalImage } from '../animals/AnimalImage';
import { isCommonSpecies } from '../animals/isCommonSpecies';

export const PublicAnimalCard = ({
  animal,

  onOpenAnimal,
}: {
  animal: AnimalPublicSheet;

  onOpenAnimal: (animalId: number) => void;
}) => {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="animal-card" onClick={() => onOpenAnimal(animal.id)}>
      <AnimalImage animal={animal} canEditAnimal={false} />
      <h3>
        {animal.name}
        {' — '}
        {isCommonSpecies(animal.species) ? t(`animals.species.${animal.species}`) : animal.species}
        <span
          style={{
            color: animal.sex === 'M' ? '#8AB6F5' : '#F5A6A6',
            textShadow: '1px 1px 0px #777',
          }}
        >
          {(animal.sex === 'M' && ' ♂') || (animal.sex === 'F' && ' ♀')}
        </span>
      </h3>
      {animal.birthDate && <p>{`${displayAge(animal.birthDate, locale, true)}`}</p>}
      {animal.status === AnimalStatus.IN_TRIAL && (
        <p>{t('publish.page.trialInProgress', { name: animal.name })}</p>
      )}
    </div>
  );
};
