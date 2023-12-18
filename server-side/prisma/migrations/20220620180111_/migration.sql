/*
  Warnings:

  - You are about to drop the column `step_date` on the `cases` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cases" DROP COLUMN "step_date";

-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 0;
