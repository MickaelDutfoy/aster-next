UPDATE "animals"
SET "imageUpdatedAt" = "updatedAt"
WHERE "imageKey" IS NOT NULL;