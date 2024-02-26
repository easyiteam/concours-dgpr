-- AlterEnum
ALTER TYPE "BasicRole" ADD VALUE 'EXAM_MANAGER';

-- CreateTable
CREATE TABLE "AuthExam" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "examId" TEXT NOT NULL,
    "authId" TEXT NOT NULL,
    "filter" TEXT NOT NULL,

    CONSTRAINT "AuthExam_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AuthExam" ADD CONSTRAINT "AuthExam_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthExam" ADD CONSTRAINT "AuthExam_authId_fkey" FOREIGN KEY ("authId") REFERENCES "Auth"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
