/*
  Warnings:

  - A unique constraint covering the columns `[id_request,id_investigated]` on the table `Investigated_requests` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "id_request_and_id_investigated_unique_constraint" ON "Investigated_requests"("id_request", "id_investigated");
