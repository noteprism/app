-- Remove trial fields and add localDevelopment field
ALTER TABLE "User" DROP COLUMN IF EXISTS "trialEndsAt";
ALTER TABLE "User" DROP COLUMN IF EXISTS "trialEndingSoon";
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "localDevelopment" BOOLEAN NOT NULL DEFAULT false;
 
-- Update plan values from 'free'/'trial'/'paid' to 'inactive'/'active'
UPDATE "User" SET "plan" = 'inactive' WHERE "plan" = 'free';
UPDATE "User" SET "plan" = 'active' WHERE "plan" = 'trial' OR "plan" = 'paid'; 