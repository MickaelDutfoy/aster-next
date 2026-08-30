import { prisma } from '../prisma';
import { Calendar } from '../types';

export const getCalendarAndEventsByFamily = async (id: number): Promise<Calendar | null> => {
  const calendar = await prisma.calendar.findUnique({
    where: {
      familyId: id,
    },
    include: {
      events: {
        orderBy: {
          startsAt: 'asc',
        },
        include: {
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
      },
    },
  });

  if (!calendar) return null;

  return {
    ...calendar,
    events: calendar.events.map(({ participants, ...event }) => ({
      ...event,
      participants: participants.map(({ member }) => member),
    })),
  };
};
