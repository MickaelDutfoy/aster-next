import { prisma } from '../prisma';

export const getUnreadNotificationsCount = async (userId: number): Promise<number> => {
  const notifs = await prisma.notification.count({ where: { memberId: userId, readAt: null } });

  return notifs;
};
