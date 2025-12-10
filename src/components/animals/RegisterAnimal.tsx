'use client';

import { Family } from '@/lib/types';
import { AnimalForm } from './AnimalForm';

export const RegisterAnimal = ({ families }: { families: Family[] }) => {
  return (
    <div className="register-form">
      <h3>Ajouter un animal</h3>
      <AnimalForm families={families} />
    </div>
  );
};
