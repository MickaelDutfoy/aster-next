-- AlterEnum
ALTER TYPE "AnimalStatus" ADD VALUE 'RELEASED';

-- AlterTable
ALTER TABLE "families" ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "members" ADD COLUMN     "lastKnownLocale" TEXT,
ADD COLUMN     "lastSeenAt" TIMESTAMP(3);
