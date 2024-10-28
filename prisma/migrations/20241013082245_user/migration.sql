/*
  Warnings:

  - You are about to drop the column `resetPasswordToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetPasswordTokenExpiry` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_resetPasswordToken_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "resetPasswordToken",
DROP COLUMN "resetPasswordTokenExpiry",
ADD COLUMN     "resetPasswordExpiry" TIMESTAMP(3);
