'use server';

import { isAdminOfOrg } from '@/lib/permissions/isAdminOfOrg';
import { isMemberOfFamily } from '@/lib/permissions/isMemberOfFamily';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export const deleteFamilyEvent = async (eventId: number): Promise<ActionValidation> => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      participants: {
        select: {
          memberId: true,
        },
      },
      calendar: {
        select: {
          family: {
            select: {
              id: true,
              orgId: true,
            },
          },
        },
      },
    },
  });

  if (!event || !event.calendar.family) {
    return {
      ok: false,
      status: 'error',
      message: 'toasts.errorGeneric',
    };
  }

  const memberGuard = await isMemberOfFamily(event.calendar.family.id);
  const adminGuard = await isAdminOfOrg(event.calendar.family.orgId);

  if (!memberGuard.validation.ok && !adminGuard.validation.ok) return memberGuard.validation;

  const user = memberGuard.user ?? adminGuard.user;

  if (!user) {
    return { ok: false, status: 'error', message: 'toasts.notAllowed' };
  }

  if (
    !event.participants.some((participant) => participant.memberId === user.id) &&
    !adminGuard.validation.ok
  ) {
    return { ok: false, status: 'error', message: 'toasts.notAllowed' };
  }

  try {
    await prisma.event.delete({
      where: { id: eventId },
    });

    revalidatePath(`/families/${event.calendar.family.id}`);

    return { ok: true, status: 'success', message: 'toasts.presenceDeleted' };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
      status: 'error',
      message: 'toasts.errorGeneric',
    };
  }
};
