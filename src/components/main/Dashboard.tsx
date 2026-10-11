'use client';

import { resetDashboardTutorial } from '@/actions/tutorial/resetDashboardTutorial';
import { Link, useRouter } from '@/i18n/routing';
import { detectEnv } from '@/lib/detectEnv';
import {
  FamilyWithoutDetails,
  Language,
  Member,
  Organization,
  PendingOrgRequest,
} from '@/lib/types';
import { displayDate } from '@/lib/utils/displayDate';
import { MemberRole, MemberStatus } from '@prisma/client';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { DashboardTutorial } from '../tutorial/DashboardTutorial';

export const Dashboard = ({
  user,
  org,
  families,
  pending,
  shouldShowTutorial,
}: {
  user: Member;
  org: Organization | null;
  families: FamilyWithoutDetails[];
  pending: PendingOrgRequest[];
  shouldShowTutorial: boolean;
}) => {
  const t = useTranslations();
  const locale = useLocale() as Language;
  const router = useRouter();

  const { isAndroid } = detectEnv();

  const [isLoading, setIsLoading] = useState(false);
  const [shouldShowInfo, setShouldShowInfo] = useState(false);

  const tallyFormUrls = {
    fr: 'https://tally.so/r/jaOe0J',
    nb: 'https://tally.so/r/dW5EMz',
    en: 'https://tally.so/r/Y5L416',
  } as const;

  const tallyFormUrl = tallyFormUrls[locale];

  useEffect(() => {
    setShouldShowInfo(isAndroid);
  }, []);

  const handleResetTutorial = async () => {
    setIsLoading(true);

    await resetDashboardTutorial();
    router.refresh();

    setIsLoading(false);
  };

  return (
    <>
      {shouldShowTutorial && <DashboardTutorial />}
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
          {(org?.userRole === MemberRole.SUPERADMIN || org?.userRole === MemberRole.ADMIN) && (
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
          <div className="text-with-link">
            <p>{t('dashboard.replayTutorial')}</p>
            <button
              className="little-button"
              onClick={() => handleResetTutorial()}
              aria-busy={isLoading}
              disabled={isLoading}
            >
              {t('dashboard.replayTutorialCTA')}
            </button>
          </div>
          <div className="form-invite">
            <p>{t('dashboard.tallyForm')}</p>

            <Link
              className="little-button"
              href={tallyFormUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('dashboard.tallyFormCTA')}
            </Link>
          </div>
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
            v1.7.2 ({displayDate(new Date(2026, 9, 11), locale)}){locale === 'fr' && ' '}:
            {t.raw('dashboard.changelog.items172').map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <ul>
            v1.7.1{locale === 'fr' && ' '}:
            {t.raw('dashboard.changelog.items171').map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <ul>
            v1.7.0{locale === 'fr' && ' '}:
            {t.raw('dashboard.changelog.items170').map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <ul>
            v1.6.3{locale === 'fr' && ' '}:
            {t.raw('dashboard.changelog.items163').map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <ul>
            v1.6.2{locale === 'fr' && ' '}:
            {t.raw('dashboard.changelog.items162').map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <ul>
            v1.6.1{locale === 'fr' && ' '}:
            {t.raw('dashboard.changelog.items161').map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <ul style={{ fontWeight: 700 }}>
            v1.6.0{locale === 'fr' && ' '}:
            {t.raw('dashboard.changelog.items160').map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <ul>
            v1.5.9{locale === 'fr' && ' '}:
            {t.raw('dashboard.changelog.items159').map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <ul>
            v1.5.8{locale === 'fr' && ' '}:
            {t.raw('dashboard.changelog.items158').map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <ul>
            v1.5.7{locale === 'fr' && ' '}:
            {t.raw('dashboard.changelog.items157').map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
