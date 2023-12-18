/*
  Warnings:

  - You are about to drop the column `movement_id` on the `caseMovements` table. All the data in the column will be lost.
  - You are about to drop the `Movement` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `label` to the `caseMovements` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "caseMovements" DROP CONSTRAINT "caseMovements_movement_id_fkey";

-- AlterTable
ALTER TABLE "caseMovements" DROP COLUMN "movement_id",
ADD COLUMN     "label" TEXT NOT NULL;

-- DropTable
DROP TABLE "Movement";
