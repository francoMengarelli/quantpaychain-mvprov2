# 🔐 Variables de Entorno Completas - Deployment Production

## 📊 BACKEND (Render) - quantpaychain-api2

### Variables Críticas de Producción

```bash
# ============ BASE DE DATOS ============
MONGO_URL=mongodb+srv://usuario:password@cluster.mongodb.net/quantpaychain
DB_NAME=quantpaychain

# ============ SUPABASE (PostgreSQL) ============
SUPABASE_URL=https://ckitbbtlzzxuangsieqo.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNraXRiYnRsenp4dWFuZ3NpZXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MTEyNTYsImV4cCI6MjA3OTE4NzI1Nn0.FM2PDrZrwCgp5nrW6aYziACnV15g-WLEyCb15rqg2B8

# ============ AI SERVICES ============
EMERGENT_LLM_KEY=sk-emergent-7A968AeD5Dc41Be1bD

# ============ PAYMENTS ============
STRIPE_SECRET_KEY=sk_test_emergent
STRIPE_WEBHOOK_SECRET=whsec_xxx  # Opcional por ahora

# ============ MICROSERVICIO QPC ============
QPC_SERVICE_URL=https://quantpaychain-qpc-service.onrender.com

# ============ CORS & SECURITY ============
CORS_ORIGINS=https://www.quantpaychain.com,https://quantpaychain-mvprov2-web-qd-git-a47bf4-quantpaychains-projects.vercel.app,https://quantpaychain-mvprov2-web-qdtm-ho15ttema.vercel.app

# ============ ESCALABILIDAD ============
WORKERS=2  # Número de workers uvicorn (ajustar según plan)
MAX_CONNECTIONS=100  # Máximo de conexiones simultáneas
TIMEOUT=60  # Timeout en segundos

# ============ RATE LIMITING ============
RATE_LIMIT_PER_MINUTE=60  # Requests por minuto por IP
RATE_LIMIT_BURST=10  # Burst permitido

# ============ LOGS & MONITORING ============
LOG_LEVEL=INFO  # DEBUG, INFO, WARNING, ERROR
SENTRY_DSN=  # Opcional: para error tracking

# ============ FEATURES FLAGS ============
ENABLE_QPC_FEATURES=true  # Activar features PQC/ISO20022
ENABLE_AI_ADVISOR=true
ENABLE_EARNINGS_SYSTEM=true
```

---

## 🎨 FRONTEND (Vercel) - quantpaychain-mvprov2

### Variables de Producción

```bash
# ============ BACKEND API ============
REACT_APP_BACKEND_URL=https://quantpaychain-api2.onrender.com/api

# ============ SUPABASE (para auth directo) ============
REACT_APP_SUPABASE_URL=https://ckitbbtlzzxuangsieqo.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNraXRiYnRsenp4dWFuZ3NpZXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MTEyNTYsImV4cCI6MjA3OTE4NzI1Nn0.FM2PDrZrwCgp5nrW6aYziACnV15g-WLEyCb15rqg2B8

# ============ STRIPE (para checkout) ============
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_emergent

# ============ FEATURES FLAGS ============
REACT_APP_ENABLE_PWA=true
REACT_APP_ENABLE_EARNINGS_DASHBOARD=true
REACT_APP_ENABLE_QPC_FEATURES=true

# ============ ANALYTICS (Opcional) ============
REACT_APP_GA_TRACKING_ID=  # Google Analytics
REACT_APP_HOTJAR_ID=  # Hotjar para heatmaps

# ============ ENVIRONMENT ============
NODE_ENV=production
```

---

## 🔧 QPC MICROSERVICE (Render) - quantpaychain-qpc-service

### Variables del Microservicio

```bash
# ============ SERVER CONFIG ============
QPC_SERVICE_PORT=3001
NODE_ENV=production

# ============ CORS ============
ALLOWED_ORIGINS=https://quantpaychain-api2.onrender.com,https://www.quantpaychain.com

# ============ RATE LIMITING ============
QPC_RATE_LIMIT=100  # Requests por minuto

# ============ LOGGING ============
LOG_LEVEL=info  # debug, info, warn, error

# ============ CACHE ============
REDIS_URL=  # Opcional: para cache de keys PQC

# ============ FEATURES ============
ENABLE_PQC_KEY_ROTATION=true
ENABLE_ISO20022_VALIDATION=true
ENABLE_KYC_AML_CHECKS=true
```

