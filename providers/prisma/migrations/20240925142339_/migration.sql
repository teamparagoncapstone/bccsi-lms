/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "StudentQuizHistory" ADD COLUMN     "voiceExcercisesId" TEXT;

-- CreateTable
CREATE TABLE "VoiceExcercises" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "voiceImage" TEXT,
    "voice" TEXT NOT NULL,
    "grade" "Grade" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "moduleId" TEXT NOT NULL,

    CONSTRAINT "VoiceExcercises_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VoiceExcercises_id_key" ON "VoiceExcercises"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "VoiceExcercises" ADD CONSTRAINT "VoiceExcercises_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceExcercises" ADD CONSTRAINT "VoiceExcercises_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentQuizHistory" ADD CONSTRAINT "StudentQuizHistory_voiceExcercisesId_fkey" FOREIGN KEY ("voiceExcercisesId") REFERENCES "VoiceExcercises"("id") ON DELETE SET NULL ON UPDATE CASCADE;
