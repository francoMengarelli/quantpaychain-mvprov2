# 🔧 FIX: Vercel 404 - Root Directory No Configurado

## 🚨 PROBLEMA

Vercel deployó pero muestra 404 porque:
- Build completó en 71ms (demasiado rápido)
- "No files were prepared"
- Vercel busca archivos en `/` pero frontend está en `/frontend`

## ✅ SOLUCIÓN: Configurar Root Directory

### **Paso 1: Ve a Vercel Dashboard**

1. https://vercel.com/tu-usuario/tu-proyecto
2. Click en **"Settings"**
3. Busca sección **"Build & Development Settings"**

### **Paso 2: Configura Root Directory**

```
Root Directory: frontend
```

**CRÍTICO**: Cambia de `.` o `/` a **`frontend`**

### **Paso 3: Verifica otras settings**

```yaml
Framework Preset: Create React App
Build Command: yarn build (dejar default)
Output Directory: build (dejar default)
Install Command: yarn install (dejar default)
Node.js Version: 18.x o 20.x (recomendado)
```

### **Paso 4: Fuerza Redeploy**

1. Ve a **"Deployments"**
2. Click en el último deployment
3. Click **"⋮"** (tres puntos)
4. Click **"Redeploy"**
5. Espera 2-3 minutos

## 📊 VERIFICACIÓN

Cuando termine el deploy, verás:

```
Build Completed in /vercel/output [5-10s]
Built 10-15 static files
Deployment ready
```

NO debe decir "71ms" - debe tomar al menos 5-10 segundos.

## 🎯 CONFIRMACIÓN POST-DEPLOY

```bash
# Debe cargar la app
curl https://tu-app.vercel.app

# NO debe ser 404
# Debe devolver HTML con tu app
```

## 🔧 ALTERNATIVA: Configurar vía vercel.json

Si prefieres configurarlo en código, actualiza `/app/vercel.json`:

```json
{
  "buildCommand": "cd frontend && yarn build",
  "outputDirectory": "frontend/build",
  "installCommand": "cd frontend && yarn install",
  "framework": "create-react-app"
}
```

Pero es MÁS FÁCIL hacerlo desde el dashboard.

## 🌐 ESTRUCTURA CORRECTA

Tu proyecto tiene esta estructura:
```
/
├── backend/         # ← Ignorado por Vercel
├── frontend/        # ← AQUÍ está tu app
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── build/
└── .vercelignore
```

Vercel necesita saber que debe trabajar en `frontend/`

## ⚡ RESUMEN

1. **Settings** → **Root Directory** = `frontend`
2. **Redeploy**
3. ✅ Listo

---

**Tiempo: 2 minutos**
