'use client';

import { Link } from '@/i18n/routing';
import { Family, Member, Organization, PendingOrgRequest } from '@/lib/types';
import { MemberRole, MemberStatus } from '@prisma/client';
import { useLocale, useTranslations } from 'next-intl';

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
  const locale = useLocale();

  return (
    <div className="dash-contents">
      <div className="dash-links">
        <h3>{t('dashboard.welcome', { name: user.firstName })}</h3>
        {user.organizations.length === 0 && (
          <div className="text-with-link">
            <p>{t('dashboard.noOrg')}</p>
            <Link className="little-button" href="/organizations">
              {t('dashboard.pendingSee')}
            </Link>
          </div>
        )}
        {org?.userStatus === MemberStatus.PENDING && (
          <>
            <div className="text-with-link">
              <p>{t('dashboard.orgPending', { orgName: org.name })}</p>
              <Link className="little-button" href={`/organizations/${org.id}`}>
                {t('dashboard.pendingSee')}
              </Link>
            </div>
          </>
        )}
        {org?.userRole === MemberRole.SUPERADMIN && (
          <>
            <p>{t('dashboard.adminOf', { orgName: org.name })}</p>

            {pending && pending.length > 0 && (
              <div className="text-with-link">
                <p>{t('dashboard.pendingIntro')}</p>
                <Link className="little-button" href={`/organizations/${org.id}`}>
                  {t('dashboard.pendingSee')}
                </Link>
              </div>
            )}
          </>
        )}
        {org &&
          org.userStatus !== MemberStatus.PENDING &&
          families.every((family) => family.memberId !== user.id) && (
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
      <div className="changelog">
        <h3>{t('dashboard.changelog.title')}</h3>
        <ul>
          v1.0.0{locale === 'fr' && ' '}:
          {t.raw('dashboard.changelog.items100').map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <ul>
          v0.13.0{locale === 'fr' && ' '}:
          {t.raw('dashboard.changelog.items0130').map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <ul>
          v0.12.3{locale === 'fr' && ' '}:
          {t.raw('dashboard.changelog.items0123').map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
