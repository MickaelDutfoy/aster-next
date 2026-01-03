-- DropForeignKey
ALTER TABLE "animals" DROP CONSTRAINT "animals_organization_id_fkey";

-- AddForeignKey
ALTER TABLE "animals" ADD CONSTRAINT "animals_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
