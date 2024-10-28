/*
  Warnings:

  - You are about to drop the column `moduleId` on the `StudentQuizHistory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudentQuizHistory" DROP CONSTRAINT "StudentQuizHistory_moduleId_fkey";

-- DropIndex
DROP INDEX "Module_moduleTitle_key";

-- AlterTable
ALTER TABLE "StudentQuizHistory" DROP COLUMN "moduleId";
