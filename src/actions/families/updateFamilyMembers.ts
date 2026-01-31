'use server';

import { isFamilyMember } from '@/lib/permissions/isFamilyMember';
import { isOrgAdmin } from '@/lib/permissions/isOrgAdmin';
import { prisma } from '@/lib/prisma';
import { ActionValidation, Member } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export const updateFamilyMembers = async (
  familyId: number,
  newMembersIds: number[],
): Promise<ActionValidation> => {
  const family = await prisma.family.findUnique({
    where: {
      id: familyId,
    },
    select: { contactFullName: true, orgId: true },
  });

  const previousMembers = await prisma.familyMember.findMany({
    where: { familyId },
    select: { memberId: true },
  });

  const previousMembersIds = previousMembers.map((link) => link.memberId);

  if (!family) {
    return { ok: false, status: 'error', message: 'toasts.genericError' };
  }

  const adminGuard = await isOrgAdmin(family.orgId);

  let user: Member;

  if (adminGuard.validation.ok) {
    user = adminGuard.user as Member;
  } else {
    const memberGuard = await isFamilyMember(familyId);
    if (!memberGuard.validation.ok) return memberGuard.validation;

    user = memberGuard.user as Member;

    const removedMemberIds = previousMembersIds.filter((id) => !newMembersIds.includes(id));

    if (removedMemberIds.length > 0) {
      const removedAdmin = await prisma.memberOrganization.findFirst({
        where: {
          orgId: family.orgId,
          memberId: { in: removedMemberIds },
          role: { in: ['ADMIN', 'SUPERADMIN'] },
        },
        select: { memberId: true },
      });

      if (removedAdmin) {
        return {
          ok: false,
          status: 'error',
          message: 'toasts.cannotRemoveAdminsFromFamily',
        };
      }
    }
  }

  try {
    await prisma.$transaction(async (prismaTransaction) => {
      if (newMembersIds.length === 0) {
        await prismaTransaction.familyMember.deleteMany({ where: { familyId } });
      } else {
        await prismaTransaction.familyMember.deleteMany({
          where: { familyId, memberId: { notIn: newMembersIds } },
        });
      }

      await prismaTransaction.familyMember.createMany({
        data: newMembersIds.map((memberId) => ({ familyId, memberId })),
        skipDuplicates: true,
      });
    });

    const membersToNotifyIds = newMembersIds.filter((id) => !previousMembersIds.includes(id));

    for (const memberId of membersToNotifyIds) {
      if (memberId === user.id) continue;

      try {
        const dayKey = new Date().toISOString().slice(0, 10);
        const sourceKey = `family:${familyId}:member:added:${memberId}:${dayKey}`;

        await prisma.notification.upsert({
          where: {
            memberId_sourceKey: {
              memberId,
              sourceKey,
            },
          },
          create: {
            memberId,
            messageKey: 'notifications.families.addedToFamily',
            messageParams: {
              memberFullName: `${user.firstName} ${user.lastName}`,
              familyName: family.contactFullName,
            },
            href: `/families/${familyId}`,
            sourceKey,
          },
          update: {},
        });
      } catch (err) {
        console.error(err);
      }
    }

    revalidatePath(`/families/${familyId}`);

    return { ok: true, status: 'success', message: 'toasts.modifySuccess' };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error', message: 'toasts.genericError' };
  }
};
