/*
  Warnings:

  - Made the column `name` on table `analysts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "analysts" ADD COLUMN     "password" TEXT,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "whatsapp" DROP NOT NULL;

-- CreateTable
CREATE TABLE "caseMovements" (
    "id" TEXT NOT NULL,
    "case_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "observation" TEXT,
    "created_by" TEXT NOT NULL,
    "edited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "caseMovements_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "caseMovements" ADD CONSTRAINT "caseMovements_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caseMovements" ADD CONSTRAINT "caseMovements_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
