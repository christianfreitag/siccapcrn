/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `investigated` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[num_request]` on the table `requests` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `created_by` to the `requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "analysts" ADD COLUMN     "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "requests" ADD COLUMN     "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "vacations" ADD COLUMN     "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "investigated_cpf_key" ON "investigated"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "requests_num_request_key" ON "requests"("num_request");

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
