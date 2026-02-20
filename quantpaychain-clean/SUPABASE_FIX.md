# 🔧 Fix: legal_documents Column Error

## Error Actual
```
Could not find the 'legal_documents' column of 'rwa_assets' in the schema cache
```

## Causa
La tabla `rwa_assets` en Supabase no tiene la columna `legal_documents` que el código espera.

---

## ✅ Solución Rápida (2 minutos)

### Opción 1: SQL Editor en Supabase (RECOMENDADO)

1. **Ir a Supabase Dashboard**
   - https://supabase.com/dashboard
   - Selecciona tu proyecto

2. **Abrir SQL Editor**
   - Sidebar → SQL Editor
   - Click "New query"

3. **Copiar y Pegar este SQL**:
   ```sql
   -- Add missing column
   ALTER TABLE public.rwa_assets 
   ADD COLUMN IF NOT EXISTS legal_documents TEXT;

   -- Verify
   SELECT column_name 
   FROM information_schema.columns 
   WHERE table_name = 'rwa_assets' 
   AND column_name = 'legal_documents';
   ```

4. **Run (Ctrl+Enter)**
   - Deberías ver: "Success. No rows returned"

5. **Probar Create Asset**
   - Ir a `/create-asset-v2`
   - Crear un asset
   - ✅ Debería funcionar sin error

---

### Opción 2: Migration Script Completo

Si quieres agregar TODAS las columnas faltantes:

1. **Abrir SQL Editor en Supabase**

2. **Copiar todo el archivo**: `supabase-migration-add-legal-docs.sql`

3. **Run**
   - Agregará `legal_documents` a rwa_assets
   - Agregará `token_name`, `token_standard`, `updated_at` a tokens
   - Mostrará qué se agregó

---

## 🔍 Verificar Fix

Después de ejecutar el SQL:

```sql
-- Ver estructura de rwa_assets
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'rwa_assets'
ORDER BY ordinal_position;
```

Deberías ver `legal_documents | text` en la lista.

---

## 📝 Alternativa: Hacer legal_documents Opcional en Código

Si no puedes acceder a Supabase SQL Editor:

**Modificar create-asset-v2/page.tsx**:

Cambiar el objeto `asset` para NO incluir `legal_documents`:

```typescript
const asset = {
  id: assetId,
  owner_id: user.id,
  name: formData.name,
  asset_type: formData.asset_type,
  description: formData.description,
  value_usd: parseFloat(formData.value_usd),
  location: formData.location,
  status: "active",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
  // NO incluir legal_documents si no existe en tabla
};
```

Pero esto es solo un workaround. Lo correcto es agregar la columna en Supabase.

---

## 🎯 Después del Fix

Una vez aplicado el fix:

1. ✅ Create asset funcionará completamente
2. ✅ Podrás agregar documentos legales (campo opcional)
3. ✅ No más errores de schema cache

---

## 🚀 Mejora Futura (Opcional)

Agregar campo en el formulario para subir documentos legales:

```typescript
<div>
  <label>Documentos Legales (Opcional)</label>
  <textarea
    value={formData.legal_documents}
    onChange={(e) => setFormData({...formData, legal_documents: e.target.value})}
    placeholder="URLs o referencias a documentos legales..."
  />
</div>
```

---

## 📊 Estado Después del Fix

**Antes:**
- ❌ Error al crear asset
- ❌ Columna faltante

**Después:**
- ✅ Create asset funciona
- ✅ Schema completo
- ✅ Campo legal_documents disponible

---

## ⏱️ Tiempo Estimado
- SQL simple: 1 minuto
- Migration completa: 2 minutos
- Verificación: 1 minuto

**Total: 2-4 minutos** ⚡
