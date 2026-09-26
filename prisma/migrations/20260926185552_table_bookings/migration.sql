-- CreateEnum
CREATE TYPE "SeatingType" AS ENUM ('NORMAL', 'FAMILY_ROOM', 'MAJLIS');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('CASUAL', 'MEETING', 'PARTY', 'BIRTHDAY', 'ANNIVERSARY', 'FAMILY_GATHERING', 'OTHER');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'SEATED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- AlterTable
ALTER TABLE "Setting" ADD COLUMN     "acceptBookings" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "bookingEnd" TEXT NOT NULL DEFAULT '21:30',
ADD COLUMN     "bookingStart" TEXT NOT NULL DEFAULT '11:00';

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "bookingNo" SERIAL NOT NULL,
    "customerName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "guests" INTEGER NOT NULL,
    "seating" "SeatingType" NOT NULL,
    "eventType" "EventType" NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_bookingNo_key" ON "Reservation"("bookingNo");

-- CreateIndex
CREATE INDEX "Reservation_date_idx" ON "Reservation"("date");

-- CreateIndex
CREATE INDEX "Reservation_status_idx" ON "Reservation"("status");
