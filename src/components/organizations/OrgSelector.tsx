'use client';

import { setOrgCookie } from '@/actions/organizations/setOrgCookie';
import { Member, Organization } from '@/lib/types';
import { MemberStatus } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useOrg } from '../providers/OrgProvider';
import { useUser } from '../providers/UserProvider';

export const OrgSelector = () => {
  const user: Member | null = useUser();
  const router = useRouter();
  const org: Organization | null = useOrg();

  if (!user || !user.organizations?.length) return null;

  return (
    <>
      {user.organizations.length > 0 &&
        user.organizations.some((org) => org.userStatus !== MemberStatus.PENDING) && (
          <>
            <div className="orga-select">
              <h4>Vos associations :</h4>
              <select
                value={org?.id}
                onChange={(e) => {
                  setOrgCookie(Number(e.target.value));
                  router.refresh();
                }}
              >
                {user.organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
            <hr />
          </>
        )}
    </>
  );
};
