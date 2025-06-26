-- Add localDevelopment field to User table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'User' 
        AND column_name = 'localDevelopment'
    ) THEN 
        ALTER TABLE "User" ADD COLUMN "localDevelopment" BOOLEAN NOT NULL DEFAULT false;
    END IF;
END $$; 