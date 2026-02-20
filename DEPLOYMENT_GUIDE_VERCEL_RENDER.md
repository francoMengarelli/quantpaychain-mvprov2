# 🚀 Guía de Deployment: Vercel + Render

## 📋 PRE-DEPLOYMENT CHECKLIST

✅ Backend compila sin errores  
✅ Frontend compila sin errores  
✅ Sistema de ganancias implementado  
✅ PWA configurado  
✅ Responsive optimizado  

---

## PASO 1: DEPLOYMENT BACKEND (Render.com)

### 1.1 Conectar Repositorio

1. Ve a: **https://dashboard.render.com/**
2. Click **"New +"** → **"Web Service"**
3. Conecta tu cuenta de GitHub
4. Selecciona tu repositorio

### 1.2 Configurar el Servicio

```yaml
Name: quantpaychain-api
Region: Oregon (US West) o el más cercano
Branch: main (o tu branch principal)
Root Directory: backend
Runtime: Python 3
Build Command: pip install -r requirements.txt
Start Command: uvicorn server:app --host 0.0.0.0 --port $PORT --workers 1
```

### 1.3 Variables de Entorno

Click **"Environment"** y agrega:

```bash
# Base de Datos
MONGO_URL=mongodb+srv://tu-usuario:tu-password@cluster.mongodb.net/quantpaychain
DB_NAME=quantpaychain

# Supabase (ya las tienes)
SUPABASE_URL=https://ckitbbtlzzxuangsieqo.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNraXRiYnRsenp4dWFuZ3NpZXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MTEyNTYsImV4cCI6MjA3OTE4NzI1Nn0.FM2PDrZrwCgp5nrW6aYziACnV15g-WLEyCb15rqg2B8

# AI & Payments
EMERGENT_LLM_KEY=sk-emergent-7A968AeD5Dc41Be1bD
STRIPE_SECRET_KEY=sk_test_emergent

# QPC Service (temporal - localhost para empezar)
QPC_SERVICE_URL=http://localhost:3001

# CORS - ACTUALIZAR después del deploy de frontend
CORS_ORIGINS=*
```

### 1.4 Deploy

1. Click **"Create Web Service"**
2. Espera 3-5 minutos
3. Copia la URL: `https://quantpaychain-api.onrender.com`

### 1.5 Verificar

```bash
curl https://quantpaychain-api.onrender.com/api/assets
# Debe devolver: []

curl https://quantpaychain-api.onrender.com/docs
# Debe mostrar documentación Swagger
```

✅ **Backend Deployed!**

---

## PASO 2: DEPLOYMENT FRONTEND (Vercel)

### 2.1 Conectar Repositorio

1. Ve a: **https://vercel.com/new**
2. Click **"Import Git Repository"**
3. Conecta GitHub y selecciona tu repo
4. Click **"Import"**

### 2.2 Configurar el Proyecto

```yaml
Framework Preset: Create React App
Root Directory: frontend
Build Command: yarn build (auto-detectado)
Output Directory: build (auto-detectado)
Install Command: yarn install (auto-detectado)
```

### 2.3 Variables de Entorno

Click **"Environment Variables"** y agrega:

```bash
REACT_APP_BACKEND_URL=https://quantpaychain-api.onrender.com/api
```

⚠️ **IMPORTANTE**: Usa la URL exacta de tu backend de Render (Paso 1.4)

### 2.4 Deploy

1. Click **"Deploy"**
2. Espera 2-3 minutos
3. Copia la URL: `https://quantpaychain.vercel.app`

### 2.5 Verificar

Abre en navegador:
- `https://quantpaychain.vercel.app`
- Debe cargar la landing page
- Prueba login/registro
- Ve a `/earnings` para el dashboard

✅ **Frontend Deployed!**

---

## PASO 3: CONFIGURACIÓN POST-DEPLOYMENT

### 3.1 Actualizar CORS en Backend

1. Ve a Render Dashboard → Tu servicio
2. Environment → Editar `CORS_ORIGINS`
3. Cambia de `*` a:
```bash
CORS_ORIGINS=https://quantpaychain.vercel.app,https://quantpaychain-*.vercel.app
```
4. Guarda y redeploy automático

### 3.2 Verificar PWA en Móvil

**iOS**:
1. Abre Safari
2. Ve a: `https://quantpaychain.vercel.app`
3. Toca el botón "Compartir" (⬆️)
4. Selecciona "Agregar a pantalla de inicio"
5. ¡Ahora es una app! 📱

**Android**:
1. Abre Chrome
2. Ve a: `https://quantpaychain.vercel.app`
3. Toca menú (⋮)
4. Selecciona "Instalar app" o "Agregar a pantalla de inicio"
5. ¡Ahora es una app! 📱

---

## PASO 4: TESTING COMPLETO

### 4.1 Test Backend

```bash
# Health check
curl https://quantpaychain-api.onrender.com/api/assets

# API docs
open https://quantpaychain-api.onrender.com/docs
```

### 4.2 Test Frontend

1. **Landing**: `https://quantpaychain.vercel.app`
2. **Dashboard**: Login → `/dashboard`
3. **Marketplace**: `/marketplace`
4. **Earnings**: `/earnings` ⭐ (NUEVO)
5. **Create Asset**: `/create-asset`

