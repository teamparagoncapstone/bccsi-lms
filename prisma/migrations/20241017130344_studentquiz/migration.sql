/*
  Warnings:

  - Added the required column `moduleId` to the `StudentQuizHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StudentQuizHistory" ADD COLUMN     "moduleId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "StudentQuizHistory" ADD CONSTRAINT "StudentQuizHistory_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;
