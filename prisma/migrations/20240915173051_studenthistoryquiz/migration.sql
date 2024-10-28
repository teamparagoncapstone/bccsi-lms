/*
  Warnings:

  - You are about to drop the `NewStudent` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `studentId` to the `StudentQuizHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StudentQuizHistory" ADD COLUMN     "studentId" TEXT NOT NULL;

-- DropTable
DROP TABLE "NewStudent";

-- AddForeignKey
ALTER TABLE "StudentQuizHistory" ADD CONSTRAINT "StudentQuizHistory_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
