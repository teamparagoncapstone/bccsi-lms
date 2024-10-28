/*
  Warnings:

  - The primary key for the `Questions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Questions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Student` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `questionId` on the `StudentQuizHistory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "StudentQuizHistory" DROP CONSTRAINT "StudentQuizHistory_questionId_fkey";

-- AlterTable
ALTER TABLE "Questions" DROP CONSTRAINT "Questions_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Questions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Student" DROP CONSTRAINT "Student_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Student_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "StudentQuizHistory" DROP COLUMN "questionId",
ADD COLUMN     "questionId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Questions_id_key" ON "Questions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Student_id_key" ON "Student"("id");

-- AddForeignKey
ALTER TABLE "StudentQuizHistory" ADD CONSTRAINT "StudentQuizHistory_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
