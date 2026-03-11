-- AlterEnum
ALTER TYPE "Sex" ADD VALUE 'UNKNOWN';

-- CreateTable
CREATE TABLE "AnimalWeightEntry" (
    "id" SERIAL NOT NULL,
    "animalId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "weightGrams" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnimalWeightEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AnimalWeightEntry_animalId_date_idx" ON "AnimalWeightEntry"("animalId", "date");

-- AddForeignKey
ALTER TABLE "AnimalWeightEntry" ADD CONSTRAINT "AnimalWeightEntry_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "animals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
