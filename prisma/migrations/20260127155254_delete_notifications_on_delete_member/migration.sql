-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_memberId_fkey";

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
