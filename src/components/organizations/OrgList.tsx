'use client';

import { cancelOrgRequest } from '@/actions/organizations/cancelOrgRequest';
import { Member } from '@/lib/types';
import { showToast } from '../providers/ToastProvider';
import { useUser } from '../providers/UserProvider';

export const OrgList = () => {
  const user: Member | null = useUser();
  if (!user) return;

  const handleCancelOrgRequest = async (orgId: number) => {
    const res = await cancelOrgRequest(orgId);
    showToast(res);
  };

  return (
    <>
      {user.organizations.some((org) => org.userStatus === 'PENDING') && (
        <div className="pending-list">
          <p>Vos demandes d'adhésion en attente :</p>
          <ul>
            {user.organizations.map((org) => {
              if (org.userStatus === 'PENDING')
                return (
                  <li key={org.id} onClick={() => handleCancelOrgRequest(org.id)}>
                    {org.name}
                  </li>
                );
            })}
          </ul>
          <p className="notice">(Cliquez sur une demande pour l'annuler)</p>
        </div>
      )}
    </>
  );
};
