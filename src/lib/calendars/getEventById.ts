import { prisma } from '../prisma';
import { Event } from '../types';

export const getEventById = async (eventId: number): Promise<Event | null> => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      id: true,
      calendarId: true,
      type: true,
      title: true,
      description: true,
      startsAt: true,
      endsAt: true,
      createdByMemberId: true,
      participants: {
        include: {
          member: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
      },
    },
  });

  if (!event) return null;

  return { ...event, participants: event?.participants.map(({ member }) => member) };
};
