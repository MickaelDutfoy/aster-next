'use client';

import { approveOrgRequest } from '@/actions/organizations/approveOrgRequest';
import { cancelOrgRequest } from '@/actions/organizations/cancelOrgRequest';
import { downgradeToMember } from '@/actions/organizations/downgradeToMember';
import { leaveOrg } from '@/actions/organizations/leaveOrg';
import { promoteAdminOfOrg } from '@/actions/organizations/promoteAdminOfOrg';
import { removeMemberFromOrg } from '@/actions/organizations/removeMemberFromOrg';
import { Link, useRouter } from '@/i18n/routing';
import { Action, Member, MemberOfOrg, Organization } from '@/lib/types';
import { MemberRole, MemberStatus } from '@prisma/client';
import clsx from 'clsx';
import { EllipsisVertical, SquareArrowRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { ConfirmModal } from '../tools/ConfirmModal';
import { showToast } from '../tools/ToastProvider';

export const OrgMembersList = ({
  user,
  org,
  members,
}: {
  user: Member;
  org: Organization;
  members: MemberOfOrg[];
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const [hiddenRolesInfo, setHiddenRolesInfo] = useState<boolean>(true);
  const [openMenuMemberId, setOpenMenuMemberId] = useState<number | null>(null);
  const [actionConfirm, setActionConfirm] = useState<Action | null>(null);
  const [nameFilter, setNameFilter] = useState<string>('');

  const menuRef = useRef<HTMLUListElement | null>(null);

  const isUserPending = members.some(
    (member) => member.id === user.id && member.status === MemberStatus.PENDING,
  );
  const isUserSuperAdmin = members.some(
    (member) => member.id === user.id && member.role === MemberRole.SUPERADMIN,
  );
  const isUserAdmin =
    members.some((member) => member.id === user.id && member.role === MemberRole.ADMIN) ||
    isUserSuperAdmin;

  console.log(isUserSuperAdmin);

  const membersFiltered: MemberOfOrg[] = isUserPending
    ? members.filter((member) => member.role === MemberRole.SUPERADMIN || member.id === user.id)
    : members;

  useEffect(() => {
    if (!openMenuMemberId) return;

    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuMemberId(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [openMenuMemberId]);

  const handleApproveRequest = async (member: MemberOfOrg, org: Organization, locale: string) => {
    const res = await approveOrgRequest(member.id, org.id, locale);
    setOpenMenuMemberId(null);
    setActionConfirm(null);
    showToast({
      ...res,
      message: res.message ? t(res.message) : undefined,
    });
  };

  const handleRemoveMember = async (memberId: number, orgId: number) => {
    const res = await removeMemberFromOrg(memberId, orgId);
    setOpenMenuMemberId(null);
    setActionConfirm(null);
    showToast({
      ...res,
      message: res.message ? t(res.message) : undefined,
    });
  };

  const handleCancelRequest = async (orgId: number) => {
    const res = await cancelOrgRequest(orgId);
    setOpenMenuMemberId(null);
    setActionConfirm(null);
    router.replace(`/organizations`);
    showToast({
      ...res,
      message: res.message ? t(res.message) : undefined,
    });
  };

  const handleLeaveOrg = async (orgId: number) => {
    const res = await leaveOrg(orgId);
    setOpenMenuMemberId(null);
    setActionConfirm(null);
    router.replace(`/organizations`);
    showToast({
      ...res,
      message: res.message ? t(res.message) : undefined,
    });
  };

  const handlePromoteAdmin = async (memberId: number, orgId: number) => {
    const res = await promoteAdminOfOrg(memberId, orgId);
    setOpenMenuMemberId(null);
    setActionConfirm(null);
    showToast({
      ...res,
      message: res.message ? t(res.message) : undefined,
    });
  };

  const handleDowngradeMember = async (memberId: number, orgId: number) => {
    const res = await downgradeToMember(memberId, orgId);
    setOpenMenuMemberId(null);
    setActionConfirm(null);
    showToast({
      ...res,
      message: res.message ? t(res.message) : undefined,
    });
  };

  const handleTransferSuperAdmin = async () => {
    setOpenMenuMemberId(null);
    setActionConfirm(null);
    router.push(`/organizations/${org?.id}/transfer-superadmin`);
  };

  const buildActionsForMember = (
    member: MemberOfOrg,
    org: Organization,
    user: Member,
  ): Action[] => {
    const actions: Action[] = [];

    if (isUserAdmin && member.status === MemberStatus.PENDING) {
      actions.push({
        id: 'approveRequest',
        name: t('organizations.actions.approveRequest'),
        handler: () => handleApproveRequest(member, org, locale),
      });
    }

    if (
      isUserSuperAdmin &&
      member.role !== MemberRole.SUPERADMIN &&
      member.status !== MemberStatus.PENDING
    ) {
      actions.push({
        id: 'removeMember',
        name: t('organizations.actions.removeMember'),
        handler: () => handleRemoveMember(member.id, org.id),
      });
    }

    if (user.id === member.id && member.status === MemberStatus.PENDING) {
      actions.push({
        id: 'cancelRequest',
        name: t('organizations.actions.cancelRequest'),
        handler: () => handleCancelRequest(org.id),
      });
    }

    if (
      user.id === member.id &&
      member.status === MemberStatus.VALIDATED &&
      member.role !== MemberRole.SUPERADMIN
    ) {
      actions.push({
        id: 'leaveOrg',
        name: t('organizations.actions.leaveOrg'),
        handler: () => handleLeaveOrg(org.id),
      });
    }

    if (
      isUserSuperAdmin &&
      member.role === MemberRole.MEMBER &&
      member.status !== MemberStatus.PENDING
    ) {
      actions.push({
        id: 'promoteAdmin',
        name: t('organizations.actions.promoteAdmin'),
        handler: () => handlePromoteAdmin(member.id, org.id),
      });
    }

    if (isUserSuperAdmin && member.role === MemberRole.ADMIN) {
      actions.push({
        id: 'downgradeMember',
        name: t('organizations.actions.downgradeMember'),
        handler: () => handleDowngradeMember(member.id, org.id),
      });
    }

    if (user.id === member.id && member.role === MemberRole.SUPERADMIN) {
      actions.push({
        id: 'transferSuperAdmin',
        name: t('organizations.actions.transferSuperAdmin'),
        handler: () => handleTransferSuperAdmin(),
      });
    }

    return actions;
  };

  return (
    <>
      {actionConfirm && (
        <ConfirmModal onCancel={() => setActionConfirm(null)} action={actionConfirm} />
      )}
      <div className={clsx(isUserSuperAdmin ? 'links-box' : 'links-box disabled')}>
        <Link href={`/organizations/${org.id}/delete`} className="little-button">
          {t('organizations.deleteTitle')}
        </Link>
        <Link href={`/organizations/${org.id}/edit`} className="little-button">
          {t('organizations.editInfoTitle')}
        </Link>
      </div>

      <button className="collapse-expand" onClick={() => setHiddenRolesInfo(!hiddenRolesInfo)}>
        {t('organizations.rolesDefinitions')} {hiddenRolesInfo ? '▸' : '▾'}
      </button>
      {!hiddenRolesInfo && (
        <ul className="roles-reminder">
          <li>
            <strong>{t('organizations.member')}</strong>
            {t('organizations.memberDescription')}
          </li>
          <li>
            <strong>{t('organizations.roles.ADMIN')}</strong>
            {t('organizations.adminDescription')}
          </li>
          <li>
            <strong>{t('organizations.roles.SUPERADMIN')}</strong>
            {t('organizations.superAdminDescription')}
          </li>
        </ul>
      )}
      {membersFiltered.length > 0 && (
        <div className="search-filter">
          <p>{t('common.nameFilter')}</p>
          <input
            type="text"
            placeholder={t('common.name')}
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </div>
      )}
      <h3>
        {t('organizations.membersListTitle', {
          orgName: org.name,
          count: members.filter((member) =>
            (member.firstName + ' ' + member.lastName)
              .toLowerCase()
              .includes(nameFilter.toLowerCase()),
          ).length,
        })}
      </h3>
      <ul className="members-list">
        {membersFiltered
          .filter((member) =>
            (member.firstName + ' ' + member.lastName)
              .toLowerCase()
              .includes(nameFilter.toLowerCase()),
          )
          .sort((a, b) =>
            a.firstName.localeCompare(b.firstName, undefined, {
              sensitivity: 'base',
            }),
          )
          .map((member) => {
            const actions = buildActionsForMember(member, org, user);
            return (
              <li key={member.id}>
                <span>
                  {member.firstName} {member.lastName}
                </span>
                <span>
                  {t(`organizations.roles.${member.role}`) +
                    ' ' +
                    t(`organizations.status.${member.status}`)}
                </span>
                <div className="buttons">
                  <span className="action">
                    <EllipsisVertical
                      className={clsx(actions.length === 0 ? 'disabled' : 'link')}
                      size={26}
                      onClick={() => {
                        if (actions.length === 0) return;
                        setOpenMenuMemberId((current) =>
                          current === member.id ? null : member.id,
                        );
                      }}
                    />
                    {openMenuMemberId === member.id && actions.length > 0 && (
                      <ul className="action-list" ref={menuRef}>
                        {actions.map((action) => (
                          <li
                            key={action.name}
                            onClick={
                              action.id === 'transferSuperAdmin'
                                ? action.handler
                                : () => {
                                    setOpenMenuMemberId(null);
                                    setActionConfirm(action);
                                  }
                            }
                          >
                            {action.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </span>
                  <SquareArrowRight
                    className="link"
                    size={26}
                    onClick={() => router.push(`/members/${member.id}`)}
                  />
                </div>
              </li>
            );
          })}
      </ul>
      {isUserPending && <p className="long-notice">{t('organizations.hiddenOrgMembers')}</p>}
    </>
  );
};
