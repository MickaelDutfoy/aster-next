'use client';

import { cancelOrgRequest } from '@/actions/organizations/cancelOrgRequest';
import { Member } from '@/lib/types';
import { MemberStatus } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { showToast } from '../app/ToastProvider';
import { DeniedPage } from '../layout/DeniedPage';

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
      {user.organizations.some((org) => org.userStatus === MemberStatus.PENDING) && (
        <div className="clickable-list">
          <p>{t('organizations.pendingRequests')}</p>
          <ul>
            {user.organizations.map((org) => {
              if (org.userStatus === MemberStatus.PENDING) return <li key={org.id}>{org.name}</li>;
            })}
          </ul>
        </div>
      )}
    </>
  );
};
