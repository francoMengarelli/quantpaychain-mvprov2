-- Migration: Add legal_documents column to rwa_assets
-- Run this in Supabase SQL Editor

-- Add legal_documents column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'rwa_assets' 
        AND column_name = 'legal_documents'
    ) THEN
        ALTER TABLE public.rwa_assets 
        ADD COLUMN legal_documents TEXT;
        
        RAISE NOTICE 'Column legal_documents added successfully';
    ELSE
        RAISE NOTICE 'Column legal_documents already exists';
    END IF;
END $$;

-- Also add missing token fields if needed
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'tokens' 
        AND column_name = 'token_name'
    ) THEN
        ALTER TABLE public.tokens 
        ADD COLUMN token_name VARCHAR(255);
        
        RAISE NOTICE 'Column token_name added successfully';
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'tokens' 
        AND column_name = 'token_standard'
    ) THEN
        ALTER TABLE public.tokens 
        ADD COLUMN token_standard VARCHAR(50) DEFAULT 'ERC-20';
        
        RAISE NOTICE 'Column token_standard added successfully';
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'tokens' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE public.tokens 
        ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        
        RAISE NOTICE 'Column updated_at added successfully';
    END IF;
END $$;

-- Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'rwa_assets'
ORDER BY ordinal_position;

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'tokens'
ORDER BY ordinal_position;
