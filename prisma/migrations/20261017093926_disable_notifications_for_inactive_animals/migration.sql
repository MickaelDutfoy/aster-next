UPDATE "animals"
SET "notificationsEnabled" = false
WHERE "status" IN (
  'ADOPTED',
  'DECEASED',
  'RELEASED',
  'REUNITED_WITH_OWNER'
);