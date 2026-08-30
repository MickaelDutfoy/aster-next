'use server';

import { isAdminOfOrg } from '@/lib/permissions/isAdminOfOrg';
import { isMemberOfFamily } from '@/lib/permissions/isMemberOfFamily';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { Temporal } from 'temporal-polyfill';

export const updateFamilyEvent = async (
  eventId: number,
  formData: FormData,
): Promise<ActionValidation> => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      participants: true,
    },
  });

  if (!event) {
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }

  const memberId = Number(formData.get('memberId'));

  const family = await prisma.family.findFirst({
    where: {
      calendar: { id: event.calendarId },
      members: {
        some: { memberId },
      },
    },
    select: { id: true, orgId: true },
  });

  if (!family) {
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }

  const memberGuard = await isMemberOfFamily(family.id);
  const adminGuard = await isAdminOfOrg(family.orgId);

  if (!memberGuard.validation.ok && !adminGuard.validation.ok) return memberGuard.validation;

  const user = memberGuard.user ?? adminGuard.user;
  if (!user) {
    return { ok: false, status: 'error', message: 'toasts.notAllowed' };
  }

  if (
    !adminGuard.validation.ok &&
    (memberId !== user.id ||
      !event.participants.some((participant) => participant.memberId === user.id))
  ) {
    return adminGuard.validation;
  }

  const eventStartDate = formData.get('eventStartDate')?.toString();
  const eventEndDate = formData.get('eventEndDate')?.toString();
  const eventStartTime = formData.get('eventStartTime')?.toString();
  const eventEndTime = formData.get('eventEndTime')?.toString();
  const eventNotes = formData.get('eventNotes')?.toString().trim() || null;
  const eventTimeZone = formData.get('eventTimeZone')?.toString();

  if (!eventStartDate || !eventStartTime || !eventEndDate || !eventEndTime || !eventTimeZone) {
    return {
      ok: false,
      status: 'error',
      message: 'toasts.errorGeneric',
    };
  }

  let startsAt: Date;
  let endsAt: Date;

  try {
    const startDate = Temporal.PlainDate.from(eventStartDate);
    const endDate = Temporal.PlainDate.from(eventEndDate);

    const startInstant = startDate
      .toZonedDateTime({
        timeZone: eventTimeZone,
        plainTime: Temporal.PlainTime.from(eventStartTime),
      })
      .toInstant();

    const endInstant = endDate
      .toZonedDateTime({
        timeZone: eventTimeZone,
        plainTime: Temporal.PlainTime.from(eventEndTime),
      })
      .toInstant();

    if (Temporal.Instant.compare(startInstant, endInstant) >= 0) {
      return {
        ok: false,
        status: 'error',
        message: 'toasts.errorGeneric',
      };
    }

    startsAt = new Date(startInstant.epochMilliseconds);
    endsAt = new Date(endInstant.epochMilliseconds);
  } catch {
    return {
      ok: false,
      status: 'error',
      message: 'toasts.errorGeneric',
    };
  }

  const member = await prisma.member.findUnique({
    where: { id: memberId },
    select: { firstName: true, lastName: true },
  });

  if (!member) {
    return {
      ok: false,
      status: 'error',
      message: 'toasts.errorGeneric',
    };
  }

  try {
    await prisma.event.update({
      where: { id: eventId },
      data: {
        title: `${member.firstName} ${member.lastName}`,
        description: eventNotes,
        startsAt,
        endsAt,
        participants: {
          deleteMany: {},
          create: {
            memberId,
          },
        },
      },
    });

    revalidatePath(`/families/${family.id}`);

    return { ok: true, status: 'success', message: 'toasts.presenceEdited' };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
      status: 'error',
      message: 'toasts.errorGeneric',
    };
  }
};
