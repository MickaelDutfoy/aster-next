-- CreateEnum
CREATE TYPE "public"."Sex" AS ENUM ('M', 'F');

-- CreateEnum
CREATE TYPE "public"."MemberRole" AS ENUM ('MEMBER', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "public"."MemberStatus" AS ENUM ('PENDING', 'VALIDATED');

-- CreateTable
CREATE TABLE "public"."animals" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "sex" "public"."Sex" NOT NULL,
    "color" TEXT,
    "birth_date" DATE NOT NULL,
    "is_neutered" BOOLEAN NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'unhosted',
    "last_vax" DATE,
    "is_primo_vax" BOOLEAN NOT NULL DEFAULT false,
    "last_deworm" DATE,
    "is_first_deworm" BOOLEAN NOT NULL DEFAULT false,
    "information" TEXT,
    "family_id" INTEGER,
    "organization_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "animals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."families" (
    "id" SERIAL NOT NULL,
    "contact_name" TEXT NOT NULL,
    "email" TEXT,
    "phone_number" TEXT NOT NULL,
    "address" TEXT,
    "organization_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "families_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."member_organization" (
    "member_id" INTEGER NOT NULL,
    "organization_id" INTEGER NOT NULL,
    "role" "public"."MemberRole" NOT NULL,
    "status" "public"."MemberStatus" NOT NULL,
    "joined_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "member_organization_pkey" PRIMARY KEY ("member_id","organization_id")
);

-- CreateTable
CREATE TABLE "public"."members" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."organizations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "members_email_key" ON "public"."members"("email");

-- CreateIndex
CREATE UNIQUE INDEX "members_phone_number_key" ON "public"."members"("phone_number");

-- AddForeignKey
ALTER TABLE "public"."animals" ADD CONSTRAINT "animals_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."animals" ADD CONSTRAINT "animals_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."families" ADD CONSTRAINT "families_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."member_organization" ADD CONSTRAINT "member_organization_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."member_organization" ADD CONSTRAINT "member_organization_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
