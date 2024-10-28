/*
  Warnings:

  - Added the required column `entityId` to the `AuditLogs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AuditLogs" ADD COLUMN     "entityId" TEXT NOT NULL;
