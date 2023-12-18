/*
  Warnings:

  - You are about to drop the column `date_step_eight` on the `cases` table. All the data in the column will be lost.
  - You are about to drop the column `date_step_five` on the `cases` table. All the data in the column will be lost.
  - You are about to drop the column `date_step_four` on the `cases` table. All the data in the column will be lost.
  - You are about to drop the column `date_step_one` on the `cases` table. All the data in the column will be lost.
  - You are about to drop the column `date_step_seven` on the `cases` table. All the data in the column will be lost.
  - You are about to drop the column `date_step_six` on the `cases` table. All the data in the column will be lost.
  - You are about to drop the column `date_step_three` on the `cases` table. All the data in the column will be lost.
  - You are about to drop the column `date_step_two` on the `cases` table. All the data in the column will be lost.
  - You are about to drop the column `expire_date` on the `cases` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `cases` table. All the data in the column will be lost.
  - You are about to drop the column `step` on the `cases` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cases" DROP COLUMN "date_step_eight",
DROP COLUMN "date_step_five",
DROP COLUMN "date_step_four",
DROP COLUMN "date_step_one",
DROP COLUMN "date_step_seven",
DROP COLUMN "date_step_six",
DROP COLUMN "date_step_three",
DROP COLUMN "date_step_two",
DROP COLUMN "expire_date",
DROP COLUMN "status",
DROP COLUMN "step";
