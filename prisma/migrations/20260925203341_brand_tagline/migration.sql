-- AlterTable
ALTER TABLE "Setting" ALTER COLUMN "tagline" SET DEFAULT 'Taste the Luxury';

-- Update the existing settings row only if it still has the old default tagline.
UPDATE "Setting" SET "tagline" = 'Taste the Luxury' WHERE "tagline" = 'Authentic flavours, served with love';
