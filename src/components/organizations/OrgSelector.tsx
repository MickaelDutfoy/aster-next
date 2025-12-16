'use client';

import { setOrgCookie } from '@/actions/organizations/setOrgCookie';
import { useRouter } from '@/i18n/routing';
import { Member, Organization } from '@/lib/types';
import { MemberStatus } from '@prisma/client';
import { useTranslations } from 'next-intl';

export const OrgSelector = ({ user, org }: { user: Member; org: Organization | null }) => {
  const router = useRouter();
  const t = useTranslations();

  if (!user || !org) return null;

  return (
    <>
      {user.organizations.length > 0 &&
        user.organizations.some((org) => org.userStatus !== MemberStatus.PENDING) && (
          <div className="orga-select">
            <h4>{t('organizations.yourOrganizations')}</h4>
            <select
              value={org?.id}
              onChange={async (e) => {
                await setOrgCookie(Number(e.target.value));
                router.refresh();
              }}
            >
              {user.organizations
                .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
                .map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
            </select>
          </div>
        )}
    </>
  );
};
