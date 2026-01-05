'use client';

import { transferOrgAdmin } from '@/actions/organizations/transferOrgAdmin';
import { useRouter } from '@/i18n/routing';
import { Member, MemberOfOrg, Organization } from '@/lib/types';
import { MemberRole, MemberStatus } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { DeniedPage } from '../main/DeniedPage';
import { showToast } from '../tools/ToastProvider';

export const TransferAdmin = ({
  user,
  org,
  members,
}: {
  user: Member;
  org: Organization;
  members: MemberOfOrg[];
}) => {
  const t = useTranslations();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const membersFiltered = members
    .filter((member) => member.id !== user.id && member.status !== MemberStatus.PENDING)
    .sort((a, b) =>
      a.firstName.localeCompare(b.firstName, undefined, {
        sensitivity: 'base',
      }),
    );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newAdminId = Number(formData.get('newAdminId'));

    setIsLoading(true);
    try {
      const res = await transferOrgAdmin(org.id, newAdminId);
      showToast({
        ...res,
        message: res.message ? t(res.message) : undefined,
      });
      if (res.ok) router.replace(`/organizations/${org.id}`);
    } catch (err) {
      console.error(err);
      showToast({
        ok: false,
        status: 'error',
        message: t('toasts.errorGeneric'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (org.userRole !== MemberRole.SUPERADMIN) {
    return <DeniedPage cause="refused" />;
  }

  return (
    <form className="admin-transfer" onSubmit={handleSubmit}>
      <h3>{t('organizations.pickNewAdminTitle')}</h3>
      {membersFiltered.length === 0 && <p>{t('organizations.nobodyToTransferTo')}</p>}
      {membersFiltered.length > 0 && (
        <div className="labeled-checkbox">
          <p>{t('organizations.pickAMember')}</p>
          <select name="newAdminId">
            {membersFiltered.map((member) => (
              <option
                key={member.id}
                value={member.id}
              >{`${member.firstName} ${member.lastName}`}</option>
            ))}
          </select>
        </div>
      )}
      <div className="yes-no">
        <button
          type="submit"
          className="little-button"
          aria-busy={isLoading || membersFiltered.length === 0}
          disabled={isLoading || membersFiltered.length === 0}
        >
          {isLoading ? t('common.deleting') : t('common.confirm')}
        </button>
        <button
          type="button"
          className="little-button"
          onClick={() => router.back()}
          aria-busy={isLoading}
          disabled={isLoading}
        >
          {t('common.cancel')}
        </button>
      </div>
    </form>
  );
};
