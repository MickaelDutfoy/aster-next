-- AlterEnum
ALTER TYPE "AnimalStatus" ADD VALUE 'REUNITED_WITH_OWNER';

-- AlterTable
ALTER TABLE "animals" ADD COLUMN     "isReserved" BOOLEAN NOT NULL DEFAULT false;
