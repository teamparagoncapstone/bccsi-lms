/*
  Warnings:

  - The values [Prep,Kinder] on the enum `Grade` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `voiceExcercisesId` on the `StudentQuizHistory` table. All the data in the column will be lost.
  - You are about to drop the `VideoMaterials` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Grade_new" AS ENUM ('GradeOne', 'GradeTwo', 'GradeThree');
ALTER TABLE "Student" ALTER COLUMN "grade" TYPE "Grade_new" USING ("grade"::text::"Grade_new");
ALTER TABLE "Module" ALTER COLUMN "grade" TYPE "Grade_new" USING ("grade"::text::"Grade_new");
ALTER TABLE "Questions" ALTER COLUMN "grade" TYPE "Grade_new" USING ("grade"::text::"Grade_new");
ALTER TABLE "VoiceExcercises" ALTER COLUMN "grade" TYPE "Grade_new" USING ("grade"::text::"Grade_new");
ALTER TYPE "Grade" RENAME TO "Grade_old";
ALTER TYPE "Grade_new" RENAME TO "Grade";
DROP TYPE "Grade_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "StudentQuizHistory" DROP CONSTRAINT "StudentQuizHistory_voiceExcercisesId_fkey";

-- DropForeignKey
ALTER TABLE "VideoMaterials" DROP CONSTRAINT "VideoMaterials_userId_fkey";

-- AlterTable
ALTER TABLE "StudentQuizHistory" DROP COLUMN "voiceExcercisesId";

-- DropTable
DROP TABLE "VideoMaterials";

-- CreateTable
CREATE TABLE "VoiceExcercisesHistory" (
    "id" TEXT NOT NULL,
    "voice" TEXT NOT NULL,
    "voiceImage" TEXT NOT NULL,
    "recognizedText" TEXT NOT NULL,
    "accuracyScore" TEXT NOT NULL,
    "pronunciationScore" TEXT NOT NULL,
    "fluencyScore" TEXT NOT NULL,
    "speedScore" TEXT NOT NULL,
    "phonemes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "voiceExcercisesId" TEXT,
    "studentId" TEXT NOT NULL,

    CONSTRAINT "VoiceExcercisesHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VoiceExcercisesHistory_id_key" ON "VoiceExcercisesHistory"("id");

-- AddForeignKey
ALTER TABLE "VoiceExcercisesHistory" ADD CONSTRAINT "VoiceExcercisesHistory_voiceExcercisesId_fkey" FOREIGN KEY ("voiceExcercisesId") REFERENCES "VoiceExcercises"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceExcercisesHistory" ADD CONSTRAINT "VoiceExcercisesHistory_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
