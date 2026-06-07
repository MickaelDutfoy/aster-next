-- AlterTable
ALTER TABLE "animals" ADD COLUMN     "isPubliclyAdoptable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publicDescription" TEXT;

-- CreateTable
CREATE TABLE "OrganizationPublicPage" (
    "id" SERIAL NOT NULL,
    "orgId" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationPublicPage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationPublicPage_orgId_key" ON "OrganizationPublicPage"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationPublicPage_slug_key" ON "OrganizationPublicPage"("slug");

-- AddForeignKey
ALTER TABLE "OrganizationPublicPage" ADD CONSTRAINT "OrganizationPublicPage_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
