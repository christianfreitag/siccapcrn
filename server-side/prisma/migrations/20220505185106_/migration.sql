/*
  Warnings:

  - A unique constraint covering the columns `[num_caso_lab]` on the table `cases` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[num_sei]` on the table `cases` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cases_num_caso_lab_key" ON "cases"("num_caso_lab");

-- CreateIndex
CREATE UNIQUE INDEX "cases_num_sei_key" ON "cases"("num_sei");
