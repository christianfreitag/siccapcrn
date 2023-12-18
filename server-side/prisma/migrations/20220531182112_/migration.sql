/*
  Warnings:

  - A unique constraint covering the columns `[num_report]` on the table `reports` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "reports_num_report_key" ON "reports"("num_report");
