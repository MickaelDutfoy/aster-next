-- AlterTable
ALTER TABLE "public"."animals" ADD COLUMN     "findLocation" TEXT;

-- AlterTable
ALTER TABLE "public"."families" ALTER COLUMN "hasChildren" SET DEFAULT false;
