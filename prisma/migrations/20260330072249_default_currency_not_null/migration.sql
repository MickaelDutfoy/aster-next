/*
  Warnings:

  - Made the column `paymentMethod` on table `Transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `defaultCurrency` on table `organizations` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "paymentMethod" SET NOT NULL;

-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "defaultCurrency" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;
