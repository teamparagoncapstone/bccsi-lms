/*
  Warnings:

  - Added the required column `chooseAnswer` to the `StudentQuizHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StudentQuizHistory" ADD COLUMN     "chooseAnswer" TEXT NOT NULL;
