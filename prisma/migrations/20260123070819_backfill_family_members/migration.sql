-- 1) (optionnel mais logique) : remplir createdByMemberId quand il est null
UPDATE "families"
SET "createdByMemberId" = "memberId"
WHERE "createdByMemberId" IS NULL
  AND "memberId" IS NOT NULL;

-- 2) backfill table de liaison : families.memberId -> FamilyMember(familyId, memberId)
INSERT INTO "FamilyMember" ("familyId", "memberId")
SELECT f."id", f."memberId"
FROM "families" f
WHERE f."memberId" IS NOT NULL
ON CONFLICT ("familyId", "memberId") DO NOTHING;
