/*
  Warnings:

  - Added the required column `chooseAnswer` to the `ComprehensionHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ComprehensionHistory" ADD COLUMN     "chooseAnswer" TEXT NOT NULL;
