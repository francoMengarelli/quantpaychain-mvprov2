-- ========================================
-- FIX COMPLETO DEL SCHEMA - QuantPayChain
-- ========================================
-- Este script agrega TODAS las columnas faltantes a tus tablas
-- Ejecuta este script en el SQL Editor de Supabase

-- ========================================
-- 1. ARREGLAR TABLA rwa_assets
-- ========================================

-- Agregar columna 'location' si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'rwa_assets' 
        AND column_name = 'location'
    ) THEN
        ALTER TABLE public.rwa_assets ADD COLUMN location VARCHAR(255);
        RAISE NOTICE '✅ Columna location agregada a rwa_assets';
    ELSE
        RAISE NOTICE 'ℹ️ Columna location ya existe en rwa_assets';
    END IF;
END $$;

-- Agregar columna 'legal_documents' si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'rwa_assets' 
        AND column_name = 'legal_documents'
    ) THEN
        ALTER TABLE public.rwa_assets ADD COLUMN legal_documents TEXT;
        RAISE NOTICE '✅ Columna legal_documents agregada a rwa_assets';
    ELSE
        RAISE NOTICE 'ℹ️ Columna legal_documents ya existe en rwa_assets';
    END IF;
END $$;

-- Agregar columna 'description' si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'rwa_assets' 
        AND column_name = 'description'
    ) THEN
        ALTER TABLE public.rwa_assets ADD COLUMN description TEXT;
        RAISE NOTICE '✅ Columna description agregada a rwa_assets';
    ELSE
        RAISE NOTICE 'ℹ️ Columna description ya existe en rwa_assets';
    END IF;
END $$;

-- Agregar columna 'asset_type' si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'rwa_assets' 
        AND column_name = 'asset_type'
    ) THEN
        ALTER TABLE public.rwa_assets ADD COLUMN asset_type VARCHAR(50);
        RAISE NOTICE '✅ Columna asset_type agregada a rwa_assets';
    ELSE
        RAISE NOTICE 'ℹ️ Columna asset_type ya existe en rwa_assets';
    END IF;
END $$;

-- Agregar columna 'status' si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'rwa_assets' 
        AND column_name = 'status'
    ) THEN
        ALTER TABLE public.rwa_assets ADD COLUMN status VARCHAR(20) DEFAULT 'active';
        RAISE NOTICE '✅ Columna status agregada a rwa_assets';
    ELSE
        RAISE NOTICE 'ℹ️ Columna status ya existe en rwa_assets';
    END IF;
END $$;

-- Agregar columna 'updated_at' si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'rwa_assets' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE public.rwa_assets ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE '✅ Columna updated_at agregada a rwa_assets';
    ELSE
        RAISE NOTICE 'ℹ️ Columna updated_at ya existe en rwa_assets';
    END IF;
END $$;

-- ========================================
-- 2. ARREGLAR TABLA tokens
-- ========================================

-- Agregar columna 'token_name' si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'tokens' 
        AND column_name = 'token_name'
    ) THEN
        ALTER TABLE public.tokens ADD COLUMN token_name VARCHAR(255);
        RAISE NOTICE '✅ Columna token_name agregada a tokens';
    ELSE
        RAISE NOTICE 'ℹ️ Columna token_name ya existe en tokens';
    END IF;
END $$;

-- Agregar columna 'token_symbol' si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'tokens' 
        AND column_name = 'token_symbol'
    ) THEN
        ALTER TABLE public.tokens ADD COLUMN token_symbol VARCHAR(10);
        RAISE NOTICE '✅ Columna token_symbol agregada a tokens';
    ELSE
        RAISE NOTICE 'ℹ️ Columna token_symbol ya existe en tokens';
    END IF;
END $$;

-- Agregar columna 'token_standard' si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'tokens' 
        AND column_name = 'token_standard'
    ) THEN
        ALTER TABLE public.tokens ADD COLUMN token_standard VARCHAR(50) DEFAULT 'ERC-20';
        RAISE NOTICE '✅ Columna token_standard agregada a tokens';
    ELSE
        RAISE NOTICE 'ℹ️ Columna token_standard ya existe en tokens';
    END IF;
END $$;

-- Agregar columna 'updated_at' si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'tokens' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE public.tokens ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE '✅ Columna updated_at agregada a tokens';
    ELSE
        RAISE NOTICE 'ℹ️ Columna updated_at ya existe en tokens';
    END IF;
END $$;

-- ========================================
-- 3. VERIFICAR ESTRUCTURA FINAL
-- ========================================

-- Mostrar todas las columnas de rwa_assets
SELECT 
    '=== COLUMNAS DE rwa_assets ===' as info,
    column_name, 
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'rwa_assets'
ORDER BY ordinal_position;

-- Mostrar todas las columnas de tokens
SELECT 
    '=== COLUMNAS DE tokens ===' as info,
    column_name, 
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'tokens'
ORDER BY ordinal_position;

-- ========================================
-- FIN DEL SCRIPT
-- ========================================
