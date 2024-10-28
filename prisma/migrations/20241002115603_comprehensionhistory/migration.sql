-- CreateTable
CREATE TABLE "ComprehensionHistory" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "Option1" TEXT NOT NULL,
    "Option2" TEXT NOT NULL,
    "Option3" TEXT NOT NULL,
    "CorrectAnswer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "comprehensionId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "feedback" TEXT,
    "correctAnswersCount" INTEGER,
    "wrongAnswersCount" INTEGER,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ComprehensionHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ComprehensionHistory_id_key" ON "ComprehensionHistory"("id");

-- AddForeignKey
ALTER TABLE "ComprehensionHistory" ADD CONSTRAINT "ComprehensionHistory_comprehensionId_fkey" FOREIGN KEY ("comprehensionId") REFERENCES "ComprehensionTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComprehensionHistory" ADD CONSTRAINT "ComprehensionHistory_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
