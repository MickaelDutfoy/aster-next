/*
  Warnings:

  - You are about to drop the column `createdAt` on the `AnimalAdoption` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `AnimalAdoption` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "MemberRole" ADD VALUE 'FOSTER_FAMILY';
ALTER TYPE "MemberRole" ADD VALUE 'ADMIN';

-- AlterEnum
ALTER TYPE "MemberStatus" ADD VALUE 'BANNED';

-- AlterTable
ALTER TABLE "AnimalAdoption" DROP COLUMN "createdAt",
DROP COLUMN "notes";

-- AlterTable
ALTER TABLE "animals" ADD COLUMN     "createdByMemberId" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedByMemberId" INTEGER;

-- AlterTable
ALTER TABLE "families" ADD COLUMN     "memberId" INTEGER;

-- AddForeignKey
ALTER TABLE "families" ADD CONSTRAINT "families_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;
