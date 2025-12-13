'use client';

import { Link } from '@/i18n/routing';
import { Member, Organization, PendingOrgRequest } from '@/lib/types';
import { SquareArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export const Dashboard = ({
  user,
  org,
  pending,
}: {
  user: Member;
  org: Organization | null;
  pending: PendingOrgRequest[];
}) => {
  const t = useTranslations();

  return (
    <div className="dash-content">
      <h3>{t('dashboard.welcome', { name: user.firstName })}</h3>

      {!org && <p>{t('dashboard.noOrg')}</p>}

      {org?.userRole === 'SUPERADMIN' && (
        <>
          <p>{t('dashboard.adminOf', { orgName: org.name })}</p>

          {pending && pending.length > 0 && (
            <div className="text-with-link">
              <p>{t('dashboard.pendingIntro')}</p>

              <Link href="/organizations" className="link">
                {t('dashboard.pendingSee')}
                <SquareArrowRight />
              </Link>
            </div>
          )}
        </>
      )}

      <div className="contact">
        <p>{t('dashboard.contactIntro')}</p>
        <Link className="link" href="mailto:m.dutfoy@gmail.com">
          <u>{t('dashboard.contactLink')}</u>
        </Link>
      </div>
    </div>
  );
};
