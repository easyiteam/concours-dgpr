-- CreateEnum
CREATE TYPE "PerformanceType" AS ENUM ('WomanRace80Meters', 'WomanRace800Meters', 'ManRace100Meters', 'ManRace1000Meters', 'WomanClimbing', 'ManClimbing');

-- CreateTable
CREATE TABLE "SportProfile" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "candidatureId" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "mean" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rank" INTEGER,

    CONSTRAINT "SportProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SportProfilePerformance" (
    "d" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "sportProfileId" TEXT NOT NULL,
    "type" "PerformanceType" NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "SportProfilePerformance_pkey" PRIMARY KEY ("d")
);

-- AddForeignKey
ALTER TABLE "SportProfile" ADD CONSTRAINT "SportProfile_candidatureId_fkey" FOREIGN KEY ("candidatureId") REFERENCES "Candidature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SportProfilePerformance" ADD CONSTRAINT "SportProfilePerformance_sportProfileId_fkey" FOREIGN KEY ("sportProfileId") REFERENCES "SportProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
