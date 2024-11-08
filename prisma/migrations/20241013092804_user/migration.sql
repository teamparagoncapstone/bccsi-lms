/*
  Warnings:

  - You are about to drop the column `resetPassword` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[resetPasswordExpiry]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_resetPassword_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "resetPassword",
ADD COLUMN     "resetPasswordExpiry" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_resetPasswordExpiry_key" ON "User"("resetPasswordExpiry");
