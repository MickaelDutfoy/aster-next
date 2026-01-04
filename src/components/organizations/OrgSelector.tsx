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
    const orgId = Number(e.target.value) !== 0 ? Number(e.target.value) : null;

    await setSelectedOrg(orgId);

    if (pathname.startsWith('/organizations') && params.id && Number(params.id) !== orgId) {
      if (!orgId) {
        router.replace(`/organizations`);
        return;
      }
      router.replace(`/organizations/${orgId}`);
      return;
    } else if ((pathname.startsWith('/animals') || pathname.startsWith('/families')) && !orgId) {
      router.replace(`/`);
      return;
    } else if (pathname.startsWith('/animals') && params.id) {
      router.replace(`/animals`);
      return;
    } else if (pathname.startsWith('/families') && params.id) {
      router.replace(`/families`);
      return;
    } else {
      router.refresh();
    }
  };

  if (!user) return null;

  return (
    <div className="org-select">
      <h4>{t('organizations.yourOrganizations')}</h4>
      <select
        value={org?.id ?? 0}
        onChange={handleOrgChange}
        className={clsx(user.organizations.length === 0 ? 'disabled' : '')}
      >
        <option value={0}>{t('common.none')}</option>
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
