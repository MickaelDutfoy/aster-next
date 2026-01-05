/*
  Warnings:

  - A unique constraint covering the columns `[organization_id,memberId]` on the table `families` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "AnimalAdoption" ADD COLUMN     "information" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "families_organization_id_memberId_key" ON "families"("organization_id", "memberId");
