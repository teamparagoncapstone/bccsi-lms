-- CreateEnum
CREATE TYPE "EducatorLevel" AS ENUM ('EducatorOne', 'EducatorTwo', 'EducatorThree');

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "ComprehensionTest" ADD COLUMN     "educatorId" TEXT;

-- AlterTable
ALTER TABLE "OTP" ADD COLUMN     "educatorId" TEXT;

-- AlterTable
ALTER TABLE "Questions" ADD COLUMN     "educatorId" TEXT;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "educatorId" TEXT;

-- AlterTable
ALTER TABLE "VoiceExcercises" ADD COLUMN     "educatorId" TEXT;

-- CreateTable
CREATE TABLE "Educator" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "educatorLevel" "EducatorLevel",
    "image" TEXT,
    "resetPasswordToken" TEXT,
    "resetPasswordTokenExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "userId" TEXT,

    CONSTRAINT "Educator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Educator_id_key" ON "Educator"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Educator_username_key" ON "Educator"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Educator_email_key" ON "Educator"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Educator_resetPasswordToken_key" ON "Educator"("resetPasswordToken");

-- AddForeignKey
ALTER TABLE "Educator" ADD CONSTRAINT "Educator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_educatorId_fkey" FOREIGN KEY ("educatorId") REFERENCES "Educator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Questions" ADD CONSTRAINT "Questions_educatorId_fkey" FOREIGN KEY ("educatorId") REFERENCES "Educator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceExcercises" ADD CONSTRAINT "VoiceExcercises_educatorId_fkey" FOREIGN KEY ("educatorId") REFERENCES "Educator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComprehensionTest" ADD CONSTRAINT "ComprehensionTest_educatorId_fkey" FOREIGN KEY ("educatorId") REFERENCES "Educator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OTP" ADD CONSTRAINT "OTP_educatorId_fkey" FOREIGN KEY ("educatorId") REFERENCES "Educator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
