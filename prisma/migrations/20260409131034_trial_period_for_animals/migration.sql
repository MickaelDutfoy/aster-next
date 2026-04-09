-- AlterEnum
ALTER TYPE "AnimalStatus" ADD VALUE 'IN_TRIAL';

-- AlterTable
ALTER TABLE "animals" ADD COLUMN     "trialDateStart" TIMESTAMP(3);
