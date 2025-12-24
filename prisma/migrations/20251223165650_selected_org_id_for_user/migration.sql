-- AlterTable
ALTER TABLE "animals" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "members" ADD COLUMN     "selectedOrgId" INTEGER;
