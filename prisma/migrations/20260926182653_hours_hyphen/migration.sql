-- AlterTable
ALTER TABLE "Setting" ALTER COLUMN "openingHours" SET DEFAULT '10:00 AM - 10:00 PM, every day';

-- Use a plain hyphen in opening hours (e.g. "10:00 AM - 10:00 PM").
UPDATE "Setting" SET "openingHours" = REPLACE(REPLACE("openingHours", '–', '-'), '—', '-');
