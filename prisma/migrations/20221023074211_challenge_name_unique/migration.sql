/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Challenge` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Challenge_name_key" ON "Challenge"("name");
