/*
  Warnings:

  - You are about to alter the column `score` on the `StudentQuizHistory` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Made the column `score` on table `StudentQuizHistory` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "StudentQuizHistory" ALTER COLUMN "score" SET NOT NULL,
ALTER COLUMN "score" SET DATA TYPE INTEGER;
