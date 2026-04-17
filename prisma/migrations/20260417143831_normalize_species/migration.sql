-- Normalize species to canonical keys

UPDATE "animals"
SET "species" = 'cat'
WHERE "species" IN ('Chat', 'Cat', 'Katt');

UPDATE "animals"
SET "species" = 'dog'
WHERE "species" IN ('Chien', 'Dog', 'Hund');

UPDATE "animals"
SET "species" = 'ferret'
WHERE "species" IN ('Furet', 'Ferret', 'Ilder');

UPDATE "animals"
SET "species" = 'rabbit'
WHERE "species" IN ('Lapin', 'Rabbit', 'Kanin');