/*
  Warnings:

  - Added the required column `hasChildren` to the `families` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."families" ADD COLUMN     "hasChildren" BOOLEAN NOT NULL,
ADD COLUMN     "otherAnimals" TEXT,
ALTER COLUMN "phone_number" DROP NOT NULL;
