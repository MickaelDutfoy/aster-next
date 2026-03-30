-- AlterTable
ALTER TABLE "TransactionCategory" ADD COLUMN     "defaultType" "TransactionType" NOT NULL DEFAULT 'EXPENSE';

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "defaultCurrency" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
