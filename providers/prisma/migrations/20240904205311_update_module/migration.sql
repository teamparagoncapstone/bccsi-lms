/*
  Warnings:

  - The primary key for the `Module` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Module` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[id]` on the table `Module` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `moduleId` on the `Questions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Questions" DROP CONSTRAINT "Questions_moduleId_fkey";

-- AlterTable
ALTER TABLE "Module" DROP CONSTRAINT "Module_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Module_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Questions" DROP COLUMN "moduleId",
ADD COLUMN     "moduleId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Module_id_key" ON "Module"("id");

-- AddForeignKey
ALTER TABLE "Questions" ADD CONSTRAINT "Questions_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;
