'use client';

import { cancelOrgRequest } from '@/actions/organizations/cancelOrgRequest';
import { Member } from '@/lib/types';
import { useTranslations } from 'next-intl';
import { DeniedPage } from '../DeniedPage';
import { showToast } from '../providers/ToastProvider';

export const OrgList = ({ user }: { user: Member }) => {
  if (!user) return <DeniedPage cause="error" />;

  const t = useTranslations();

  const handleCancelOrgRequest = async (orgId: number) => {
    const res = await cancelOrgRequest(orgId);
    showToast({
      ...res,
      message: res.message ? t(res.message) : undefined,
    });
  };

  return (
    <>
      {user.organizations.some((org) => org.userStatus === 'PENDING') && (
        <div className="clickable-list">
          <p>{t('organizations.pendingRequests')}</p>
          <ul>
            {user.organizations.map((org) => {
              if (org.userStatus === 'PENDING')
                return (
                  <li key={org.id} onClick={() => handleCancelOrgRequest(org.id)}>
                    {org.name}
                  </li>
                );
            })}
          </ul>
        </div>
      )}
    </>
  );
};
