/*
  Warnings:

  - The `step_dates` column on the `reports` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "reports" DROP COLUMN "step_dates",
ADD COLUMN     "step_dates" JSONB[];
