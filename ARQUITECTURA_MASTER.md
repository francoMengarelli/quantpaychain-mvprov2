# 🏗️ QuantPayChain - Arquitectura Master

**Última actualización:** 20 Noviembre 2025  
**Arquitecto:** AI Assistant  
**Propietario:** Franco Mengarelli (@francoMengarelli)

---

## 📋 Índice

1. [Visión del Proyecto](#visión-del-proyecto)
2. [Arquitectura General](#arquitectura-general)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Flujo de Deployment](#flujo-de-deployment)
6. [Base de Datos](#base-de-datos)
7. [Guía de Migración](#guía-de-migración)

---

## 🎯 Visión del Proyecto

**QuantPayChain NO es una blockchain nueva**, es una **plataforma de tokenización de activos del mundo real (RWA)** que utiliza blockchains existentes.

### Propósito Principal
- Tokenizar activos reales (bienes raíces, commodities, facturas)
- Marketplace para comprar/vender tokens
- Sistema de pagos real integrado
- Reportes compatibles con ISO 20022
- Análisis con IA

### Diferenciadores
1. **Multicadena**: Soporta 6 blockchains
2. **ISO 20022**: Estándar financiero internacional
3. **IA Integrada**: Análisis automático de activos
4. **Pagos Reales**: Stripe + criptomonedas

---

## 🏛️ Arquitectura General

```
┌─────────────────────────────────────────────────────┐
│                   USUARIO                            │
│            (quantpaychain.com)                       │
└───────────────┬─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────┐
│           VERCEL (Edge Network)                      │
│                                                       │
│  ┌──────────────┐         ┌──────────────┐         │
│  │   Frontend    │◄───────►│ API Routes   │         │
│  │   Next.js     │         │  (Serverless)│         │
│  │   (SSG/SSR)   │         │   Python     │         │
│  └──────────────┘         └──────┬───────┘         │
│                                   │                  │
└───────────────────────────────────┼─────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
        ┌────────────┐    ┌────────────┐    ┌────────────┐
        │  Supabase  │    │  Stripe    │    │ OpenAI     │
        │ PostgreSQL │    │  Payments  │    │ GPT-4o     │
        │   (DB)     │    │            │    │  (AI)      │
        └────────────┘    └────────────┘    └────────────┘
```

---

## 🛠️ Stack Tecnológico

### Frontend
```yaml
Framework: Next.js 14 (App Router)
Styling: TailwindCSS + Shadcn/UI
Language: TypeScript
State: React Context + Zustand
API Client: Axios + SWR
Auth: Supabase Auth (Google OAuth)
```

### Backend
```yaml
Framework: FastAPI (Python)
Runtime: Vercel Serverless Functions
Database ORM: Prisma + Supabase Client
Validación: Pydantic
AI: OpenAI SDK (GPT-4o)
Payments: Stripe SDK
```

### Database
```yaml
Provider: Supabase (PostgreSQL)
ORM: Prisma
Migrations: Prisma Migrate
Auth: Supabase Auth
Storage: Supabase Storage (futuros docs)
```

### Infraestructura
```yaml
Hosting: Vercel
DNS: Vercel/Cloudflare
SSL: Automático (Vercel)
CDN: Vercel Edge Network
```

---

## 📁 Estructura del Proyecto

```
quantpaychain/
├── apps/
│   ├── web/                    # Frontend Next.js
│   │   ├── app/               # App Router
│   │   │   ├── (auth)/        # Rutas autenticadas
│   │   │   ├── (public)/      # Rutas públicas
│   │   │   ├── api/           # API Routes (opcional)
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── ui/            # Shadcn components
│   │   │   ├── layout/        # Layout components
│   │   │   └── features/      # Feature components
│   │   ├── lib/
│   │   │   ├── supabase.ts    # Supabase client
│   │   │   ├── utils.ts       # Utilities
│   │   │   └── constants.ts
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── public/
│   │   ├── next.config.js
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   └── api/                    # Backend FastAPI
│       ├── routes/
│       │   ├── auth.py
│       │   ├── assets.py
│       │   ├── tokens.py
│       │   ├── payments.py
│       │   └── reports.py
│       ├── models/
│       │   └── schemas.py
│       ├── services/
│       │   ├── ai_service.py
│       │   ├── payment_service.py
│       │   └── blockchain_service.py
│       ├── utils/
│       ├── main.py
│       └── requirements.txt
│
├── packages/
│   ├── database/               # Supabase schema
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   │
│   └── ui/                     # Componentes compartidos
│       ├── components/
│       └── hooks/
│
├── docs/                       # Documentación
│   ├── ARQUITECTURA_MASTER.md  # Este archivo
│   ├── API.md                  # Documentación API
│   ├── DEPLOYMENT.md           # Guía deployment
│   └── DEVELOPMENT.md          # Guía desarrollo
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── .gitignore
├── README.md
├── package.json                # Root workspace
└── vercel.json
```

---

## 🚀 Flujo de Deployment

### 1. Desarrollo Local
```bash
# Instalar dependencias
npm install

# Configurar variables
cp .env.example .env.local

# Levantar DB local (opcional)
npm run db:start

# Dev server
npm run dev
```

### 2. Push a GitHub
```bash
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main
```

### 3. Deploy Automático
```
GitHub → Vercel (auto-deploy)
├── Build frontend (Next.js)
├── Deploy API (Serverless Functions)
├── Migrate DB (Prisma)
└── Live en quantpaychain.com
```

---

## 🗄️ Base de Datos

### Supabase PostgreSQL

#### Tablas Principales

**users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  picture TEXT,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**rwa_assets**
```sql
CREATE TABLE rwa_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  asset_type VARCHAR(50) NOT NULL, -- real_estate, commodity, invoice, other
  description TEXT,
  value_usd DECIMAL(15, 2),
  owner_id UUID REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'active', -- active, tokenized, inactive
  blockchain_network VARCHAR(50),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**tokens**
```sql
CREATE TABLE tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id UUID REFERENCES rwa_assets(id),
  token_symbol VARCHAR(20) NOT NULL,
  total_supply INTEGER,
  available_supply INTEGER,
  price_per_token DECIMAL(10, 2),
  blockchain_network VARCHAR(50),
  contract_address VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**transactions**
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_type VARCHAR(20), -- buy, sell
  buyer_id UUID REFERENCES users(id),
  seller_id UUID REFERENCES users(id),
  token_id UUID REFERENCES tokens(id),
  quantity INTEGER,
  total_amount DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'pending',
  payment_session_id VARCHAR(255),
  blockchain_tx_hash VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**payment_transactions**
```sql
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(255) UNIQUE,
  user_id UUID REFERENCES users(id),
  amount DECIMAL(10, 2),
  currency VARCHAR(10),
  status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**iso_reports**
```sql
CREATE TABLE iso_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  report_type VARCHAR(100),
  data JSONB,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔄 Guía de Migración

### Paso 1: Backup del Repo Actual
```bash
# En tu máquina local
cd /ruta/a/tu/repo
git checkout -b backup-old-version
git push origin backup-old-version
```

### Paso 2: Limpiar Repo
```bash
# Eliminar carpetas viejas (mantener .git)
rm -rf quantpaychain-mvp qpc-v2-core qpc-v2-core-backup
rm *.pdf *.md  # Eliminar docs viejos

# Mantener solo
- .git/
- .gitignore
```

### Paso 3: Copiar Nueva Estructura
```bash
# Yo te daré un ZIP o comandos para copiar todo
# desde /app/quantpaychain-clean/ a tu repo
```

### Paso 4: Configurar Supabase
1. Ir a https://supabase.com
2. Crear proyecto: "quantpaychain-prod"
3. Copiar:
   - Project URL
   - anon public key
   - service role key (secreto)

### Paso 5: Configurar Variables en Vercel
```env
# Frontend (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_xxx

# Backend (Vercel Env Vars)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJxxx...
OPENAI_API_KEY=sk-xxx...
STRIPE_SECRET_KEY=sk_test_xxx
```

### Paso 6: Deploy
```bash
git add .
git commit -m "chore: proyecto reorganizado por arquitecto"
git push origin main

# Vercel auto-despliega
```

---

## 📊 Comparación: Antes vs Después

### ANTES (Tu Frankenstein)
```
❌ Múltiples carpetas desorganizadas
❌ Documentación mezclada con código
❌ Sin backend funcional
❌ Sin base de datos conectada
❌ Vercel desplegando versión vieja
❌ No funciona end-to-end
```

### DESPUÉS (Arquitectura Limpia)
```
✅ Monorepo organizado (apps/ + packages/)
✅ Documentación separada en docs/
✅ Backend FastAPI funcional
✅ Supabase PostgreSQL conectado
✅ Vercel auto-deploy configurado
✅ App funcionando completamente
✅ Frontend moderno (Next.js 14)
✅ Pagos Stripe integrados
✅ IA GPT-4o integrado
```

---

## 🎯 Próximos Pasos

1. **Yo preparo todo** (30-45 mins)
2. **Tú haces backup** de tu repo actual
3. **Tú copias** nueva estructura
4. **Yo te guío** en configuración Supabase
5. **Deploy** y celebrar 🎉

---

## 📞 Notas del Arquitecto

Franco, este es el plan maestro para reorganizar QuantPayChain. Te voy a dar:

1. ✅ Estructura completa del proyecto
2. ✅ Todo el código migrado y funcionando
3. ✅ Scripts de setup automatizados
4. ✅ Documentación clara
5. ✅ Guía paso a paso de deployment

**Tu rol:**
- Hacer backup del repo actual
- Ejecutar comandos que te dé
- Configurar credenciales (Supabase, Stripe, OpenAI)
- Push a GitHub

**Mi rol:**
- Arquitectura completa
- Todo el código
- Configuración
- Documentación
- Soporte durante migración

¿Listo para empezar?

---

**Arquitecto:** AI Assistant  
**Contacto:** Emergent Platform  
**Última actualización:** 20 Nov 2025
