/*
  Warnings:

  - Made the column `expire_date` on table `caseMovements` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "caseMovements" ALTER COLUMN "expire_date" SET NOT NULL;
