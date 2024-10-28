/*
  Warnings:

  - A unique constraint covering the columns `[studentUsername]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Student_studentUsername_key" ON "Student"("studentUsername");
