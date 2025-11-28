-- =====================================================
-- FIX: RLS Policies para evitar error 406 en tokens
-- =====================================================
-- Ejecutar estos comandos en el SQL Editor de Supabase

-- 1. Verificar políticas existentes para la tabla tokens
SELECT * FROM pg_policies WHERE tablename = 'tokens';

-- 2. Eliminar políticas existentes si causan conflictos
DROP POLICY IF EXISTS "Enable read access for all users" ON tokens;
DROP POLICY IF EXISTS "Users can view all tokens" ON tokens;

-- 3. Crear política de lectura pública para tokens
-- (necesario para marketplace)
CREATE POLICY "Public read access for active tokens"
ON tokens
FOR SELECT
USING (true);

-- 4. Crear política para que usuarios puedan insertar sus propios tokens
CREATE POLICY "Users can insert their own tokens"
ON tokens
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM rwa_assets
    WHERE rwa_assets.id = tokens.asset_id
    AND rwa_assets.owner_id = auth.uid()
  )
);

-- 5. Verificar políticas de rwa_assets también
DROP POLICY IF EXISTS "Users can view all active assets" ON rwa_assets;

-- 6. Crear política de lectura pública para assets activos
CREATE POLICY "Public read access for active assets"
ON rwa_assets
FOR SELECT
USING (status = 'active' OR owner_id = auth.uid());

-- 7. Verificar que las políticas se crearon correctamente
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename IN ('tokens', 'rwa_assets')
ORDER BY tablename, policyname;

-- =====================================================
-- NOTAS:
-- =====================================================
-- Si el error 406 persiste después de estas políticas:
-- 1. Verifica que RLS esté habilitado: ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;
-- 2. Verifica que las columnas existan en ambas tablas
-- 3. Prueba la query directamente en SQL Editor antes de usarla en el frontend
