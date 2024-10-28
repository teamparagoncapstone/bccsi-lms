/*
  Warnings:

  - You are about to drop the column `voiceExcercisesId` on the `VoiceExcercisesHistory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "VoiceExcercisesHistory" DROP CONSTRAINT "VoiceExcercisesHistory_voiceExcercisesId_fkey";

-- AlterTable
ALTER TABLE "VoiceExcercisesHistory" DROP COLUMN "voiceExcercisesId",
ADD COLUMN     "voiceExercisesId" TEXT;

-- AddForeignKey
ALTER TABLE "VoiceExcercisesHistory" ADD CONSTRAINT "VoiceExcercisesHistory_voiceExercisesId_fkey" FOREIGN KEY ("voiceExercisesId") REFERENCES "VoiceExcercises"("id") ON DELETE SET NULL ON UPDATE CASCADE;
