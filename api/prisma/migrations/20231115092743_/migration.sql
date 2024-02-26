/*
  Warnings:

  - Added the required column `centerId` to the `WritingProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WritingProfile" ADD COLUMN     "centerId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Center" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "label" TEXT NOT NULL,

    CONSTRAINT "Center_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WritingProfile" ADD CONSTRAINT "WritingProfile_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "Center"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
