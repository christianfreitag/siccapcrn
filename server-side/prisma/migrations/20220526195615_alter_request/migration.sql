/*
  Warnings:

  - You are about to drop the column `num_solicitacao` on the `requests` table. All the data in the column will be lost.
  - Added the required column `num_request` to the `requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "requests" DROP COLUMN "num_solicitacao",
ADD COLUMN     "num_request" TEXT NOT NULL;
