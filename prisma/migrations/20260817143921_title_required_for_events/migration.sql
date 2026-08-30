/*
  Warnings:

  - Made the column `title` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "title" SET NOT NULL;
