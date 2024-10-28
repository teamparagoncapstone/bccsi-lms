-- CreateTable
CREATE TABLE "ComprehensionTest" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "image" TEXT,
    "question" TEXT NOT NULL,
    "Option1" TEXT NOT NULL,
    "Option2" TEXT NOT NULL,
    "Option3" TEXT NOT NULL,
    "CorrectAnswers" TEXT NOT NULL,
    "grade" "Grade" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "voiceId" TEXT NOT NULL,

    CONSTRAINT "ComprehensionTest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ComprehensionTest_id_key" ON "ComprehensionTest"("id");

-- AddForeignKey
ALTER TABLE "ComprehensionTest" ADD CONSTRAINT "ComprehensionTest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComprehensionTest" ADD CONSTRAINT "ComprehensionTest_voiceId_fkey" FOREIGN KEY ("voiceId") REFERENCES "VoiceExcercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;
