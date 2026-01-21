/*
  Warnings:

  - You are about to drop the column `dewormHistory` on the `animals` table. All the data in the column will be lost.
  - You are about to drop the column `is_first_deworm` on the `animals` table. All the data in the column will be lost.
  - You are about to drop the column `is_primo_vax` on the `animals` table. All the data in the column will be lost.
  - You are about to drop the column `last_deworm` on the `animals` table. All the data in the column will be lost.
  - You are about to drop the column `last_vax` on the `animals` table. All the data in the column will be lost.
  - You are about to drop the column `vaxHistory` on the `animals` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "animals" DROP COLUMN "dewormHistory",
DROP COLUMN "is_first_deworm",
DROP COLUMN "is_primo_vax",
DROP COLUMN "last_deworm",
DROP COLUMN "last_vax",
DROP COLUMN "vaxHistory";
