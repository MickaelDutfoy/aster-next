'use client';

import { Link } from '@/i18n/routing';
import { detectEnv } from '@/lib/detectEnv';
import { FamilyWithoutDetails, Member, Organization, PendingOrgRequest } from '@/lib/types';
import { MemberRole, MemberStatus } from '@prisma/client';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export const Dashboard = ({
  user,
  org,
  families,
  pending,
}: {
  user: Member;
  org: Organization | null;
  families: FamilyWithoutDetails[];
  pending: PendingOrgRequest[];
}) => {
  const t = useTranslations();
  const locale = useLocale();

  const { isAndroid } = detectEnv();

  const [shouldShowInfo, setShouldShowInfo] = useState(false);

  useEffect(() => {
    setShouldShowInfo(isAndroid);
  }, []);

  return (
    <div className="dash-contents">
      <div className="dash-links">
        <h2>{t('dashboard.welcome', { name: user.firstName })}</h2>
        {user.organizations?.length === 0 && (
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
          families.every((family) => !family.members.some((member) => member.id === user.id)) && (
            <div className="text-with-link">
              <p>{t('dashboard.notFoster', { orgName: org.name })}</p>
              <Link className="little-button" href="/families/new">
                {t('common.submitSelf')}
              </Link>
            </div>
          )}
      </div>
      <div className="info" style={!shouldShowInfo ? { visibility: 'hidden' } : undefined}>
        <p>
          {t('dashboard.evaluateAster')}
          <Link
            className="link"
            href="https://play.google.com/store/apps/details?id=com.quietforge.aster"
          >
            Google Play
          </Link>
          .
        </p>
      </div>
      <div className="changelog">
        <h3>{t('dashboard.changelog.title')}</h3>
        <ul>
          v1.5.2{locale === 'fr' && ' '}:
          {t.raw('dashboard.changelog.items152').map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <ul>
          v1.5.1{locale === 'fr' && ' '}:
          {t.raw('dashboard.changelog.items151').map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <ul>
          v1.5.0{locale === 'fr' && ' '}:
          {t.raw('dashboard.changelog.items150').map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <ul>
          v1.4.2{locale === 'fr' && ' '}:
          {t.raw('dashboard.changelog.items142').map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <ul>
          v1.4.1{locale === 'fr' && ' '}:
          {t.raw('dashboard.changelog.items141').map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <ul>
          v1.4.0{locale === 'fr' && ' '}:
          {t.raw('dashboard.changelog.items140').map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <ul>
          v1.3.0{locale === 'fr' && ' '}:
          {t.raw('dashboard.changelog.items130').map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <ul>
          v1.2.3{locale === 'fr' && ' '}:
          {t.raw('dashboard.changelog.items123').map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <ul>
          v1.2.2{locale === 'fr' && ' '}:
          {t.raw('dashboard.changelog.items122').map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <ul>
          v1.2.1{locale === 'fr' && ' '}:
          {t.raw('dashboard.changelog.items121').map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <ul>
          v1.2.0{locale === 'fr' && ' '}:
          {t.raw('dashboard.changelog.items120').map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <ul>
          v1.1.0{locale === 'fr' && ' '}:
          {t.raw('dashboard.changelog.items110').map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <ul style={{ fontWeight: 700 }}>
          v1.0.0{locale === 'fr' && ' '}:
          {t.raw('dashboard.changelog.items100').map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <ul>
          v0.15.0{locale === 'fr' && ' '}:
          {t.raw('dashboard.changelog.items0150').map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <ul>
          v0.14.0{locale === 'fr' && ' '}:
          {t.raw('dashboard.changelog.items0140').map((item: string, index: number) => (
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
