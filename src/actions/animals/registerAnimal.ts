'use server';

import { getFamilyOfAnimal } from '@/lib/families/getFamilyOfAnimal';
import { getOrgAdmins } from '@/lib/organizations/getOrgAdmins';
import { isOrgMember } from '@/lib/permissions/isOrgMember';
import { prisma } from '@/lib/prisma';
import { ActionValidation } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { parseAnimalData } from './parseAnimalData';

export const registerAnimal = async (formData: FormData): Promise<ActionValidation> => {
  const guard = await isOrgMember();
  if (!guard.validation.ok) return guard.validation;
  if (!guard.org || !guard.user)
    return { ok: false, status: 'error', message: 'toasts.genericError' };

  const org = guard.org;
  const user = guard.user;

  const { animal, adopter, health } = await parseAnimalData(formData);

  if (!animal) {
    return { ok: false, status: 'error', message: 'toasts.requiredFieldsMissing' };
  }

  try {
    let animalId: number = 0;

    await prisma.$transaction(async (prismaTransaction) => {
      const res = await prismaTransaction.animal.create({
        data: {
          ...animal,
          orgId: org.id,
          createdByMemberId: user.id,
        },
      });

      animalId = res.id;

      if (health && health.length > 0) {
        await prismaTransaction.animalHealthAct.createMany({
          data: health.map((act) => ({
            ...act,
            animalId,
          })),
        });
      }

      if (adopter) {
        await prismaTransaction.animalAdoption.create({
          data: {
            ...adopter,
            animalId,
          },
        });
      }
    });

    const admins = await getOrgAdmins(org.id);

    for (const admin of admins) {
      if (admin.id === user.id) continue;

      try {
        await prisma.notification.create({
          data: {
            memberId: admin.id,
            messageKey: 'notifications.animals.createAnimal',
            messageParams: {
              memberFullName: `${user.firstName} ${user.lastName}`,
              animalName: animal.name,
            },
            href: animalId !== 0 ? `/animals/${animalId}` : null,
          },
        });
      } catch (err) {
        console.error(err);
      }
    }

    const family = await getFamilyOfAnimal(animalId);

    if (family) {
      for (const member of family.members) {
        if (member.id === user.id) continue;

        try {
          await prisma.notification.create({
            data: {
              memberId: member.id,
              messageKey: 'notifications.animals.createAnimal',
              messageParams: {
                memberFullName: `${user.firstName} ${user.lastName}`,
                animalName: animal.name,
              },
              href: animalId !== 0 ? `/animals/${animalId}` : null,
            },
          });
        } catch (err) {
          console.error(err);
        }
      }
    }

    revalidatePath('/animals');

    return { ok: true, status: 'success', message: 'toasts.animalAdd' };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 'error', message: 'toasts.genericError' };
  }
};
