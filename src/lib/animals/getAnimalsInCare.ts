import { AnimalStatus, MemberRole } from '@prisma/client';
import { prisma } from '../prisma';
import { AnimalPublicSetup, Member, Organization } from '../types';

export const getAnimalsInCare = async (
  user: Member,
  org: Organization,
): Promise<AnimalPublicSetup[]> => {
  const animals = await prisma.animal.findMany({
    where: {
      orgId: org.id,
      status: { in: [AnimalStatus.UNHOSTED, AnimalStatus.FOSTERED, AnimalStatus.IN_TRIAL] },
    },
    select: {
      id: true,
      name: true,
      status: true,
      updatedAt: true,
      imageKey: true,
      isPubliclyAdoptable: true,
      isReserved: true,
      publicDescription: true,
      createdByMemberId: true,
      family: {
        select: {
          members: {
            select: {
              memberId: true,
            },
          },
        },
      },
    },
  });

  const isOrgAdmin = org.userRole === MemberRole.SUPERADMIN || org.userRole === MemberRole.ADMIN;

  return animals.map((animal) => {
    const isAnimalSheetCreator = animal.createdByMemberId === user.id;

    const isRelatedToAnimal =
      animal.family?.members.some((member) => member.memberId === user.id) ?? false;

    return {
      id: animal.id,
      name: animal.name,
      status: animal.status,
      updatedAt: animal.updatedAt,
      imageKey: animal.imageKey,
      isPubliclyAdoptable: animal.isPubliclyAdoptable,
      isReserved: animal.isReserved,
      publicDescription: animal.publicDescription,
      canUserEdit: isOrgAdmin || isAnimalSheetCreator || isRelatedToAnimal,
    };
  });
};
