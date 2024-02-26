-- AlterTable
ALTER TABLE "SportProfile" ADD COLUMN     "status" "CandidatureStatus" NOT NULL DEFAULT 'INDETERMINATE';

-- AlterTable
ALTER TABLE "SportProfilePerformance" ADD COLUMN     "score" DOUBLE PRECISION NOT NULL DEFAULT 0;
