'use client';

import { setSelectedOrg } from '@/actions/organizations/setSelectedOrg';
import { usePathname, useRouter } from '@/i18n/routing';
import { Member, Organization } from '@/lib/types';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export const OrgSelector = ({ user, org }: { user: Member; org: Organization | null }) => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const t = useTranslations();

  const handleOrgChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const orgId = Number(e.target.value);
    await setSelectedOrg(orgId);
    if (pathname.startsWith('/organizations') && params.id && Number(params.id) !== orgId) {
      router.replace(`/organizations/${orgId}`);
      return;
    }
    router.refresh();
  };

  if (!user) return null;

  return (
    <div className="orga-select">
      <h4>{t('organizations.yourOrganizations')}</h4>
      <select
        value={org?.id}
        onChange={handleOrgChange}
        className={clsx(user.organizations.length === 0 ? 'disabled' : '')}
      >
        {user.organizations.length === 0 && <option>{t('common.none')}</option>}
        {user.organizations.length > 0 &&
          user.organizations
            .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
            .map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
      </select>
    </div>
  );
};
