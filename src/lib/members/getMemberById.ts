import { prisma } from '../prisma';
import { Member } from '../types';

export const getMemberById = async (memberId: number): Promise<Member | null> => {
  const member = await prisma.member.findUnique({
    where: { id: memberId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      phoneNumber: true,
      email: true,
    },
  });

  if (!member) return null;

  return member;
};
