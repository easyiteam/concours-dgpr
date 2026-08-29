-- AlterEnum
ALTER TYPE "BasicRole" ADD VALUE 'MEDICAL_MONITOR';

-- AlterTable
ALTER TABLE "Step" ADD COLUMN     "evaluationConfig" JSONB;

-- CreateTable
CREATE TABLE "SigycopProfile" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "candidatureId" TEXT NOT NULL,
    "centerId" TEXT NOT NULL,
    "s" INTEGER NOT NULL,
    "i" INTEGER NOT NULL,
    "g" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "c" INTEGER NOT NULL,
    "o" INTEGER NOT NULL,
    "p" INTEGER NOT NULL,
    "apte" BOOLEAN NOT NULL,
    "failedAxes" TEXT[],
    "status" "CandidatureStatus" NOT NULL DEFAULT 'INDETERMINATE',

    CONSTRAINT "SigycopProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SigycopProfile_candidatureId_key" ON "SigycopProfile"("candidatureId");

-- AddForeignKey
ALTER TABLE "SigycopProfile" ADD CONSTRAINT "SigycopProfile_candidatureId_fkey" FOREIGN KEY ("candidatureId") REFERENCES "Candidature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SigycopProfile" ADD CONSTRAINT "SigycopProfile_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "Center"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

