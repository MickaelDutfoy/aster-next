/*
  Warnings:

  - The values [FOSTER_FAMILY] on the enum `MemberRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `created_at` on the `families` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MemberRole_new" AS ENUM ('MEMBER', 'ADMIN', 'SUPERADMIN');
ALTER TABLE "member_organization" ALTER COLUMN "role" TYPE "MemberRole_new" USING ("role"::text::"MemberRole_new");
ALTER TYPE "MemberRole" RENAME TO "MemberRole_old";
ALTER TYPE "MemberRole_new" RENAME TO "MemberRole";
DROP TYPE "public"."MemberRole_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "families" DROP CONSTRAINT "families_memberId_fkey";

-- DropIndex
DROP INDEX "families_organization_id_memberId_key";

-- AlterTable
ALTER TABLE "families" DROP COLUMN "created_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdByMemberId" INTEGER;

-- CreateTable
CREATE TABLE "FamilyMember" (
    "familyId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FamilyMember_pkey" PRIMARY KEY ("familyId","memberId")
);

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
