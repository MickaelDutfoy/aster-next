-- Backfill lastVax -> AnimalHealthAct
INSERT INTO "AnimalHealthAct" ("animalId", "type", "date", "isFirst", "createdAt")
SELECT
  a."id",
  'VACCINATION',
  a."last_vax",
  COALESCE(a."is_primo_vax", false),
  NOW()
FROM "animals" a
WHERE a."last_vax" IS NOT NULL;

-- Backfill lastDeworm -> AnimalHealthAct
INSERT INTO "AnimalHealthAct" ("animalId", "type", "date", "isFirst", "createdAt")
SELECT
  a."id",
  'DEWORM',
  a."last_deworm",
  COALESCE(a."is_first_deworm", false),
  NOW()
FROM "animals" a
WHERE a."last_deworm" IS NOT NULL;
