/*
  Warnings:

  - Added the required column `file` to the `reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `num_report` to the `reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_level` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "file" TEXT NOT NULL,
ADD COLUMN     "num_report" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "user_level" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "requests" (
    "id" TEXT NOT NULL,
    "num_solicitacao" TEXT NOT NULL,
    "history" TEXT,
    "id_case" TEXT NOT NULL,

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investigated" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,

    CONSTRAINT "investigated_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investigated_requests" (
    "id" TEXT NOT NULL,
    "id_request" TEXT NOT NULL,
    "id_investigated" TEXT NOT NULL,

    CONSTRAINT "Investigated_requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_id_case_fkey" FOREIGN KEY ("id_case") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investigated_requests" ADD CONSTRAINT "Investigated_requests_id_request_fkey" FOREIGN KEY ("id_request") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investigated_requests" ADD CONSTRAINT "Investigated_requests_id_investigated_fkey" FOREIGN KEY ("id_investigated") REFERENCES "investigated"("id") ON DELETE CASCADE ON UPDATE CASCADE;
