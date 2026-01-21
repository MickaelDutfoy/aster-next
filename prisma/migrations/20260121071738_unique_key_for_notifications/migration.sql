/*
  Warnings:

  - A unique constraint covering the columns `[memberId,sourceKey]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "sourceKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Notification_memberId_sourceKey_key" ON "Notification"("memberId", "sourceKey");
