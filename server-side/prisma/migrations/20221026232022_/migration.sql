/*
  Warnings:

  - Added the required column `alterpendentdays` to the `vacations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "vacations" ADD COLUMN     "alterpendentdays" BOOLEAN NOT NULL;
