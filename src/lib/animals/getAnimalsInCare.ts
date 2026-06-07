import { AnimalStatus, MemberRole } from '@prisma/client';
import { prisma } from '../prisma';
import { AnimalWithoutDetails, Member, Organization } from '../types';

export const getAnimalsInCare = async (
  user: Member,
  org: Organization,
): Promise<AnimalWithoutDetails[]> => {
  const animals = await prisma.animal.findMany({
    where: {
      orgId: org.id,
      status: { in: [AnimalStatus.UNHOSTED, AnimalStatus.FOSTERED, AnimalStatus.IN_TRIAL] },
    },
    select: {
      id: true,
      name: true,
      species: true,
      sex: true,
      birthDate: true,
      status: true,
      updatedAt: true,
      imageKey: true,
      isPubliclyAdoptable: true,
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
      species: animal.species,
      sex: animal.sex,
      birthDate: animal.birthDate,
      status: animal.status,
      updatedAt: animal.updatedAt,
      imageKey: animal.imageKey,
      isPubliclyAdoptable: animal.isPubliclyAdoptable,
      publicDescription: animal.publicDescription,
      canUserEdit: isOrgAdmin || isAnimalSheetCreator || isRelatedToAnimal,
    };
  });
};
