/*
  Warnings:

  - The `status` column on the `animals` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."AnimalStatus" AS ENUM ('UNHOSTED', 'FOSTERED', 'ADOPTED');

-- AlterTable
ALTER TABLE "public"."animals" DROP COLUMN "status",
ADD COLUMN     "status" "public"."AnimalStatus" NOT NULL DEFAULT 'UNHOSTED';

-- CreateTable
CREATE TABLE "public"."AnimalAdoption" (
    "id" SERIAL NOT NULL,
    "animalId" INTEGER NOT NULL,
    "adopterName" TEXT NOT NULL,
    "adopterEmail" TEXT,
    "adopterPhoneNumber" TEXT NOT NULL,
    "adopterAddress" TEXT NOT NULL,
    "homeVisitDone" BOOLEAN NOT NULL DEFAULT false,
    "knowledgeCertSignedAt" DATE,
    "neuteringPlannedAt" DATE,
    "adoptionContractSignedAt" DATE,
    "adoptionFeePaid" BOOLEAN NOT NULL DEFAULT false,
    "legalTransferAt" DATE,
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnimalAdoption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnimalAdoption_animalId_key" ON "public"."AnimalAdoption"("animalId");

-- AddForeignKey
ALTER TABLE "public"."AnimalAdoption" ADD CONSTRAINT "AnimalAdoption_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "public"."animals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
