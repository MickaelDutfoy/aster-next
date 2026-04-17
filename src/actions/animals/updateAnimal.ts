'use server';

import { getFamilyOfAnimal } from '@/lib/families/getFamilyOfAnimal';
import { getAnimalOrg } from '@/lib/organizations/getAnimalOrg';
import { getOrgAdmins } from '@/lib/organizations/getOrgAdmins';
import { isRelatedToAnimal } from '@/lib/permissions/isRelatedToAnimal';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { parseAnimalData } from './parseAnimalData';

export const updateAnimal = async (
  animalId: number,
  formData: FormData,
): Promise<ActionValidation> => {
  const guard = await isRelatedToAnimal(animalId);
  if (!guard.validation.ok) return guard.validation;
  if (!guard.user) {
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }

  const user = guard.user;

  const animalTrial = await prisma.animal.findUnique({
    where: { id: animalId },
    select: { trialDateStart: true },
  });

  const { animal, adopter, health, weightEntries, tests } = await parseAnimalData(
    formData,
    animalTrial?.trialDateStart ?? null,
  );

  if (!animal) {
    return { ok: false, status: 'error', message: 'toasts.requiredFieldsMissing' };
  }

  try {
    await prisma.$transaction(async (prismaTransaction) => {
      await prismaTransaction.member.update({
        where: { id: user.id },
        data: { favoriteSpecies: animal.species },
      });

      await prismaTransaction.animal.update({
        where: { id: animalId },
        data: {
          ...animal,
          updatedByMemberId: user.id,
        },
      });

      await prismaTransaction.animalHealthAct.deleteMany({
        where: {
          animalId,
        },
      });

      if (health.length > 0) {
        await prismaTransaction.animalHealthAct.createMany({
          data: health.map((act) => ({
            ...act,
            animalId,
          })),
        });
      }

      await prismaTransaction.animalWeightEntry.deleteMany({
        where: {
          animalId,
        },
      });

      if (weightEntries.length > 0) {
        await prismaTransaction.animalWeightEntry.createMany({
          data: weightEntries.map((entry) => ({
            ...entry,
            animalId,
          })),
        });
      }

      await prismaTransaction.animalTestEntry.deleteMany({
        where: { animalId },
      });

      if (tests.length > 0) {
        await prismaTransaction.animalTestEntry.createMany({
          data: tests.map((test) => ({
            ...test,
            animalId,
          })),
        });
      }

      const adoptSheet = await prismaTransaction.animalAdoption.findUnique({ where: { animalId } });

      if (!adoptSheet && adopter) {
        await prismaTransaction.animalAdoption.create({
          data: {
            animalId,
            ...adopter,
          },
        });
      } else if (!adopter) {
        await prismaTransaction.animalAdoption.deleteMany({
          where: { animalId },
        });
      } else {
        await prismaTransaction.animalAdoption.update({
          where: { animalId },
          data: {
            ...adopter,
          },
        });
      }
    });

    const org = await getAnimalOrg(animalId);
    const family = await getFamilyOfAnimal(animalId);

    const memberIdsToNotify = new Set<number>();

    if (org) {
      const admins = await getOrgAdmins(org.id);

      for (const admin of admins) {
        if (admin.id !== user.id) {
          memberIdsToNotify.add(admin.id);
        }
      }
    }

    if (family) {
      for (const member of family.members) {
        if (member.id !== user.id) {
          memberIdsToNotify.add(member.id);
        }
      }
    }

    const dayKey = new Date().toISOString().slice(0, 10);
    const sourceKey = `animal:${animalId}:edited:${dayKey}`;

    for (const memberId of memberIdsToNotify) {
      try {
        await prisma.notification.upsert({
          where: {
            memberId_sourceKey: {
              memberId,
              sourceKey,
            },
          },
          create: {
            memberId,
            messageKey: 'notifications.animals.editedAnimal',
            messageParams: {
              memberFullName: `${user.firstName} ${user.lastName}`,
              animalName: animal.name,
            },
            href: `/animals/${animalId}`,
            sourceKey,
          },
          update: {},
        });
      } catch (err) {
        console.error(err);
      }
    }

    revalidatePath(`/animals/${animalId}`);

    return { ok: true, status: 'success', message: 'toasts.modifySuccess' };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error', message: 'toasts.errorGeneric' };
  }
};
