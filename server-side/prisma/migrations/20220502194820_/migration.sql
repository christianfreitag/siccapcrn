/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `analysts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "analysts_email_key" ON "analysts"("email");
