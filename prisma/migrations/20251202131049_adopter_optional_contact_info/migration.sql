-- AlterTable
ALTER TABLE "public"."AnimalAdoption" ALTER COLUMN "adopterEmail" DROP NOT NULL,
ALTER COLUMN "adopterPhoneNumber" DROP NOT NULL,
ALTER COLUMN "adopterAddress" DROP NOT NULL,
ALTER COLUMN "adopterCity" DROP NOT NULL,
ALTER COLUMN "adopterZip" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."animals" ALTER COLUMN "dewormHistory" SET DEFAULT ARRAY[]::TIMESTAMP(3)[],
ALTER COLUMN "vaxHistory" SET DEFAULT ARRAY[]::TIMESTAMP(3)[];
