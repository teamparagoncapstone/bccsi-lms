-- AlterTable
ALTER TABLE "StudentQuizHistory" ADD COLUMN     "attemptCount" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "score" DOUBLE PRECISION;
