'use client';

import { Family, Member } from '@/lib/types';
import { FamilyForm } from './FamilyForm';

export const UpdateFamily = ({ user, family }: { user: Member; family: Family }) => {
  return (
    <div className="register-form">
      <h3>Éditer les informations</h3>
      <FamilyForm user={user} family={family} />
    </div>
  );
};
