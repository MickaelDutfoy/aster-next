/*
  Warnings:

  - You are about to drop the column `information` on the `AnimalHealthAct` table. All the data in the column will be lost.
  - Added the required column `date` to the `AnimalHealthAct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `AnimalHealthAct` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AnimalHealthActType" AS ENUM ('VACCINATION', 'DEWORM', 'ANTIFLEA');

-- AlterTable
ALTER TABLE "AnimalHealthAct" DROP COLUMN "information",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "date" DATE NOT NULL,
ADD COLUMN     "isFirst" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "type" "AnimalHealthActType" NOT NULL;

-- CreateIndex
CREATE INDEX "AnimalHealthAct_animalId_type_date_idx" ON "AnimalHealthAct"("animalId", "type", "date");

-- AddForeignKey
ALTER TABLE "AnimalHealthAct" ADD CONSTRAINT "AnimalHealthAct_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "animals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
