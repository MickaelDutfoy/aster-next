-- AlterTable
ALTER TABLE "AnimalAdoption" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "animals" ADD COLUMN     "healthInformation" TEXT;
