'use client';

import { Member, Organization, PendingOrgRequest } from '@/lib/types';
import { SquareArrowRight } from 'lucide-react';
import Link from 'next/link';

export const Dashboard = ({
  user,
  org,
  pending,
}: {
  user: Member;
  org: Organization | null;
  pending: PendingOrgRequest[];
}) => {
  return (
    <div className="dash-content">
      <h3>Bienvenue, {user.firstName} !</h3>
      {!org && <p>Vous devez d'abord ajouter une association ou en rejoindre une.</p>}
      {org?.userRole === 'SUPERADMIN' && (
        <>
          <p>Vous êtes admin de l'association {org.name}.</p>
          {pending && pending.length > 0 && (
            <div className="text-with-link">
              <p>Vous devez valider des demandes d'adhésion.</p>

              <Link href="/organizations" className="link">
                Voir
                <SquareArrowRight />
              </Link>
            </div>
          )}
        </>
      )}
      <div className="contact">
        <p>Un problème ? Une suggestion ?</p>
        <Link className="link" href="mailto:m.dutfoy@gmail.com">
          <u>Envoyez-moi un message</u> !
        </Link>
      </div>
    </div>
  );
};
