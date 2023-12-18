/*
  Warnings:

  - You are about to drop the column `date_back_review` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `date_sent_analyst` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `date_sent_review` on the `reports` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "reports" DROP COLUMN "date_back_review",
DROP COLUMN "date_sent_analyst",
DROP COLUMN "date_sent_review",
ADD COLUMN     "step_dates" TIMESTAMP(3)[];
