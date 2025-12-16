'use client';

import { Link } from '@/i18n/routing';
import { Family, Member, Organization, PendingOrgRequest } from '@/lib/types';
import { useTranslations } from 'next-intl';

export const Dashboard = ({
  user,
  org,
  families,
  pending,
}: {
  user: Member;
  org: Organization | null;
  families: Family[];
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

              <Link className="little-button" href="/organizations">
                {t('dashboard.pendingSee')}
              </Link>
            </div>
          )}
        </>
      )}

      {org && families.every((family) => family.memberId !== user.id) && (
        <div className="text-with-link">
          <p>{t('dashboard.notFoster', { orgName: org.name })}</p>
          <Link className="little-button" href="/families/new">
            {t('common.submitSelf')}
          </Link>
        </div>
      )}

      <div className="text-with-link">
        <p>{t('dashboard.contactIntro')}</p>
        <Link className="little-button" href="/contact">
          {t('dashboard.contactLink')}
        </Link>
      </div>
    </div>
  );
};
