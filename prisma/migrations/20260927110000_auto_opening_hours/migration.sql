-- Automatic open/close by opening and closing time (Sri Lanka time).
ALTER TABLE "Setting" ADD COLUMN "autoHours" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Setting" ADD COLUMN "openTime" TEXT NOT NULL DEFAULT '10:00';
ALTER TABLE "Setting" ADD COLUMN "closeTime" TEXT NOT NULL DEFAULT '22:00';
