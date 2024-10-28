/*
  Warnings:

  - Added the required column `moduleId` to the `ComprehensionTest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ComprehensionTest" ADD COLUMN     "moduleId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ComprehensionTest" ADD CONSTRAINT "ComprehensionTest_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;
