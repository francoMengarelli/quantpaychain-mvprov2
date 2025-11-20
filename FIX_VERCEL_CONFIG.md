# 🔧 Guía Rápida: Arreglar Configuración de Vercel

## ❌ Problema Actual
Vercel está buscando el directorio "apps/web" como Root Directory, pero debe buscar desde la raíz del proyecto.

## ✅ Solución (Pasos Simples)

### Paso 1: Ir a Configuración del Proyecto
1. Ve a tu dashboard de Vercel: https://vercel.com/dashboard
2. Click en tu proyecto **"quantpaychain-mvprov2"**
3. Click en **"Settings"** (Configuración) en la parte superior

### Paso 2: Cambiar Root Directory
1. En el menú izquierdo, busca **"General"** 
2. Scroll hacia abajo hasta encontrar **"Root Directory"**
3. **IMPORTANTE**: Debe estar vacío o con un punto "."
4. Si dice "apps/web", haz click en **"Edit"**
5. **Borra el texto** o pon solo un punto "."
6. Click en **"Save"** (Guardar)

### Paso 3: Cambiar Build & Output Settings (Si aparece)
1. En el mismo menu "Settings", busca **"Build & Development Settings"**
2. **Framework Preset**: Debe ser "Next.js"
3. **Build Command**: Déjalo en blanco (Vercel lo detectará automáticamente)
4. **Output Directory**: Déjalo en blanco
5. **Install Command**: Déjalo en blanco
6. Click en **"Save"**

### Paso 4: Forzar Nuevo Deployment
1. Ve a la pestaña **"Deployments"** 
2. Click en el deployment más reciente (el que falló)
3. Click en los 3 puntos "..." a la derecha
4. Click en **"Redeploy"**
5. Marca la opción **"Use existing Build Cache"** si aparece
6. Click en **"Redeploy"**

---

## 🎯 Configuración Correcta que Debe Quedar

```
Root Directory: . (o vacío)
Framework: Next.js
Build Command: (automático)
Output Directory: (automático)
Install Command: (automático)
```

---

## ⚠️ Si el Error Persiste

Si después de estos pasos sigue fallando, puede ser por la configuración del monorepo. En ese caso:

1. Copia este texto y envíamelo:
   - El mensaje de error exacto del deployment
   - Una captura de pantalla de la sección "Root Directory" en Settings

2. Yo ajustaré el archivo `vercel.json` para que funcione correctamente

---

## 📝 Nota Importante

El proyecto usa **Turborepo** (monorepo), y Vercel debe detectarlo automáticamente. El archivo `vercel.json` en la raíz del proyecto ya tiene la configuración correcta para esto.

---

¿Necesitas ayuda? Avísame cuando hayas hecho estos cambios y te ayudo con el siguiente paso! 🚀
