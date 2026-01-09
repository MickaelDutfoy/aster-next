-- AlterTable
ALTER TABLE "AnimalAdoption" ALTER COLUMN "adopterFullName" DROP NOT NULL;

-- CreateTable
CREATE TABLE "AnimalHealthAct" (
    "id" SERIAL NOT NULL,
    "animalId" INTEGER NOT NULL,
    "information" TEXT,

    CONSTRAINT "AnimalHealthAct_pkey" PRIMARY KEY ("id")
);
