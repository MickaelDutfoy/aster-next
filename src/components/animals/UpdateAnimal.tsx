'use client';

import { Animal, Family, Member } from '@/lib/types';
import { useTranslations } from 'next-intl';
import { AnimalForm } from './AnimalForm';

export const UpdateAnimal = ({
  user,
  animal,
  families,
}: {
  user: Member;
  animal: Animal;
  families: Family[];
}) => {
  const t = useTranslations();

  return (
    <div className="register-form">
      <h3>{t('animals.editInfoTitle')}</h3>
      <AnimalForm user={user} animal={animal} families={families} />
    </div>
  );
};
