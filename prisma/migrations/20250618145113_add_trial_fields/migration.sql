-- AlterTable
ALTER TABLE "User" ADD COLUMN     "trialEndingSoon" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "trialEndsAt" TIMESTAMP(3);
