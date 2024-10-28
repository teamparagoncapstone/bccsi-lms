/*
  Warnings:

  - You are about to drop the column `WrongAnswersCount` on the `StudentQuizHistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StudentQuizHistory" DROP COLUMN "WrongAnswersCount",
ADD COLUMN     "wrongAnswersCount" INTEGER;
