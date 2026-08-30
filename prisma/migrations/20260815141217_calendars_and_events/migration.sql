-- CreateEnum
CREATE TYPE "CalendarScope" AS ENUM ('ORGANIZATION', 'FAMILY', 'MEMBER');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('PRESENCE');

-- CreateTable
CREATE TABLE "Calendar" (
    "id" SERIAL NOT NULL,
    "orgId" INTEGER NOT NULL,
    "familyId" INTEGER,
    "memberId" INTEGER,
    "scope" "CalendarScope" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Calendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "calendarId" INTEGER NOT NULL,
    "type" "EventType" NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "createdByMemberId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventParticipant" (
    "eventId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,

    CONSTRAINT "EventParticipant_pkey" PRIMARY KEY ("eventId","memberId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Calendar_familyId_key" ON "Calendar"("familyId");

-- CreateIndex
CREATE UNIQUE INDEX "Calendar_memberId_key" ON "Calendar"("memberId");

-- CreateIndex
CREATE INDEX "Calendar_orgId_idx" ON "Calendar"("orgId");

-- CreateIndex
CREATE INDEX "Event_calendarId_startsAt_idx" ON "Event"("calendarId", "startsAt");

-- CreateIndex
CREATE INDEX "EventParticipant_memberId_idx" ON "EventParticipant"("memberId");

-- AddForeignKey
ALTER TABLE "Calendar" ADD CONSTRAINT "Calendar_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calendar" ADD CONSTRAINT "Calendar_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calendar" ADD CONSTRAINT "Calendar_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "Calendar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventParticipant" ADD CONSTRAINT "EventParticipant_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventParticipant" ADD CONSTRAINT "EventParticipant_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
