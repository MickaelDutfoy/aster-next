'use client';

import { approveOrgRequest } from '@/actions/organizations/approveOrgRequest';
import { Member, Organization, PendingOrgRequest } from '@/lib/types';
import Link from 'next/link';
import { showToast } from './providers/ToastProvider';

export const Dashboard = ({
  user,
  org,
  pending,
}: {
  user: Member;
  org: Organization | null;
  pending: PendingOrgRequest[] | null;
}) => {
  const handleApproveOrgRequest = async (memberId: number, orgId: number) => {
    const res = await approveOrgRequest(memberId, orgId);
    showToast(res);
  };

  return (
    <div className="dash-content">
      <h3>Bienvenue, {user.firstName} !</h3>
      {!org && <p>Vous devez d'abord ajouter une association ou en rejoindre une.</p>}
      {org?.userRole === 'SUPERADMIN' && (
        <>
          <p>Vous êtes admin de l'association {org.name}.</p>
          {pending && pending.length > 0 && (
            <div className="pending-list">
              <p>Vous devez valider les demandes d'adhésion suivantes :</p>

              <ul>
                {pending.map((req) => (
                  <li
                    key={req.memberId}
                    onClick={() => handleApproveOrgRequest(req.memberId, req.orgId)}
                  >
                    {req.memberName}
                  </li>
                ))}
              </ul>
              <p className="notice">(Cliquez sur une demande pour l'approuver)</p>
            </div>
          )}
        </>
      )}
      <div className="contact">
        <p>Un problème ? Une suggestion ? </p>
        <Link className="link" href="mailto:m.dutfoy@gmail.com">
          Envoyez-moi un message  !
        </Link>
      </div>
    </div>
  );
};
