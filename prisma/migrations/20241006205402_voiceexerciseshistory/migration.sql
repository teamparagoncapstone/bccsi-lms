/*
  Warnings:

  - Added the required column `score` to the `VoiceExcercisesHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VoiceExcercisesHistory" ADD COLUMN     "score" INTEGER NOT NULL;
