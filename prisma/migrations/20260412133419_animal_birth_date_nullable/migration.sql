-- AlterTable
ALTER TABLE "AnimalTestEntry" ALTER COLUMN "date" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "AnimalWeightEntry" ALTER COLUMN "date" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "date" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "animals" ALTER COLUMN "birth_date" DROP NOT NULL,
ALTER COLUMN "trialDateStart" SET DATA TYPE DATE;
