-- CreateEnum
CREATE TYPE "AnimalTestResult" AS ENUM ('POSITIVE', 'NEGATIVE');

-- CreateTable
CREATE TABLE "AnimalTestEntry" (
    "id" SERIAL NOT NULL,
    "animalId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "testName" TEXT NOT NULL,
    "result" "AnimalTestResult" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnimalTestEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AnimalTestEntry_animalId_date_idx" ON "AnimalTestEntry"("animalId", "date");

-- AddForeignKey
ALTER TABLE "AnimalTestEntry" ADD CONSTRAINT "AnimalTestEntry_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "animals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
