-- Add localDevelopment field to User table
ALTER TABLE "User" ADD COLUMN "localDevelopment" BOOLEAN NOT NULL DEFAULT false; 