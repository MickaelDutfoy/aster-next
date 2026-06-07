/*
  Warnings:

  - You are about to drop the column `publicAnimalSheetFooter` on the `organizations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrganizationPublicPage" ADD COLUMN     "displayHealthInfo" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publicAnimalSheetFooter" TEXT;

-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "publicAnimalSheetFooter";
