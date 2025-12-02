/*
  Warnings:

  - Made the column `adopterEmail` on table `AnimalAdoption` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."AnimalAdoption" ALTER COLUMN "adopterEmail" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."animals" ADD COLUMN     "dewormHistory" TIMESTAMP(3)[],
ADD COLUMN     "vaxHistory" TIMESTAMP(3)[];