---

## 📈 VARIABLES PARA ESCALABILIDAD

### MongoDB Atlas (Recomendado para Producción)

**Free Tier**: 512MB, suficiente para empezar
**Upgrade a**: M2 ($9/mes) o M5 ($25/mes) según crecimiento

```bash
# Conexión optimizada con pooling
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/quantpaychain?retryWrites=true&w=majority&maxPoolSize=50
```

### Render.com Plans

**Free**: 
- CPU: 0.1 vCPU
- RAM: 512 MB
- Sleep después de 15 min inactividad
- ❌ No recomendado para producción

**Starter ($7/mes)**: ⭐ RECOMENDADO
- CPU: 0.5 vCPU  
- RAM: 512 MB
- ✅ Sin sleep
- ✅ Suficiente para 100-500 usuarios concurrentes

**Standard ($25/mes)**:
- CPU: 1 vCPU
- RAM: 2 GB
- ✅ Para 500-2000 usuarios concurrentes

### Vercel Plans

**Hobby (Free)**: ⭐ SUFICIENTE PARA EMPEZAR
- 100GB bandwidth/mes
- Edge Functions ilimitadas
- ✅ Escala automáticamente

**Pro ($20/mes)**:
- 1TB bandwidth/mes
- Analytics avanzado
- Teams y colaboradores

---

## 🔒 SEGURIDAD EN PRODUCCIÓN

### Variables Adicionales Recomendadas

```bash
# Backend
JWT_SECRET=genera_un_secret_largo_y_aleatorio_aqui
JWT_EXPIRATION=86400  # 24 horas
REFRESH_TOKEN_EXPIRATION=604800  # 7 días

# Rate Limiting por endpoint
RATE_LIMIT_LOGIN=5  # 5 intentos por minuto
RATE_LIMIT_REGISTER=3  # 3 registros por hora
RATE_LIMIT_API=60  # 60 requests por minuto

# Seguridad adicional
ENABLE_HTTPS_ONLY=true
ENABLE_CSRF_PROTECTION=true
SECURE_COOKIES=true
```

---

## 📊 MONITOREO & OBSERVABILIDAD

### Herramientas Recomendadas (Opcionales)

```bash
# Error Tracking
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx

# Application Performance Monitoring
NEW_RELIC_LICENSE_KEY=xxx

# Logging
DATADOG_API_KEY=xxx
LOGTAIL_TOKEN=xxx
```

---

## 🧪 VARIABLES PARA TESTING

### Variables de Desarrollo/Staging

```bash
# Backend Test
MONGO_URL=mongodb://localhost:27017/quantpaychain_test
CORS_ORIGINS=*
ENABLE_DEBUG=true

# Frontend Test  
REACT_APP_BACKEND_URL=http://localhost:8001/api
REACT_APP_ENABLE_DEV_TOOLS=true
```

---

## ✅ CHECKLIST DE VARIABLES

### Backend Render
- [ ] MONGO_URL configurado
- [ ] SUPABASE_URL y KEY
- [ ] EMERGENT_LLM_KEY
- [ ] STRIPE_SECRET_KEY
- [ ] QPC_SERVICE_URL (después de deployar QPC)
- [ ] CORS_ORIGINS con dominios correctos
- [ ] WORKERS=2 (plan Starter+)

### Frontend Vercel
- [ ] REACT_APP_BACKEND_URL
- [ ] REACT_APP_SUPABASE_URL
- [ ] REACT_APP_SUPABASE_ANON_KEY
- [ ] REACT_APP_STRIPE_PUBLIC_KEY
- [ ] Feature flags activados

### QPC Microservice
- [ ] QPC_SERVICE_PORT=3001
- [ ] NODE_ENV=production
- [ ] ALLOWED_ORIGINS
- [ ] Feature flags

---

## 🚀 OPTIMIZACIONES PARA 1000+ USUARIOS

```bash
# Backend (Render Standard plan)
WORKERS=4
MAX_CONNECTIONS=200
KEEPALIVE_TIMEOUT=65

# Database
MONGO_URL=...&maxPoolSize=100&minPoolSize=10

# Redis para cache (Upstash free tier)
REDIS_URL=redis://default:xxx@xxx.upstash.io:6379

# CDN para assets estáticos
CDN_URL=https://xxx.cloudfront.net
```
