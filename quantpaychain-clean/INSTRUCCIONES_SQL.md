# 📋 Instrucciones: Ejecutar Script SQL en Supabase

## ⚡ Pasos Rápidos (2 minutos)

### 1. Abre tu Dashboard de Supabase
- Ve a: https://supabase.com/dashboard
- Selecciona tu proyecto QuantPayChain

### 2. Abre el SQL Editor
- En el menú lateral, haz clic en **"SQL Editor"**
- Clic en **"+ New query"**

### 3. Copia y Pega este SQL:

```sql
-- Agregar columna legal_documents a rwa_assets
ALTER TABLE public.rwa_assets 
ADD COLUMN IF NOT EXISTS legal_documents TEXT;

-- Verificar que se agregó correctamente
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'rwa_assets' 
AND column_name = 'legal_documents';
```

### 4. Ejecutar
- Presiona **"Run"** o **Ctrl + Enter**
- Deberías ver un mensaje de éxito

### 5. Verificar
Para confirmar que todo está bien, ejecuta esta query:

```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'rwa_assets'
ORDER BY ordinal_position;
```

Deberías ver `legal_documents` en la lista de columnas.

---

## ✅ ¿Qué hace este script?

Este script agrega la columna `legal_documents` (tipo TEXT) a la tabla `rwa_assets`. Esta columna es necesaria para que el formulario de creación de assets funcione correctamente.

---

## 🎯 Después de ejecutar el script

Una vez que hayas ejecutado el script con éxito:

1. ✅ El error "Could not find the 'legal_documents' column" desaparecerá
2. ✅ Podrás crear assets sin problemas
3. ✅ La página `/create-asset-v2` funcionará completamente

---

## 📸 Confirmación

Cuando termines, por favor:
1. Toma un screenshot del resultado en Supabase
2. Prueba crear un asset en `/create-asset-v2`
3. Confirma que funciona sin errores

---

**Nota:** Si encuentras algún error o necesitas ayuda, avísame y te guiaré paso a paso.
