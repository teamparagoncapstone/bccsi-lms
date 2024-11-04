/*
  Warnings:

  - You are about to drop the `StudentProgress` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userName` to the `AuditLogs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StudentProgress" DROP CONSTRAINT "StudentProgress_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "StudentProgress" DROP CONSTRAINT "StudentProgress_studentId_fkey";

-- AlterTable
ALTER TABLE "AuditLogs" ADD COLUMN     "userName" TEXT NOT NULL;

-- DropTable
DROP TABLE "StudentProgress";
