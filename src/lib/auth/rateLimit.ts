import { prisma } from '@/lib/prisma';

export const checkRateLimit = async (
  key: string,
  maxAttempts: number,
  windowMs: number,
): Promise<boolean> => {
  const now = new Date();

  const existing = await prisma.rateLimit.findUnique({
    where: { key },
  });

  if (!existing) {
    await prisma.rateLimit.create({
      data: {
        key,
        count: 1,
        lastAttemptAt: now,
      },
    });
    return true;
  }

  const timeDiff = now.getTime() - existing.lastAttemptAt.getTime();

  if (timeDiff > windowMs) {
    await prisma.rateLimit.update({
      where: { key },
      data: {
        count: 1,
        lastAttemptAt: now,
      },
    });
    return true;
  }

  if (existing.count >= maxAttempts) {
    return false;
  }

  await prisma.rateLimit.update({
    where: { key },
    data: {
      count: existing.count + 1,
      lastAttemptAt: now,
    },
  });

  return true;
};
