/*
  Warnings:

  - The primary key for the `Module` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Questions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Student` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Questions" DROP CONSTRAINT "Questions_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "StudentQuizHistory" DROP CONSTRAINT "StudentQuizHistory_questionId_fkey";

-- AlterTable
ALTER TABLE "Module" DROP CONSTRAINT "Module_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Module_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Module_id_seq";

-- AlterTable
ALTER TABLE "Questions" DROP CONSTRAINT "Questions_pkey",
ALTER COLUMN "moduleId" SET DATA TYPE TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Questions_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Questions_id_seq";

-- AlterTable
ALTER TABLE "Student" DROP CONSTRAINT "Student_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Student_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Student_id_seq";

-- AlterTable
ALTER TABLE "StudentQuizHistory" ALTER COLUMN "questionId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Questions" ADD CONSTRAINT "Questions_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentQuizHistory" ADD CONSTRAINT "StudentQuizHistory_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
