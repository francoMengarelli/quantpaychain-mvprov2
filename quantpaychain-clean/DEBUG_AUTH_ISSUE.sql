-- ========================================
-- DEBUG: PROBLEMA DE AUTENTICACIÓN
-- ========================================
-- Error: "violates foreign key constraint rwa_assets_owner_id_fkey"
-- Causa: El user.id no existe en auth.users

-- ========================================
-- 1. VERIFICAR QUÉ USUARIOS EXISTEN
-- ========================================

-- Ver todos los usuarios en auth.users
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at,
    last_sign_in_at
FROM auth.users 
ORDER BY created_at DESC
LIMIT 10;

-- ========================================
-- 2. VERIFICAR LA CONSTRAINT PROBLEMÁTICA
-- ========================================

-- Ver la constraint que está fallando
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'rwa_assets'
    AND kcu.column_name = 'owner_id';

-- ========================================
-- 3. POSIBLES SOLUCIONES
-- ========================================

-- OPCIÓN A: ELIMINAR LA CONSTRAINT PROBLEMÁTICA (temporal)
-- CUIDADO: Solo ejecutar si entiendes las consecuencias
-- ALTER TABLE public.rwa_assets DROP CONSTRAINT IF EXISTS rwa_assets_owner_id_fkey;

-- OPCIÓN B: RECREAR LA CONSTRAINT CORRECTAMENTE
-- ALTER TABLE public.rwa_assets 
-- ADD CONSTRAINT rwa_assets_owner_id_fkey 
-- FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- ========================================
-- 4. VER ESTRUCTURA ACTUAL DE LA TABLA
-- ========================================

SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'rwa_assets'
ORDER BY ordinal_position;

-- ========================================
-- INSTRUCCIONES
-- ========================================

/*
1. EJECUTA LA SECCIÓN 1 primero para ver qué usuarios existen
2. Si no hay usuarios o tu email no aparece, el problema es de autenticación
3. Si hay usuarios, ejecuta la SECCIÓN 2 para ver la constraint
4. Dependiendo del resultado, podemos decidir la mejor solución
*/