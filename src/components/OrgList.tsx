'use client';

import { cancelOrgRequest } from '@/actions/cancelOrgRequest';
import { Member } from '@/lib/types';
import { useUser } from './UserProvider';

export const OrgList = () => {
  const user: Member | null = useUser();
  if (!user) return;

  console.log(
    'user orgs',
    user?.organizations.map((org) => org.status),
  );

  return (
    <>
      {user.organizations.some((org) => org.status === 'pending') && (
        <div className="pending-list">
          <h3>Vos demandes d'adhésion en attente :</h3>
          <p>Cliquez sur une demande pour l'annuler.</p>
          <ul>
            {user.organizations.map((org) => {
              if (org.status === 'pending')
                return (
                  <li key={org.id} onClick={() => cancelOrgRequest(org.id)}>
                    {org.name}
                  </li>
                );
            })}
          </ul>
        </div>
      )}
    </>
  );
};
