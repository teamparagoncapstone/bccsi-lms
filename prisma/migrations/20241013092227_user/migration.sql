/*
  Warnings:

  - You are about to drop the column `resetPasswordToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetPasswordTokenExpiry` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[resetPassword]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_resetPasswordToken_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "resetPasswordToken",
DROP COLUMN "resetPasswordTokenExpiry",
ADD COLUMN     "resetPassword" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_resetPassword_key" ON "User"("resetPassword");
