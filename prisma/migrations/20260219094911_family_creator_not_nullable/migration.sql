/*
  Warnings:

  - Made the column `createdByMemberId` on table `families` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "families" ALTER COLUMN "createdByMemberId" SET NOT NULL;
