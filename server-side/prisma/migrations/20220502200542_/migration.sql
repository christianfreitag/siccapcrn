/*
  Warnings:

  - Made the column `date_sche_ini` on table `vacations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `date_sche_end` on table `vacations` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "vacations" ALTER COLUMN "date_sche_ini" SET NOT NULL,
ALTER COLUMN "date_sche_end" SET NOT NULL,
ALTER COLUMN "date_ini" DROP NOT NULL,
ALTER COLUMN "date_end" DROP NOT NULL;
