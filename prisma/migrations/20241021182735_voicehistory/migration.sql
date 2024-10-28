/*
  Warnings:

  - Changed the type of `accuracyScore` on the `VoiceExcercisesHistory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `pronunciationScore` on the `VoiceExcercisesHistory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `fluencyScore` on the `VoiceExcercisesHistory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `speedScore` on the `VoiceExcercisesHistory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "VoiceExcercisesHistory" DROP COLUMN "accuracyScore",
ADD COLUMN     "accuracyScore" INTEGER NOT NULL,
DROP COLUMN "pronunciationScore",
ADD COLUMN     "pronunciationScore" INTEGER NOT NULL,
DROP COLUMN "fluencyScore",
ADD COLUMN     "fluencyScore" INTEGER NOT NULL,
DROP COLUMN "speedScore",
ADD COLUMN     "speedScore" INTEGER NOT NULL;