### 4.3 Test Sistema de Ganancias

1. Crea un asset y tokenízalo
2. Compra algunos tokens
3. Registra revenue (como owner):
```bash
curl -X POST https://quantpaychain-api.onrender.com/api/earnings/revenue \
  -H "Content-Type: application/json" \
  -H "Cookie: session=tu_session" \
  -d '{
    "asset_id": "tu_asset_id",
    "amount": 1000,
    "revenue_type": "rent",
    "description": "Test revenue"
  }'
```
4. Distribuir dividendos
5. Ver en `/earnings` dashboard

---

## PASO 5: OPTIMIZACIONES DE PRODUCCIÓN

### 5.1 Render.com

**Plan Gratuito** (suficiente para empezar):
- ✅ Auto-sleep después de inactividad
- ✅ 512MB RAM
- ✅ HTTPS gratis
- ⚠️ Cold starts (~30s)

**Upgrade a Starter ($7/mes)**:
- ✅ Sin sleep
- ✅ 1GB RAM
- ✅ Mejor performance

### 5.2 Vercel

**Plan Hobby** (gratis):
- ✅ 100GB bandwidth/mes
- ✅ Deploys ilimitados
- ✅ HTTPS automático
- ✅ CDN global

**Dominio Personalizado** (opcional):
1. Compra dominio (Namecheap, GoDaddy)
2. Vercel → Settings → Domains
3. Agrega tu dominio
4. Configura DNS (Vercel te da instrucciones)

---

## PASO 6: MONITOREO

### 6.1 Logs

**Render**:
- Dashboard → Tu servicio → "Logs"
- Ver errores en tiempo real

**Vercel**:
- Dashboard → Tu proyecto → "Deployments" → Ver logs

### 6.2 Métricas

**Vercel Analytics** (gratis):
1. Vercel Dashboard → Analytics
2. Ve tráfico, performance, etc.

**Render Metrics** (incluido):
1. Dashboard → Metrics
2. CPU, memoria, requests

---

## 🚨 TROUBLESHOOTING

### Backend no responde

```bash
# Verificar logs en Render
# Common issues:
# - Variable de entorno mal configurada
# - MONGO_URL incorrecto
# - Puerto incorrecto (debe usar $PORT)
```

**Fix**:
1. Render → Logs → buscar error
2. Environment → verificar todas las variables
3. Manual Deploy si es necesario

### Frontend muestra errores de CORS

**Síntomas**: `Access-Control-Allow-Origin` error en console

**Fix**:
1. Verifica que `CORS_ORIGINS` en backend incluya tu dominio Vercel
2. Backend debe tener:
```python
allow_origins=["https://tu-app.vercel.app"]
```

### PWA no se instala

**Requisitos**:
- ✅ HTTPS (Vercel lo da gratis)
- ✅ manifest.json válido
- ✅ Service worker registrado
- ✅ Ícono de al menos 192x192

**Verificar**:
1. Chrome DevTools → Application → Manifest
2. Debe mostrar sin errores

### Backend hace cold start

**Problema**: Render plan gratuito duerme el servicio

**Solución temporal**:
- Usar un servicio de ping (UptimeRobot) cada 5 minutos

**Solución permanente**:
- Upgrade a plan Starter ($7/mes)

---

## 📊 MÉTRICAS DE ÉXITO

✅ Backend responde en < 2s  
✅ Frontend carga en < 3s  
✅ PWA instalable en iOS/Android  
✅ Sistema de earnings funcional  
✅ Sin errores en console  
✅ CORS configurado correctamente  

---

## 🎉 POST-DEPLOYMENT

### URLs Finales

```
Frontend: https://quantpaychain.vercel.app
Backend API: https://quantpaychain-api.onrender.com/api
API Docs: https://quantpaychain-api.onrender.com/docs
Earnings Dashboard: https://quantpaychain.vercel.app/earnings
```

### Compartir con el Mundo

1. **Twitter/LinkedIn**:
   - "Lanzamos QuantPayChain - Plataforma de tokenización RWA con dividendos automáticos"
   - Link: tu dominio

2. **Demo para Inversores**:
   - Crea algunos assets demo
   - Tokeniza con buenos ejemplos
   - Muestra el dashboard de earnings

3. **B2B Integration**:
   - Comparte la API docs
   - Ofrece embed via iframe
   - White-label disponible

---

## 🔄 CONTINUOUS DEPLOYMENT

**Vercel**: Auto-deploy en cada push a main  
**Render**: Auto-deploy en cada push a main  

Simplemente:
```bash
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main
```

¡Y se deploya automáticamente! 🚀

---

## 📞 SOPORTE

**Render Issues**: https://community.render.com/  
**Vercel Issues**: https://vercel.com/support  
**Documentación Completa**: `/app/SISTEMA_GANANCIAS_COMPLETO.md`

---

**¡Deployment Exitoso! 🎉**

Tiempo total estimado: **15-20 minutos**  
Costo: **$0/mes** (planes gratuitos)  
Uptime: **99.9%**
