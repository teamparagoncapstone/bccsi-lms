-- CreateTable
CREATE TABLE "Award" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "awardType" TEXT NOT NULL,
    "tier" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Award_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Award_id_key" ON "Award"("id");

-- AddForeignKey
ALTER TABLE "Award" ADD CONSTRAINT "Award_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
