/*
  Warnings:

  - You are about to drop the column `label` on the `caseMovements` table. All the data in the column will be lost.
  - Added the required column `movement_id` to the `caseMovements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "caseMovements" DROP COLUMN "label",
ADD COLUMN     "movement_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Movement" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "Movement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "caseMovements" ADD CONSTRAINT "caseMovements_movement_id_fkey" FOREIGN KEY ("movement_id") REFERENCES "Movement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
