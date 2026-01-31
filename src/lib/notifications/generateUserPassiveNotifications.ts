'use server';

import { AnimalHealthActType, AnimalStatus } from '@prisma/client';
import { getAnimalsRelatedToUser } from '../animals/getAnimalsRelatedToUser';
import { prisma } from '../prisma';
import { Animal, AnimalHealthAct, Member } from '../types';
import { isOlderThan } from '../utils/isOlderThan';

export const generateUserPassiveNotifications = async (user: Member) => {
  const PRIME_VAX_REMINDER_DAYS = 21;
  const VAX_REMINDER_DAYS = 335;
  const NEUTRALIZE_REMINDER_DAYS = 183;

  const relatedAnimals: Animal[] = await getAnimalsRelatedToUser(user.id);

  for (const animal of relatedAnimals) {
    if (
      isOlderThan(animal.birthDate, NEUTRALIZE_REMINDER_DAYS) &&
      ['Chat', 'Cat', 'Katt'].includes(animal.species) &&
      !animal.isNeutered
    ) {
      try {
        await prisma.notification.upsert({
          where: {
            memberId_sourceKey: {
              memberId: user.id,
              sourceKey: `animal:${animal.id}:neutralize`,
            },
          },
          create: {
            memberId: user.id,
            messageKey: 'notifications.animals.neutralizeReminder',
            messageParams: { animalName: animal.name },
            href: `/animals/${animal.id}`,
            sourceKey: `animal:${animal.id}:neutralize`,
          },
          update: {},
        });
      } catch (err) {
        console.error(err);
      }
    }

    if (animal.status === AnimalStatus.ADOPTED) continue;

    const acts: AnimalHealthAct[] = animal.healthActs ?? [];
    const lastVaxAct = acts.find((act) => act.type === AnimalHealthActType.VACCINATION);

    if (!lastVaxAct) continue;

    const needsVaxReminder =
      (lastVaxAct.isFirst && isOlderThan(lastVaxAct.date, PRIME_VAX_REMINDER_DAYS)) ||
      (!lastVaxAct.isFirst && isOlderThan(lastVaxAct.date, VAX_REMINDER_DAYS));

    if (!needsVaxReminder) continue;

    try {
      await prisma.notification.upsert({
        where: {
          memberId_sourceKey: {
            memberId: user.id,
            sourceKey: `animal:${animal.id}:vax:act:${lastVaxAct.date}`,
          },
        },
        create: {
          memberId: user.id,
          messageKey: 'notifications.animals.vaxReminder',
          messageParams: { animalName: animal.name },
          href: `/animals/${animal.id}`,
          sourceKey: `animal:${animal.id}:vax:act:${lastVaxAct.date}`,
        },
        update: {},
      });
    } catch (err) {
      console.error(err);
    }
  }
};
