/*
  Warnings:

  - A unique constraint covering the columns `[moduleTitle]` on the table `Module` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Module_moduleTitle_key" ON "Module"("moduleTitle");
