import { Notification } from '@prisma/client';
import { prisma } from '../prisma';

export const getUserNotifications = async (userId: number): Promise<Notification[]> => {
  const notifs = await prisma.notification.findMany({
    where: { memberId: userId },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return notifs;
};
