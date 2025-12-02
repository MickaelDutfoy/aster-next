/*
  Warnings:

  - You are about to drop the column `adopterName` on the `AnimalAdoption` table. All the data in the column will be lost.
  - Added the required column `adopterCity` to the `AnimalAdoption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adopterFullName` to the `AnimalAdoption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adopterZip` to the `AnimalAdoption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `families` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip` to the `families` table without a default value. This is not possible if the table is not empty.
  - Made the column `address` on table `families` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."AnimalAdoption" DROP COLUMN "adopterName",
ADD COLUMN     "adopterCity" TEXT NOT NULL,
ADD COLUMN     "adopterFullName" TEXT NOT NULL,
ADD COLUMN     "adopterZip" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."families" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "zip" TEXT NOT NULL,
ALTER COLUMN "address" SET NOT NULL;
