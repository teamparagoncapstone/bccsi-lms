/*
  Warnings:

  - You are about to drop the column `completed` on the `Module` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Module" DROP COLUMN "completed";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "quizTaken" BOOLEAN NOT NULL DEFAULT false;
