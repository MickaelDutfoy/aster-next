'use client';

import { updateFamilyMembers } from '@/actions/families/updateFamilyMembers';
import { useRouter } from '@/i18n/routing';
import { Family, MemberOfFamily, MemberOfOrg } from '@/lib/types';
import { MemberStatus } from '@prisma/client';
import { CircleMinus, CirclePlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { showToast } from '../tools/ToastProvider';

export const ManageFamilyMembers = ({
  orgMembers,
  family,
}: {
  orgMembers: MemberOfOrg[];
  family: Family;
}) => {
  const t = useTranslations();
  const router = useRouter();

  const familyMembersIds = family.members.map((member) => member.id);
  const initialAdminMemberIds = family.members
    .filter((member) => member.role !== 'MEMBER')
    .map((member) => member.id);


  const [isLoading, setIsLoading] = useState(false);
  const [actualMembers, setActualMembers] = useState<MemberOfFamily[]>(family.members);
  const [elligibleMembers, setElligibleMembers] = useState<MemberOfFamily[]>(
    orgMembers
      .filter((member) => member.status === MemberStatus.VALIDATED)
      .filter((member) => !familyMembersIds.includes(member.id)),
  );

  const removeMember = (memberToRemove: MemberOfFamily) => {
    setActualMembers(actualMembers.filter((member) => member.id !== memberToRemove.id));
    setElligibleMembers([...elligibleMembers, memberToRemove]);
  };

  const addMember = (memberToAdd: MemberOfFamily) => {
    setElligibleMembers(elligibleMembers.filter((member) => member.id !== memberToAdd.id));
    setActualMembers([...actualMembers, memberToAdd]);
  };

  const canRemoveMember = (member: MemberOfFamily) => {
    if (initialAdminMemberIds.includes(member.id)) return false;

    return true;
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const res = await updateFamilyMembers(
        family.id,
        actualMembers.map((member) => member.id),
      );
      showToast({
        ...res,
        message: res.message ? t(res.message) : undefined,
      });
      if (res.ok) router.replace(`/families/${family.id}`);
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

  return (
    <form className="families-member-manage" onSubmit={handleSubmit}>
      <h3>{t('families.manageMembers')}</h3>
      <div>
        <h4>{t('families.currentMembersTitle')}</h4>
        <ul>
          {actualMembers.map((member) => (
            <li key={member.id}>
              <p>{member.firstName + ' ' + member.lastName}</p>
              {canRemoveMember(member) && (
                <CircleMinus onClick={() => removeMember(member)} className="link" size={26} />
              )}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4>{t('families.elligibleMembersTitle')}</h4>
        <ul>
          {elligibleMembers.map((member) => (
            <li key={member.id}>
              <p>{member.firstName + ' ' + member.lastName}</p>
              <CirclePlus onClick={() => addMember(member)} className="link" size={26} />
            </li>
          ))}
        </ul>
      </div>
      <div className="yes-no">
        <button type="submit" className="little-button" aria-busy={isLoading} disabled={isLoading}>
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
