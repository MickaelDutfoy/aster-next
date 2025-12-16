'use client';

import { approveOrgRequest } from '@/actions/organizations/approveOrgRequest';
import { cancelOrgRequest } from '@/actions/organizations/cancelOrgRequest';
import { leaveOrg } from '@/actions/organizations/leaveOrg';
import { removeMemberFromOrg } from '@/actions/organizations/removeMemberFromOrg';
import { Action, Member, MemberOfOrg, Organization } from '@/lib/types';
import { MemberRole, MemberStatus } from '@prisma/client';
import clsx from 'clsx';
import { EllipsisVertical } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { showToast } from '../providers/ToastProvider';

export const OrgMembersList = ({
  user,
  org,
  members,
}: {
  user: Member;
  org: Organization | null;
  members: MemberOfOrg[];
}) => {


  const t = useTranslations();

  const [openMenuMemberId, setOpenMenuMemberId] = useState<number | null>(null);
  const menuRef = useRef<HTMLUListElement | null>(null);

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

  const rolesAndStatusMap = {
    PENDING: 'En attente',
    VALIDATED: '',
    MEMBER: '',
    SUPERADMIN: 'Admin',
  };

  const handleApproveRequest = async (memberId: number, orgId: number) => {
    const res = await approveOrgRequest(memberId, orgId);
    setOpenMenuMemberId(null);
    showToast({
      ...res,
      message: res.message ? t(res.message) : undefined,
    });
  };

  const handleRemoveMember = async (memberId: number, orgId: number) => {
    const res = await removeMemberFromOrg(memberId, orgId);
    setOpenMenuMemberId(null);
    showToast({
      ...res,
      message: res.message ? t(res.message) : undefined,
    });
  };

  const handleCancelRequest = async (orgId: number) => {
    const res = await cancelOrgRequest(orgId);
    setOpenMenuMemberId(null);
    showToast({
      ...res,
      message: res.message ? t(res.message) : undefined,
    });
  };

  const handleLeaveOrg = async (orgId: number) => {
    const res = await leaveOrg(orgId);
    setOpenMenuMemberId(null);
    showToast({
      ...res,
      message: res.message ? t(res.message) : undefined,
    });
  };

  const buildActionsForMember = (
    member: MemberOfOrg,
    org: Organization,
    user: Member,
  ): Action[] => {
    const actions: Action[] = [];

    if (org.userRole === MemberRole.SUPERADMIN && member.status === MemberStatus.PENDING) {
      actions.push({
        name: t('organizations.actions.approveRequest'),
        handler: () => handleApproveRequest(member.id, org.id),
      });
    }

    if (
      org.userRole === MemberRole.SUPERADMIN &&
      member.role === MemberRole.MEMBER &&
      member.status !== MemberStatus.PENDING
    ) {
      actions.push({
        name: t('organizations.actions.removeMember'),
        handler: () => handleRemoveMember(member.id, org.id),
      });
    }

    if (user.id === member.id && member.status === MemberStatus.PENDING) {
      actions.push({
        name: t('organizations.actions.cancelRequest'),
        handler: () => handleCancelRequest(org.id),
      });
    }

    if (user.id === member.id && member.status === MemberStatus.VALIDATED) {
      actions.push({
        name: t('organizations.actions.leaveOrg'),
        handler: () => handleLeaveOrg(org.id),
      });
    }

    return actions;
  };

  if (!org || org.userStatus === MemberStatus.PENDING) {
    return;
  }

  return (
    <>
      <h3>{t('organizations.membersListTitle', { orgName: org.name })}</h3>

      <ul className="members-list">
        {members
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
                  {t(`organizations.roles.${member.role}`)}
                  {t(`organizations.status.${member.status}`)}
                </span>

                <span className="action">
                  <EllipsisVertical
                    className={clsx(actions.length === 0 ? 'disabled' : 'link')}
                    size={26}
                    onClick={() =>
                      actions.length > 0 &&
                      setOpenMenuMemberId((current) => (current === member.id ? null : member.id))
                    }
                  />

                  {openMenuMemberId === member.id && actions.length > 0 && (
                    <ul className="action-list" ref={menuRef}>
                      {actions.map((action) => (
                        <li key={action.name} onClick={action.handler}>
                          {action.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </span>
              </li>
            );
          })}
      </ul>
    </>
  );
};
