-- AlterTable
ALTER TABLE "Center" ADD COLUMN     "examId" TEXT;

-- AddForeignKey
ALTER TABLE "Center" ADD CONSTRAINT "Center_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE SET NULL ON UPDATE CASCADE;
