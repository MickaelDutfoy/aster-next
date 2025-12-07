'use client';

import { approveOrgRequest } from '@/actions/organizations/approveOrgRequest';
import { cancelOrgRequest } from '@/actions/organizations/cancelOrgRequest';
import { removeMemberFromOrg } from '@/actions/organizations/removeMemberFromOrg';
import { Member, MemberOfOrg, Organization } from '@/lib/types';
import { MemberRole, MemberStatus } from '@prisma/client';
import clsx from 'clsx';
import { EllipsisVertical } from 'lucide-react';
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
    showToast(res);
  };

  const handleRemoveMember = async (memberId: number, orgId: number) => {
    const res = await removeMemberFromOrg(memberId, orgId);
    setOpenMenuMemberId(null);
    showToast(res);
  };

  const handleCancelRequest = async (orgId: number) => {
    const res = await cancelOrgRequest(orgId);
    setOpenMenuMemberId(null);
    showToast(res);
  };

  if (!org) {
    return <></>;
  }

  return (
    <>
      <h3>Liste des membres pour {org.name} :</h3>
      <ul className="members-list">
        {members.map((member) => (
          <li key={member.id}>
            <span>
              {member.firstName} {member.lastName}
            </span>
            <span>
              {rolesAndStatusMap[member.role]}
              {rolesAndStatusMap[member.status]}
            </span>

            <span className="action">
              <EllipsisVertical
                className={clsx(
                  member.role === MemberRole.SUPERADMIN ||
                    (member.id !== user.id && org.userStatus === MemberStatus.PENDING)
                    ? 'disabled'
                    : 'link',
                )}
                size={26}
                onClick={() =>
                  setOpenMenuMemberId((current) => (current === member.id ? null : member.id))
                }
              />

              {openMenuMemberId === member.id && (
                <ul className="action-list" ref={menuRef}>
                  {org.userRole === MemberRole.SUPERADMIN &&
                    member.status === MemberStatus.PENDING && (
                      <li onClick={() => handleApproveRequest(member.id, org.id)}>
                        Valider la demande
                      </li>
                    )}
                  {org.userRole === MemberRole.SUPERADMIN &&
                    member.role === MemberRole.MEMBER &&
                    member.status !== MemberStatus.PENDING && (
                      <li onClick={() => handleRemoveMember(member.id, org.id)}>
                        Supprimer ce membre
                      </li>
                    )}
                  {user.id === member.id && member.status === MemberStatus.PENDING && (
                    <li onClick={() => handleCancelRequest(org.id)}>Annuler la demande</li>
                  )}
                </ul>
              )}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
};
