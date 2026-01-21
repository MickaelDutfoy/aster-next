import { AnimalHealthActType, AnimalStatus } from '@prisma/client';
import { getAnimalsRelatedToUser } from '../animals/getAnimalsRelatedToUser';
import { prisma } from '../prisma';
import { Animal, AnimalHealthAct } from '../types';
import { isOlderThan } from '../utils/isOlderThan';

export const generateUserPassiveNotifications = async (userEmail: string) => {
  const user = await prisma.member.findUnique({
    where: { email: userEmail },
    select: { id: true },
  });
  if (!user) return;

  const PRIME_VAX_REMINDER_DAYS = 21; // later, can use user.settings.preferences
  const VAX_REMINDER_DAYS = 335;

  const relatedAnimals: Animal[] = await getAnimalsRelatedToUser(user.id);

  for (const animal of relatedAnimals) {
    if (animal.status === AnimalStatus.ADOPTED) continue;

    const acts: AnimalHealthAct[] = animal.healthActs ?? [];
    const lastVaxAct = acts.find((act) => act.type === AnimalHealthActType.VACCINATION);

    if (!lastVaxAct) continue;

    const needsReminder =
      (lastVaxAct.isFirst && isOlderThan(lastVaxAct.date, PRIME_VAX_REMINDER_DAYS)) ||
      (!lastVaxAct.isFirst && isOlderThan(lastVaxAct.date, VAX_REMINDER_DAYS));

    if (!needsReminder) continue;

    try {
      await prisma.notification.create({
        data: {
          memberId: user.id,
          messageKey: 'notifications.animals.vaxReminder',
          messageParams: {
            animalName: animal.name,
          },
          href: `/animals/${animal.id}`,
          sourceKey: `animal:${animal.id}:vax:act:${lastVaxAct.date}`,
        },
      });
    } catch (err: any) {
      if (err?.code !== 'P2002') {
        console.error(err);
      }
    }
  }
};
