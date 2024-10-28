/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `VoiceExcercisesHistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "VoiceExcercisesHistory" DROP COLUMN "updatedAt",
ADD COLUMN     "voiceRecord" TEXT,
ALTER COLUMN "voiceImage" DROP NOT NULL;
