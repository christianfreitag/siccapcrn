/*
  Warnings:

  - Made the column `num_caso_lab` on table `cases` required. This step will fail if there are existing NULL values in that column.
  - Made the column `num_sei` on table `cases` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "cases" ALTER COLUMN "num_caso_lab" SET NOT NULL,
ALTER COLUMN "num_sei" SET NOT NULL;
