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
  const t = useTranslations('Dashboard');

  return (
    <div className="dash-content">
      <h3>{t('welcome', { name: user.firstName })}</h3>

      {!org && <p>{t('noOrg')}</p>}

      {org?.userRole === 'SUPERADMIN' && (
        <>
          <p>{t('adminOf', { orgName: org.name })}</p>

          {pending && pending.length > 0 && (
            <div className="text-with-link">
              <p>{t('pendingIntro')}</p>

              <Link href="/organizations" className="link">
                {t('pendingSee')}
                <SquareArrowRight />
              </Link>
            </div>
          )}
        </>
      )}

      <div className="contact">
        <p>{t('contactIntro')}</p>
        <Link className="link" href="mailto:m.dutfoy@gmail.com">
          <u>{t('contactLink')}</u>
        </Link>
      </div>
    </div>
  );
};
