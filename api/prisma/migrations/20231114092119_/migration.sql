-- DropForeignKey
ALTER TABLE "Validator" DROP CONSTRAINT "Validator_examId_fkey";

-- AlterTable
ALTER TABLE "Validator" ALTER COLUMN "examId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Field" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "label" TEXT NOT NULL,
    "coefficient" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "examId" TEXT NOT NULL,

    CONSTRAINT "Field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Score" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "value" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "qrcode" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "writingProfileId" TEXT NOT NULL,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WritingProfile" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "candidatureId" TEXT NOT NULL,
    "status" "CandidatureStatus" NOT NULL DEFAULT 'INDETERMINATE',
    "room" INTEGER NOT NULL,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "mean" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rank" INTEGER,

    CONSTRAINT "WritingProfile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Validator" ADD CONSTRAINT "Validator_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Field" ADD CONSTRAINT "Field_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_writingProfileId_fkey" FOREIGN KEY ("writingProfileId") REFERENCES "WritingProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WritingProfile" ADD CONSTRAINT "WritingProfile_candidatureId_fkey" FOREIGN KEY ("candidatureId") REFERENCES "Candidature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
