-- AlterTable
ALTER TABLE "Setting" ALTER COLUMN "whatsappNumber" SET DEFAULT '94772643757',
ALTER COLUMN "phone" SET DEFAULT '077 264 3757';

-- Set the restaurant's WhatsApp number and phone on the existing settings row,
-- only where they still hold the old placeholder / empty values.
UPDATE "Setting" SET "whatsappNumber" = '94772643757' WHERE "whatsappNumber" = '94770000000';
UPDATE "Setting" SET "phone" = '077 264 3757' WHERE "phone" = '';
