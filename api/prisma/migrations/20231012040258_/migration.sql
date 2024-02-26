-- AlterTable
ALTER TABLE "Candidature" ADD COLUMN     "examId" TEXT;

-- AddForeignKey
ALTER TABLE "Candidature" ADD CONSTRAINT "Candidature_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE SET NULL ON UPDATE CASCADE;
