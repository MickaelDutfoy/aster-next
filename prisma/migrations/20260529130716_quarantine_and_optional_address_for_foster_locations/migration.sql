-- AlterTable
ALTER TABLE "animals" ADD COLUMN     "quarantineDateStart" DATE;

-- AlterTable
ALTER TABLE "families" ALTER COLUMN "address" DROP NOT NULL;
