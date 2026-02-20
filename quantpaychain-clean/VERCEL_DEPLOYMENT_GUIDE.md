# 🚀 Guía de Deployment en Vercel

## Issue 2: Deployment de Vercel Desactualizado

### Síntoma:
El frontend en Vercel está atascado en un commit antiguo (a3f294b). Los cambios recientes no están en producción.

---

## ✅ Checklist de Verificación

### 1. Verificar Variables de Entorno en Vercel

Ve a: **Vercel Dashboard → Tu Proyecto → Settings → Environment Variables**

Debe tener:
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `NEXT_PUBLIC_API_URL` = `https://quantpaychain-api.onrender.com` **(NUEVA)**
- ✅ `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` (opcional)

### 2. Verificar Configuración del Proyecto

**Root Directory:** Debe estar vacío o ser `/`

**Framework Preset:** Next.js

**Build Command:** `cd apps/web && yarn build`

**Output Directory:** `apps/web/.next`

**Install Command:** `yarn install`

### 3. Verificar Git Integration

1. Ve a **Settings → Git**
2. Verifica que esté conectado al repositorio correcto
3. Branch: `main`
4. **Production Branch:** `main`

### 4. Revisar Logs de Deployments

Ve a **Deployments** y revisa los logs del deployment más reciente:

#### ❌ Si falló el build:
- Busca errores de TypeScript
- Busca errores de dependencias (`yarn.lock` desactualizado)
- Busca errores de variables de entorno faltantes

#### ✅ Si el build fue exitoso pero no se ve:
- Puede ser cache del navegador
- Prueba en incógnito o limpia cache
- Verifica que el deployment esté marcado como "Production"

---

## 🔧 Soluciones Comunes

### Problema 1: Build falla por TypeScript

```bash
# En local, verifica que compile sin errores
cd apps/web
yarn tsc --noEmit
```

Si hay errores, arregla antes de hacer push.

### Problema 2: Dependencias desactualizadas

```bash
# Regenerar yarn.lock
rm yarn.lock
yarn install
git add yarn.lock
git commit -m "Update yarn.lock"
git push
```

### Problema 3: Vercel no detecta cambios

**Opción A: Redeploy Manual**
1. Ve a Deployments
2. Encuentra el último deployment
3. Click en "..." → "Redeploy"

**Opción B: Trigger nuevo deployment**
```bash
# Hacer un cambio trivial y push
git commit --allow-empty -m "Trigger Vercel deployment"
git push
```

### Problema 4: Monorepo no detectado correctamente

Si Vercel no detecta el monorepo:

1. Ve a **Settings → General**
2. En **Root Directory**, asegúrate que esté en `/` o vacío
3. Verifica que `vercel.json` esté en la raíz del proyecto

---

## 🧪 Verificación Post-Deployment

Una vez que el deployment sea exitoso:

### 1. Verificar URL de Producción

Abre: `https://quantpaychain.com` (o tu dominio de Vercel)

### 2. Verificar que los cambios estén presentes

- ✅ El campo "Nombre del Token" debe aparecer en `/create-asset-v2`
- ✅ El favicon debe cargar (sin error 404)
- ✅ El dashboard debe cargar sin errores 406

### 3. Verificar integración con Backend

Abre la consola del navegador (F12) y verifica:

```javascript
console.log(process.env.NEXT_PUBLIC_API_URL)
// Debe mostrar: https://quantpaychain-api.onrender.com
```

### 4. Probar funcionalidad E2E

1. Crear un asset en `/create-asset-v2`
2. Verificar que aparezca en `/dashboard`
3. Verificar que aparezca en `/marketplace`

---

## 📞 Si el problema persiste

1. **Revisa los logs de build en Vercel Dashboard**
2. **Compara el commit desplegado vs el commit actual en GitHub**
3. **Verifica que no haya límites de uso alcanzados** (Free tier tiene límites)
4. **Contacta soporte de Vercel** si todo lo anterior está correcto

---

## 🎯 Archivos Clave

- `/vercel.json` - Configuración de deployment
- `/apps/web/package.json` - Dependencias del frontend
- `/apps/web/.env.example` - Variables de entorno requeridas
- `/turbo.json` - Configuración de Turborepo
