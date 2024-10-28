/*
  Warnings:

  - You are about to drop the column `moduleId` on the `ComprehensionTest` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ComprehensionTest" DROP CONSTRAINT "ComprehensionTest_moduleId_fkey";

-- AlterTable
ALTER TABLE "ComprehensionTest" DROP COLUMN "moduleId";
