-- CreateEnum
CREATE TYPE "Grade" AS ENUM ('Prep', 'Kinder', 'GradeOne', 'GradeTwo', 'GradeThree');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Administrator', 'Teacher', 'Student');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "Subject" AS ENUM ('Reading', 'Math');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "role" "Role",
    "image" TEXT,
    "resetPasswordToken" TEXT,
    "resetPasswordTokenExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "lrnNo" TEXT,
    "firstname" TEXT,
    "lastname" TEXT,
    "middlename" TEXT,
    "sex" "Gender" NOT NULL,
    "bdate" TEXT,
    "age" TEXT,
    "grade" "Grade" NOT NULL,
    "gname" TEXT,
    "image" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewStudent" (
    "id" SERIAL NOT NULL,
    "lrnNo" TEXT,
    "firstname" TEXT,
    "lastname" TEXT,
    "middlename" TEXT,
    "sex" "Gender" NOT NULL,
    "bdate" TEXT,
    "age" TEXT,
    "grade" "Grade" NOT NULL,
    "gname" TEXT,

    CONSTRAINT "NewStudent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" TEXT NOT NULL,
    "grade" "Grade" NOT NULL,
    "moduleTitle" TEXT NOT NULL,
    "moduleDescription" TEXT NOT NULL,
    "learnOutcome1" TEXT,
    "videoModule" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "subjects" "Subject" NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Questions" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "image" TEXT,
    "question" TEXT NOT NULL,
    "Option1" TEXT NOT NULL,
    "Option2" TEXT NOT NULL,
    "Option3" TEXT NOT NULL,
    "CorrectAnswers" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "moduleId" TEXT NOT NULL,

    CONSTRAINT "Questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentQuizHistory" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "image" TEXT,
    "Option1" TEXT NOT NULL,
    "Option2" TEXT NOT NULL,
    "Option3" TEXT NOT NULL,
    "CorrectAnswer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "questionId" TEXT NOT NULL,

    CONSTRAINT "StudentQuizHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoMaterials" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "VideoMaterials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_resetPasswordToken_key" ON "User"("resetPasswordToken");

-- CreateIndex
CREATE UNIQUE INDEX "Student_id_key" ON "Student"("id");

-- CreateIndex
CREATE UNIQUE INDEX "NewStudent_id_key" ON "NewStudent"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Module_id_key" ON "Module"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Questions_id_key" ON "Questions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "StudentQuizHistory_id_key" ON "StudentQuizHistory"("id");

-- CreateIndex
CREATE UNIQUE INDEX "VideoMaterials_id_key" ON "VideoMaterials"("id");

-- AddForeignKey
ALTER TABLE "Questions" ADD CONSTRAINT "Questions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Questions" ADD CONSTRAINT "Questions_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentQuizHistory" ADD CONSTRAINT "StudentQuizHistory_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoMaterials" ADD CONSTRAINT "VideoMaterials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
