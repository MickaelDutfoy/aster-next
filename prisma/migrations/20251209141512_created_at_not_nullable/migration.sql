/*
  Warnings:

  - You are about to drop the column `created_at` on the `AuthToken` table. All the data in the column will be lost.
  - Made the column `createdAt` on table `AnimalAdoption` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `animals` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `families` required. This step will fail if there are existing NULL values in that column.
  - Made the column `joined_at` on table `member_organization` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `members` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `organizations` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AnimalAdoption" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "AuthToken" DROP COLUMN "created_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "animals" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "families" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "member_organization" ALTER COLUMN "joined_at" SET NOT NULL,
ALTER COLUMN "joined_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "members" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);
