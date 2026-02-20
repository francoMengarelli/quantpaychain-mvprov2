# 🔐 GUÍA DE CONFIGURACIÓN DE VARIABLES DE ENTORNO - VERCEL

**Proyecto:** QuantPay Chain MVP  
**Fecha:** 24 de Octubre de 2024  
**Propósito:** Configurar correctamente todas las variables de entorno en Vercel

---

## 📋 ÍNDICE

1. [Configuración Mínima (MVP Funcional)](#1-configuración-mínima-mvp-funcional-)
2. [Variables por Prioridad](#2-variables-por-prioridad)
3. [Guía Detallada de cada Variable](#3-guía-detallada-de-cada-variable)
4. [Proveedores Recomendados](#4-proveedores-recomendados)
5. [Cómo Agregar Variables en Vercel](#5-cómo-agregar-variables-en-vercel)
6. [Validación Post-Deployment](#6-validación-post-deployment)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. CONFIGURACIÓN MÍNIMA (MVP FUNCIONAL) 🔴

**Para tener la app funcionando en producción, necesitas SOLO estas 3 variables:**

```bash
# ============================================
# MÍNIMO INDISPENSABLE
# ============================================

DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
NEXTAUTH_SECRET="tu-secret-key-de-minimo-32-caracteres-aleatorios"
NEXTAUTH_URL="https://tu-app.vercel.app"
```

### Cómo Obtenerlas:

#### 1️⃣ DATABASE_URL

**Opción A: Vercel Postgres (Recomendado - 1 Click)**
1. Ve a tu proyecto en Vercel Dashboard
2. Pestaña "Storage" → "Create Database"
3. Selecciona "Postgres"
4. Copia el `DATABASE_URL` que te genera automáticamente
5. Se agregará automáticamente a tus variables de entorno

**Opción B: Supabase (Gratis hasta 500MB)**
1. Crea cuenta en https://supabase.com
2. Crea un proyecto nuevo
3. Ve a Settings → Database
4. Copia la "Connection String" en modo "Pooling"
5. Formato: `postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true`

**Opción C: Neon (Serverless Postgres)**
1. Crea cuenta en https://neon.tech
2. Crea un proyecto
3. Copia la connection string
4. Formato: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`

#### 2️⃣ NEXTAUTH_SECRET

**Generar en terminal:**
```bash
openssl rand -base64 32
```

O usar un generador online:
- https://generate-secret.vercel.app/32

**Ejemplo de output:**
```
X3jK9mNpQrS7tVwYz2aBcDeFgHiJkLmN
```

#### 3️⃣ NEXTAUTH_URL

Tu URL de producción en Vercel:
```
https://tu-app-name.vercel.app
```

O tu dominio personalizado:
```
https://quantpaychain.com
```

---

## 2. VARIABLES POR PRIORIDAD

### 🔴 CRÍTICAS (Sin estas, la app no funciona)

```bash
DATABASE_URL="..."                    # Base de datos PostgreSQL
NEXTAUTH_SECRET="..."                 # Secret para autenticación
NEXTAUTH_URL="https://..."            # URL de la aplicación
```

---

### 🟡 IMPORTANTES (Reducen funcionalidad significativamente)

```bash
# Pagos con Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Auditoría con IA
OPENAI_API_KEY="sk-..."
AI_PROVIDER="openai"

# Almacenamiento de Archivos (elegir una opción)
# Opción A: AWS S3
AWS_BUCKET_NAME="quantpaychain-docs"
AWS_FOLDER_PREFIX="contracts/"
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="us-east-1"

# Opción B: Pinata (IPFS)
PINATA_JWT="eyJhbG..."
NEXT_PUBLIC_PINATA_API_KEY="..."
NEXT_PUBLIC_PINATA_SECRET="..."
NEXT_PUBLIC_IPFS_GATEWAY="https://gateway.pinata.cloud/ipfs/"
```

---

### 🟢 OPCIONALES (Mejoran experiencia, pero la app funciona sin ellas)

```bash
# Web3 / Blockchain (para conectar wallets reales)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID="..."
NEXT_PUBLIC_ETHEREUM_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/..."

# Email notifications (opcional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="tu-email@gmail.com"
SMTP_PASSWORD="tu-app-password"
SMTP_FROM="noreply@quantpaychain.com"

# Monitoring (opcional)
SENTRY_DSN="https://..."
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-..."

# Feature Flags (por defecto están en true)
FEATURE_CRYPTO_PAYMENTS="true"
FEATURE_AI_AUDITOR="true"
FEATURE_PQC_SIGNATURES="true"
FEATURE_BLOCKCHAIN_INTEGRATION="false"

# Otros
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://tu-app.vercel.app"
DEBUG="false"
```

---

## 3. GUÍA DETALLADA DE CADA VARIABLE

### 📦 BASE DE DATOS

#### `DATABASE_URL` 🔴 CRÍTICA
```bash
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
```
- **Descripción:** Connection string de PostgreSQL
- **Formato:** `postgresql://[user]:[password]@[host]:[port]/[database]?[options]`
- **Obligatoria:** SÍ
- **Ejemplo:** `postgresql://postgres:mypass123@db.supabase.co:5432/postgres?sslmode=require`
- **Proveedores:**
  - Vercel Postgres (gratis con límites)
  - Supabase (gratis hasta 500MB)
  - Neon (serverless, gratis)
  - Railway (gratis con límites)
- **Nota:** Después de configurar, ejecutar:
  ```bash
  npx prisma migrate deploy
  npx prisma generate
  ```

---

### 🔐 AUTENTICACIÓN (NextAuth.js)

#### `NEXTAUTH_SECRET` 🔴 CRÍTICA
```bash
NEXTAUTH_SECRET="X3jK9mNpQrS7tVwYz2aBcDeFgHiJkLmN"
```
- **Descripción:** Secret key para encriptar JWT tokens
- **Formato:** String aleatorio de mínimo 32 caracteres
- **Obligatoria:** SÍ
- **Generar:** `openssl rand -base64 32`
- **Seguridad:** 🔴 NUNCA compartir ni subir a Git

#### `NEXTAUTH_URL` 🔴 CRÍTICA
```bash
NEXTAUTH_URL="https://tu-app.vercel.app"
```
- **Descripción:** URL pública de tu aplicación
- **Formato:** URL completa con https://
- **Obligatoria:** SÍ
- **Ejemplo:** `https://quantpaychain.vercel.app`
- **Nota:** En Vercel, se auto-detecta si no se configura, pero es mejor especificarla

---

### 💳 PAGOS (Stripe)

#### `STRIPE_SECRET_KEY` 🟡 IMPORTANTE
```bash
STRIPE_SECRET_KEY="sk_test_51H..."
```
- **Descripción:** API secret key de Stripe
- **Formato:** `sk_test_...` (test) o `sk_live_...` (producción)
- **Obligatoria:** NO (pero necesaria para pagos)
- **Obtener:** 
  1. Crea cuenta en https://dashboard.stripe.com
  2. Developers → API keys
  3. Copia "Secret key"
- **Test Mode:** Usa `sk_test_...` para desarrollo
- **Production:** Usa `sk_live_...` cuando actives la cuenta

#### `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` 🟡 IMPORTANTE
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_51H..."
```
- **Descripción:** API publishable key de Stripe (público)
- **Formato:** `pk_test_...` (test) o `pk_live_...` (producción)
- **Obligatoria:** NO
- **Obtener:** Mismo lugar que Secret key
- **Nota:** El prefijo `NEXT_PUBLIC_` lo hace visible en el cliente

#### `STRIPE_WEBHOOK_SECRET` 🟡 IMPORTANTE
```bash
STRIPE_WEBHOOK_SECRET="whsec_..."
```
- **Descripción:** Secret para validar webhooks de Stripe
- **Formato:** `whsec_...`
- **Obligatoria:** NO (pero necesaria para webhooks)
- **Obtener:**
  1. Stripe Dashboard → Developers → Webhooks
  2. Add endpoint: `https://tu-app.vercel.app/api/payments/stripe/webhook`
  3. Seleccionar eventos: `payment_intent.succeeded`, `payment_intent.failed`
  4. Copiar "Signing secret"

---

### 🤖 INTELIGENCIA ARTIFICIAL

#### `OPENAI_API_KEY` 🟡 IMPORTANTE
```bash
OPENAI_API_KEY="sk-proj-..."
```
- **Descripción:** API key de OpenAI para auditoría con GPT-4
- **Formato:** `sk-proj-...` o `sk-...`
- **Obligatoria:** NO (feature opcional)
- **Obtener:**
  1. Crea cuenta en https://platform.openai.com
  2. Settings → API keys
  3. Create new secret key
- **Costo:** Pay-as-you-go (aprox $0.01-0.03 por auditoría)
- **Alternativa:** Usar Anthropic Claude (ver siguiente)

#### `ANTHROPIC_API_KEY` 🟡 ALTERNATIVA
```bash
ANTHROPIC_API_KEY="sk-ant-..."
```
- **Descripción:** API key de Anthropic (Claude)
- **Uso:** Alternativa a OpenAI
- **Obtener:** https://console.anthropic.com

#### `AI_PROVIDER` 🟡 CONFIGURACIÓN
```bash
AI_PROVIDER="openai"
```
- **Valores:** `"openai"` o `"anthropic"`
- **Por defecto:** `"openai"`

---

### 📁 ALMACENAMIENTO DE ARCHIVOS

**IMPORTANTE:** Elegir **SOLO UNA** opción (AWS S3 o Pinata)

#### Opción A: AWS S3

##### `AWS_BUCKET_NAME` 🟡 IMPORTANTE
```bash
AWS_BUCKET_NAME="quantpaychain-documents"
```
- **Descripción:** Nombre del bucket de S3
- **Formato:** Minúsculas, sin espacios

##### `AWS_FOLDER_PREFIX` 🟢 OPCIONAL
```bash
AWS_FOLDER_PREFIX="contracts/"
```
- **Descripción:** Prefijo para organizar archivos en S3
- **Por defecto:** `"contracts/"`

##### `AWS_ACCESS_KEY_ID` 🟡 IMPORTANTE
```bash
AWS_ACCESS_KEY_ID="AKIA..."
```
- **Descripción:** Access key de usuario IAM
- **Obtener:**
  1. AWS Console → IAM → Users
  2. Create user con permisos S3
  3. Security credentials → Create access key

##### `AWS_SECRET_ACCESS_KEY` 🟡 IMPORTANTE
```bash
AWS_SECRET_ACCESS_KEY="wJalrXUt..."
```
- **Descripción:** Secret access key de IAM
- **Obtener:** Se muestra una sola vez al crear access key
- **Seguridad:** 🔴 NUNCA compartir

##### `AWS_REGION` 🟡 IMPORTANTE
```bash
AWS_REGION="us-east-1"
```
- **Descripción:** Región del bucket S3
- **Valores comunes:** `us-east-1`, `us-west-2`, `eu-west-1`

---

#### Opción B: Pinata (IPFS)

##### `PINATA_JWT` 🟡 IMPORTANTE
```bash
PINATA_JWT="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```
- **Descripción:** JWT token de Pinata
- **Obtener:**
  1. Crea cuenta en https://pinata.cloud
  2. API Keys → New Key
  3. Permisos: pinFileToIPFS, unpin
  4. Copia el JWT (se muestra una sola vez)

##### `NEXT_PUBLIC_PINATA_API_KEY` 🟡 IMPORTANTE
```bash
NEXT_PUBLIC_PINATA_API_KEY="..."
```
- **Descripción:** API key de Pinata (público)
- **Obtener:** Mismo lugar que JWT

##### `NEXT_PUBLIC_PINATA_SECRET` 🟡 IMPORTANTE
```bash
NEXT_PUBLIC_PINATA_SECRET="..."
```
- **Descripción:** API secret de Pinata
- **Obtener:** Mismo lugar que JWT

##### `NEXT_PUBLIC_IPFS_GATEWAY` 🟢 OPCIONAL
```bash
NEXT_PUBLIC_IPFS_GATEWAY="https://gateway.pinata.cloud/ipfs/"
```
- **Descripción:** Gateway para acceder a archivos IPFS
- **Por defecto:** `"https://gateway.pinata.cloud/ipfs/"`

---

### 🔗 WEB3 / BLOCKCHAIN

#### `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` 🟢 OPCIONAL
```bash
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID="a1b2c3d4..."
```
- **Descripción:** Project ID de WalletConnect
- **Obligatoria:** NO (modo demo funciona sin esto)
- **Obtener:**
  1. Crea cuenta en https://cloud.walletconnect.com
  2. Create project
  3. Copia el Project ID

#### `NEXT_PUBLIC_ETHEREUM_RPC_URL` 🟢 OPCIONAL
```bash
NEXT_PUBLIC_ETHEREUM_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY"
```
- **Descripción:** RPC endpoint para Ethereum
- **Obligatoria:** NO
- **Proveedores:**
  - Alchemy: https://alchemy.com (gratis hasta 300M requests/mes)
  - Infura: https://infura.io (gratis hasta 100K requests/día)
- **Redes:**
  - Testnet (Sepolia): `https://eth-sepolia.g.alchemy.com/v2/...`
  - Mainnet: `https://eth-mainnet.g.alchemy.com/v2/...`

#### `NEXT_PUBLIC_PROPERTY_TOKEN_CONTRACT` 🟢 OPCIONAL
```bash
NEXT_PUBLIC_PROPERTY_TOKEN_CONTRACT="0x..."
```
- **Descripción:** Dirección del smart contract deployado
- **Obligatoria:** NO (usar después de deployment)
- **Obtener:** Después de hacer `npx hardhat run scripts/deploy.ts --network sepolia`

---

### 📧 EMAIL (OPCIONAL)

#### `SMTP_HOST` 🟢 OPCIONAL
```bash
SMTP_HOST="smtp.gmail.com"
```
- **Descripción:** Servidor SMTP para envío de emails

#### `SMTP_PORT` 🟢 OPCIONAL
```bash
SMTP_PORT="587"
```
- **Descripción:** Puerto SMTP (587 para TLS, 465 para SSL)

#### `SMTP_USER` 🟢 OPCIONAL
```bash
SMTP_USER="tu-email@gmail.com"
```

#### `SMTP_PASSWORD` 🟢 OPCIONAL
```bash
SMTP_PASSWORD="tu-app-password"
```
- **Nota para Gmail:** Usar App Password, no tu contraseña real
  1. Google Account → Security → 2-Step Verification
  2. App passwords → Generate

---

### 🎛️ FEATURE FLAGS

#### `FEATURE_AI_AUDITOR` 🟢 OPCIONAL
```bash
FEATURE_AI_AUDITOR="true"
```
- **Valores:** `"true"` o `"false"`
- **Descripción:** Activar/desactivar auditoría con IA

#### `FEATURE_CRYPTO_PAYMENTS` 🟢 OPCIONAL
```bash
FEATURE_CRYPTO_PAYMENTS="true"
```
- **Valores:** `"true"` o `"false"`
- **Descripción:** Activar/desactivar pagos con crypto

#### `FEATURE_BLOCKCHAIN_INTEGRATION` 🟢 OPCIONAL
```bash
FEATURE_BLOCKCHAIN_INTEGRATION="false"
```
- **Valores:** `"true"` o `"false"`
- **Por defecto:** `"false"` (usar modo demo)

---

### 🔧 CONFIGURACIÓN GENERAL

#### `NODE_ENV` 🟢 AUTO
```bash
NODE_ENV="production"
```
- **Nota:** Vercel lo configura automáticamente

#### `NEXT_PUBLIC_APP_URL` 🟢 OPCIONAL
```bash
NEXT_PUBLIC_APP_URL="https://tu-app.vercel.app"
```
- **Descripción:** URL de la app (para uso en frontend)

#### `DEBUG` 🟢 OPCIONAL
```bash
DEBUG="false"
```
- **Valores:** `"true"` o `"false"`
- **Descripción:** Activar logs de debug

---

## 4. PROVEEDORES RECOMENDADOS

### 💾 Base de Datos
| Proveedor | Plan Gratis | Límites | Facilidad | Recomendación |
|-----------|-------------|---------|-----------|---------------|
| **Vercel Postgres** | ✅ | 256MB, 60h compute | ⭐⭐⭐⭐⭐ | 🥇 Mejor para empezar |
| **Supabase** | ✅ | 500MB, 2GB bandwidth | ⭐⭐⭐⭐ | 🥈 Muy buena opción |
| **Neon** | ✅ | 512MB, 10GB storage | ⭐⭐⭐⭐ | 🥉 Serverless |
| **Railway** | ✅ | $5 crédito mensual | ⭐⭐⭐ | Alternativa |

### 💳 Pagos
| Proveedor | Setup | Test Mode | Fees | Recomendación |
|-----------|-------|-----------|------|---------------|
| **Stripe** | ⭐⭐⭐⭐⭐ | ✅ Excelente | 2.9% + $0.30 | 🥇 Mejor opción |
| PayPal | ⭐⭐⭐ | ✅ | 3.49% + $0.49 | Alternativa |

### 📁 Almacenamiento
| Proveedor | Plan Gratis | Facilidad | Uso | Recomendación |
|-----------|-------------|-----------|-----|---------------|
| **Pinata (IPFS)** | 1GB | ⭐⭐⭐⭐⭐ | Blockchain | 🥇 Para MVP |
| **AWS S3** | 5GB/12 meses | ⭐⭐⭐ | General | 🥈 Para escalar |
| Cloudflare R2 | 10GB | ⭐⭐⭐⭐ | Sin egress fees | 🥉 Alternativa |

### 🤖 Inteligencia Artificial
| Proveedor | Modelo | Costo Estimado | Recomendación |
|-----------|--------|----------------|---------------|
| **OpenAI** | GPT-4o | $0.01-0.03/audit | 🥇 Mejor calidad |
| Anthropic | Claude 3.5 Sonnet | $0.01-0.02/audit | 🥈 Alternativa |

### 🔗 Web3 Infrastructure
| Proveedor | Plan Gratis | Límites | Recomendación |
|-----------|-------------|---------|---------------|
| **Alchemy** | ✅ | 300M compute units/mes | 🥇 Recomendado |
| Infura | ✅ | 100K requests/día | 🥈 Alternativa |

---

## 5. CÓMO AGREGAR VARIABLES EN VERCEL

### Método 1: Dashboard Web (Recomendado)

1. **Ir a tu proyecto en Vercel:**
   - https://vercel.com/tu-usuario/tu-proyecto

2. **Settings → Environment Variables:**
   - Click en pestaña "Settings"
   - Scroll down a "Environment Variables"

3. **Agregar cada variable:**
   ```
   KEY:   DATABASE_URL
   VALUE: postgresql://user:pass@host:5432/db
   
   Environment: ✅ Production ✅ Preview ✅ Development
   ```

4. **Save** después de cada variable

5. **Redeploy:**
   - Deployments → Click en los 3 puntos del último deploy
   - "Redeploy"
   - (O esperar al siguiente push)

---

### Método 2: CLI (Vercel CLI)

1. **Instalar Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Link proyecto:**
   ```bash
   cd tu-proyecto
   vercel link
   ```

4. **Agregar variables:**
   ```bash
   # Una por una
   vercel env add DATABASE_URL production
   # Pegar el valor cuando te lo pida
   
   vercel env add NEXTAUTH_SECRET production
   vercel env add NEXTAUTH_URL production
   ```

5. **Redeploy:**
   ```bash
   vercel --prod
   ```

---

### Método 3: Archivo .env (Para desarrollo local)

```bash
# Crear archivo .env en tu proyecto local
cp .env.example .env

# Editar con tus valores reales
nano .env
```

**⚠️ IMPORTANTE:** 
- El archivo `.env` NO se sube a Git (está en `.gitignore`)
- Para Vercel, debes configurar las variables en el dashboard

---

## 6. VALIDACIÓN POST-DEPLOYMENT

### Checklist de Verificación:

#### 1️⃣ Variables Críticas
```bash
# Verificar que la app arranca
✅ curl https://tu-app.vercel.app/api/health

# Verificar que NextAuth funciona
✅ Visitar: https://tu-app.vercel.app/auth/signin

# Verificar que la DB está conectada
✅ Intentar crear un usuario
✅ Revisar logs en Vercel Dashboard → Functions → View Logs
```

#### 2️⃣ Logs de Vercel
```
Vercel Dashboard → Deployments → Build Logs

Buscar errores como:
❌ "DATABASE_URL is not defined"
❌ "NEXTAUTH_SECRET is required"
❌ "Prisma Client could not connect"
```

#### 3️⃣ Testing Manual
```bash
# Test de autenticación
✅ Crear cuenta
✅ Login
✅ Cerrar sesión

# Test de funcionalidades
✅ Ver dashboard
✅ Subir documento (si S3/Pinata configurado)
✅ Generar contrato
✅ Hacer pago de prueba (si Stripe configurado)
```

---

## 7. TROUBLESHOOTING

### Error: "DATABASE_URL is not defined"
**Solución:**
1. Verificar que agregaste `DATABASE_URL` en Vercel
2. Verificar que está en "Production" environment
3. Redeploy el proyecto

### Error: "NextAuth: Missing secret"
**Solución:**
1. Generar secret: `openssl rand -base64 32`
2. Agregar `NEXTAUTH_SECRET` en Vercel
3. Redeploy

### Error: "Prisma Client could not connect"
**Soluciones:**
1. Verificar formato de `DATABASE_URL`:
   ```
   postgresql://user:password@host:5432/dbname?sslmode=require
   ```
2. Verificar que el host es accesible públicamente
3. Ejecutar migraciones:
   ```bash
   npx prisma migrate deploy
   ```

### Error: "Stripe API key invalid"
**Solución:**
1. Verificar que usas la key correcta (test vs production)
2. Verificar que no hay espacios extras
3. Regenerar key en Stripe Dashboard si es necesario

### Error: "OpenAI API key invalid"
**Solución:**
1. Verificar que la key es válida en https://platform.openai.com
2. Verificar que tienes créditos disponibles
3. Verificar el formato: `sk-proj-...` o `sk-...`

### La app funciona local pero no en Vercel
**Causas comunes:**
1. Variables de entorno no configuradas en Vercel
2. Diferencias entre `.env.local` y Vercel Environment Variables
3. Node version diferente (verificar en `package.json` → `engines`)

### Webhooks de Stripe no funcionan
**Solución:**
1. Verificar que el endpoint está configurado en Stripe:
   ```
   https://tu-app.vercel.app/api/payments/stripe/webhook
   ```
2. Verificar que `STRIPE_WEBHOOK_SECRET` está configurado
3. Verificar logs en Stripe Dashboard → Developers → Webhooks → Events

---

## 📝 TEMPLATE DE VARIABLES COMPLETO

**Copia este template y reemplaza los valores:**

```bash
# ============================================
# CRÍTICAS (Obligatorias)
# ============================================
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
NEXTAUTH_SECRET="[GENERAR CON: openssl rand -base64 32]"
NEXTAUTH_URL="https://tu-app.vercel.app"

# ============================================
# IMPORTANTES (Recomendadas)
# ============================================

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# OpenAI
OPENAI_API_KEY="sk-proj-..."
AI_PROVIDER="openai"

# AWS S3 (Opción A)
AWS_BUCKET_NAME="quantpaychain-documents"
AWS_FOLDER_PREFIX="contracts/"
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="us-east-1"

# Pinata/IPFS (Opción B)
PINATA_JWT="eyJhbGciOi..."
NEXT_PUBLIC_PINATA_API_KEY="..."
NEXT_PUBLIC_PINATA_SECRET="..."
NEXT_PUBLIC_IPFS_GATEWAY="https://gateway.pinata.cloud/ipfs/"

# ============================================
# OPCIONALES (Mejoran experiencia)
# ============================================

# WalletConnect
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID="..."

# Alchemy/Infura
NEXT_PUBLIC_ETHEREUM_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/..."

# Feature Flags
FEATURE_AI_AUDITOR="true"
FEATURE_CRYPTO_PAYMENTS="true"
FEATURE_BLOCKCHAIN_INTEGRATION="false"

# General
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://tu-app.vercel.app"
DEBUG="false"
```

---

## 🎯 ESTRATEGIA DE DEPLOYMENT RECOMENDADA

### Fase 1: MVP Mínimo (15 minutos)
```bash
✅ DATABASE_URL          → Vercel Postgres (1 click)
✅ NEXTAUTH_SECRET       → openssl rand -base64 32
✅ NEXTAUTH_URL          → Auto-detectado por Vercel
```
**Resultado:** App funcional con autenticación

---

### Fase 2: Funcionalidades Core (30 minutos)
```bash
✅ STRIPE_SECRET_KEY (test)
✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
✅ PINATA_JWT
✅ NEXT_PUBLIC_PINATA_API_KEY
✅ NEXT_PUBLIC_PINATA_SECRET
```
**Resultado:** Pagos y almacenamiento funcionando

---

### Fase 3: Features Avanzadas (45 minutos)
```bash
✅ OPENAI_API_KEY
✅ NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
✅ NEXT_PUBLIC_ETHEREUM_RPC_URL
```
**Resultado:** IA y Web3 activos

---

## 📞 SOPORTE

**Documentación Oficial:**
- Vercel Env Vars: https://vercel.com/docs/environment-variables
- Next.js Env Vars: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
- Prisma: https://www.prisma.io/docs/reference/database-reference/connection-urls

**Errores comunes:**
- Consultar `INTEGRATION_STATUS.md` para diagnóstico de integraciones
- Revisar logs en Vercel Dashboard

---

**Documento generado el 24 de Octubre de 2024**  
**Siguiente paso:** Ver `VERCEL_DEPLOYMENT_GUIDE.md` para instrucciones de deployment
