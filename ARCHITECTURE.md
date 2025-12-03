# QuantPayChain - Arquitectura del Sistema

## 📋 Índice
1. [Visión General](#visión-general)
2. [Estructura del Repositorio](#estructura-del-repositorio)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Servicios Backend](#servicios-backend)
5. [Componentes Frontend](#componentes-frontend)
6. [Flujo de Datos](#flujo-de-datos)
7. [Deployment](#deployment)
8. [Seguridad](#seguridad)

---

## 🎯 Visión General

**QuantPayChain** es una plataforma institutional-grade para tokenización de Real World Assets (RWA) con las siguientes capacidades únicas:

- **Post-Quantum Cryptography (PQC)**: Seguridad quantum-safe
- **ISO 20022 Compliance**: Mensajería financiera estándar
- **AI-Powered Risk Analytics**: KYT y validación de activos
- **Legal AI Advisor**: Análisis legal automatizado
- **KYC/AML Integration**: Compliance automatizado

---

## 📁 Estructura del Repositorio

```
quantpaychain-clean/
├── apps/
│   ├── api/                           # Backend FastAPI
│   │   ├── services/                  # Servicios de negocio
│   │   │   ├── pqc_service.py        # Post-Quantum Cryptography
│   │   │   ├── iso20022_service.py   # ISO 20022 Messaging
│   │   │   ├── risk_analytics_service.py  # AI Risk Analytics
│   │   │   ├── ai_advisor_service.py # AI Legal Advisor
│   │   │   ├── kyc_aml_service.py    # KYC/AML Compliance
│   │   │   └── supabase_service.py   # Database operations
│   │   ├── routes/                    # API routes (legacy)
│   │   ├── models/                    # Data models
│   │   ├── main.py                    # FastAPI application
│   │   ├── requirements.txt           # Python dependencies
│   │   └── render.yaml                # Render deployment config
│   │
│   └── web/                           # Frontend Next.js
│       ├── app/                       # App directory (Next.js 14)
│       │   ├── (with-web3)/          # Web3-enabled pages
│       │   │   ├── marketplace/      # Token marketplace
│       │   │   └── layout.tsx        # Web3 provider layout
│       │   ├── create-asset/         # Asset creation (with AI)
│       │   ├── create-asset-v2/      # Asset creation (simplified)
│       │   ├── dashboard/            # User dashboard
│       │   ├── token/[id]/          # Token detail page
│       │   └── services/            # Services showcase (NEW)
│       ├── components/               # React components
│       │   ├── ui/                  # shadcn/ui components
│       │   ├── ai-advisor-panel.tsx # AI advisor component
│       │   └── page-layout.tsx      # Layout wrapper
│       ├── lib/                     # Utilities
│       │   ├── api-config.ts       # API configuration
│       │   ├── supabase.ts         # Supabase client
│       │   └── supabase-client.ts  # Client-side Supabase
│       └── providers/               # Context providers
│           └── web3-provider.tsx   # Web3 provider
│
├── docs/                            # Documentation
│   ├── ARCHITECTURE.md             # This file
│   ├── RISK_ANALYTICS_GUIDE.md     # Risk Analytics guide
│   ├── PQC_INTEGRATION_PLAYBOOK.md # PQC integration
│   └── ISO20022_INTEGRATION_PLAYBOOK.md # ISO integration
│
└── README.md                        # Project overview
```

---

## 🛠 Stack Tecnológico

### Backend
- **Framework**: FastAPI (Python 3.12)
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4o-mini via emergentintegrations
- **Crypto**: liboqs-python (PQC, optional)
- **XML**: lxml, defusedxml
- **Deployment**: Render.com

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18, Tailwind CSS, shadcn/ui
- **Web3**: wagmi, RainbowKit, viem
- **State**: React Hooks, Context API
- **Deployment**: Vercel

### Database Schema
```sql
-- Assets Table
CREATE TABLE rwa_assets (
    id UUID PRIMARY KEY,
    owner_id UUID REFERENCES auth.users,
    name TEXT NOT NULL,
    asset_type TEXT NOT NULL,
    description TEXT,
    value_usd DECIMAL,
    location TEXT,
    legal_documents TEXT,
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Tokens Table
CREATE TABLE tokens (
    id UUID PRIMARY KEY,
    asset_id UUID REFERENCES rwa_assets,
    token_name TEXT NOT NULL,
    token_symbol TEXT NOT NULL,
    token_standard TEXT,
    total_supply INTEGER,
    available_supply INTEGER,
    price_per_token DECIMAL,
    blockchain_network TEXT,
    contract_address TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Transactions Table
CREATE TABLE transactions (
    id UUID PRIMARY KEY,
    buyer_id UUID REFERENCES auth.users,
    token_id UUID REFERENCES tokens,
    quantity INTEGER,
    total_amount DECIMAL,
    transaction_hash TEXT,
    status TEXT,
    created_at TIMESTAMP
);
```

---

## 🔧 Servicios Backend

### 1. Post-Quantum Cryptography (PQC)

**Archivo**: `apps/api/services/pqc_service.py`

**Funcionalidad**:
- Generación de keypairs quantum-resistentes (ML-DSA-65)
- Firma de transacciones con algoritmos PQC
- Verificación de firmas
- Key encapsulation (ML-KEM-768)

**Endpoints**:
- `POST /api/pqc/generate-keypair` - Generar keypair
- `POST /api/pqc/sign-transaction` - Firmar transacción
- `POST /api/pqc/verify-signature` - Verificar firma
- `GET /api/pqc/service-info` - Info del servicio

**Modo**: Simulation (fallback si liboqs no está instalado)

---

### 2. ISO 20022 Compliance

**Archivo**: `apps/api/services/iso20022_service.py`

**Funcionalidad**:
- Generación de mensajes pain.001 (payment initiation)
- Generación de mensajes pain.002 (payment status)
- Generación de mensajes camt.053 (bank statement)
- Validación de XML según esquemas ISO 20022

**Endpoints**:
- `POST /api/iso20022/payment-initiation` - Generar pain.001
- `POST /api/iso20022/payment-status` - Generar pain.002
- `POST /api/iso20022/bank-statement` - Generar camt.053
- `GET /api/iso20022/service-info` - Info del servicio

**Estándar**: ISO 20022 Universal Financial Industry Message Scheme

---

### 3. AI-Powered Risk Analytics

**Archivo**: `apps/api/services/risk_analytics_service.py`

**Funcionalidad**:
- **KYT (Know Your Transaction)**: Análisis de riesgo en tiempo real
- **Asset Validation**: Validación profunda con AI
- **Portfolio Monitoring**: Monitoreo continuo de carteras

**Endpoints**:
- `POST /api/risk/analyze-transaction` - Análisis KYT
- `POST /api/risk/validate-asset` - Validación AI
- `POST /api/risk/monitor-portfolio` - Monitoreo de cartera
- `GET /api/risk/service-info` - Info del servicio

**Características**:
- Risk scoring (0-100)
- Fraud pattern detection
- ISO 20022 integration
- Compliance checks (AML, KYC, sanctions)

---

### 4. AI Legal Advisor

**Archivo**: `apps/api/services/ai_advisor_service.py`

**Funcionalidad**:
- Análisis legal de activos para tokenización
- Securities classification (Howey Test)
- Compliance roadmap (3 fases)
- Risk mitigation strategies
- KYC/AML requirements
- Tax implications

**Endpoint**:
- `POST /api/ai/advisor` - Análisis legal completo

**Output**: JSON estructurado con análisis profesional

---

### 5. KYC/AML Service

**Archivo**: `apps/api/services/kyc_aml_service.py`

**Funcionalidad**:
- Verificación de identidad de usuarios
- Document verification
- Sanctions screening
- Risk assessment
- AI-powered analysis

**Endpoints**: (Integrados en flujo de onboarding)

---

## 🎨 Componentes Frontend

### Páginas Principales

#### 1. Homepage (`/`)
- Landing page con hero section
- Showcase de servicios
- Call-to-action para crear assets

#### 2. Marketplace (`/marketplace`)
- Lista de tokens disponibles
- Filtros y búsqueda
- Cards con detalles de tokens
- Navegación a token details

#### 3. Token Details (`/token/[id]`)
- Información completa del token
- Panel de compra
- ISO 20022 compliance badge
- PQC security indicator

#### 4. Create Asset (`/create-asset`)
- Formulario de creación
- AI Legal Advisor Panel
- Validación en tiempo real
- Progress indicators

#### 5. Dashboard (`/dashboard`)
- Assets del usuario
- Portfolio overview
- Transaction history
- Analytics

#### 6. Services Showcase (`/services`) **[NUEVO]**
- Demostración de PQC
- Demostración de ISO 20022
- Risk Analytics demo
- AI Legal Advisor demo

### Componentes Clave

#### AIAdvisorPanel
**Archivo**: `components/ai-advisor-panel.tsx`

**Funcionalidad**:
- Conecta con `/api/ai/advisor`
- Muestra análisis legal estructurado
- Expansible con detalles completos
- Error handling robusto

#### Web3Provider
**Archivo**: `providers/web3-provider.tsx`

**Funcionalidad**:
- Dynamic import con `ssr: false`
- RainbowKit + wagmi integration
- Wallet connection management

---

## 🔄 Flujo de Datos

### Flujo de Tokenización de Asset

```
1. Usuario → [Create Asset Form]
   ├─> Completa información del asset
   └─> Click "Obtener Análisis AI"

2. Frontend → [POST /api/ai/advisor]
   ├─> Envía asset data
   └─> Recibe análisis legal

3. Usuario revisa análisis
   ├─> Aprueba recomendaciones
   └─> Click "Crear Asset"

4. Frontend → [Supabase]
   ├─> Inserta asset en rwa_assets
   └─> Inserta token en tokens

5. Backend (futuro) → [Blockchain]
   ├─> Genera keypair PQC
   ├─> Crea ISO 20022 message
   ├─> Firma con PQC
   └─> Deploy smart contract
```

### Flujo de Compra de Token

```
1. Usuario → [Marketplace]
   ├─> Browse tokens
   └─> Click en token

2. Frontend → [Token Details]
   ├─> Fetch token data (Supabase)
   └─> Muestra información

3. Usuario → [Compra]
   ├─> Selecciona cantidad
   └─> Click "Comprar"

4. Backend (futuro) → [Risk Analytics]
   ├─> POST /api/risk/analyze-transaction
   └─> Verifica risk score

5. Si approved → [Payment Processing]
   ├─> Genera ISO 20022 payment
   ├─> Firma con PQC
   └─> Procesa pago

6. Frontend → [Update UI]
   ├─> Actualiza portfolio
   └─> Confirma compra
```

### Flujo de Risk Analytics

```
1. Transaction initiated
   ↓
2. POST /api/risk/analyze-transaction
   ├─> Base risk calculation
   ├─> Fraud pattern detection
   ├─> ISO 20022 data analysis
   └─> AI analysis (if amount > $10k)
   ↓
3. Risk Score Generated (0-100)
   ├─> LOW (<30): Auto-approve
   ├─> MEDIUM (30-60): Enhanced KYC
   ├─> HIGH (60-85): Hold for review
   └─> CRITICAL (>85): Block & escalate
   ↓
4. Return recommendations & next actions
```

---

## 🚀 Deployment

### Backend (Render.com)

**URL**: https://quantpaychain-api.onrender.com

**Configuración**:
```yaml
# render.yaml
services:
  - type: web
    name: quantpaychain-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: EMERGENT_LLM_KEY
        sync: false
      - key: SUPABASE_URL
        sync: false
      - key: SUPABASE_KEY
        sync: false
```

**Variables de Entorno Requeridas**:
- `EMERGENT_LLM_KEY`: Para AI services
- `SUPABASE_URL`: Database URL
- `SUPABASE_KEY`: Database service key

### Frontend (Vercel)

**URL**: https://quantpaychain-[user].vercel.app

**Configuración**:
```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "cd apps/web && yarn build",
  "outputDirectory": "apps/web/.next"
}
```

**Variables de Entorno Requeridas**:
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key

---

## 🔐 Seguridad

### Post-Quantum Cryptography
- Algoritmos: ML-DSA-65, ML-KEM-768
- NIST Level 3 (192-bit security)
- Quantum-safe para protección a largo plazo

### ISO 20022 Security
- Validación de XML con defusedxml
- Prevención de XXE attacks
- Schema validation

### API Security
- CORS configurado
- Rate limiting (futuro)
- API key authentication (EMERGENT_LLM_KEY)
- Environment variables para secrets

### Database Security
- Supabase RLS (Row Level Security)
- Políticas de acceso por usuario
- Encriptación en tránsito y reposo

### Frontend Security
- CSP headers
- XSS prevention
- HTTPS only
- Secure cookies

---

## 📊 Performance

### Backend
- Response time: < 2s promedio
- AI analysis: 3-5s para análisis completo
- Database queries: < 100ms
- Concurrent requests: 100+ (escalable)

### Frontend
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Bundle size: < 500KB (main)
- Lighthouse score: 90+

---

## 🔮 Roadmap Técnico

### Q1 2025
- [ ] Real PQC implementation (liboqs-python)
- [ ] ML model para fraud detection
- [ ] Real-time dashboard con WebSockets
- [ ] Performance monitoring

### Q2 2025
- [ ] Cross-chain bridges con PQC
- [ ] Descentralized compute integration
- [ ] Advanced analytics dashboard
- [ ] Multi-tenant architecture

### Q3 2025
- [ ] Zero-knowledge proofs
- [ ] Homomorphic encryption
- [ ] Quantum key distribution
- [ ] Global compliance automation

---

## 📝 Notas de Desarrollo

### Conventions
- Python: PEP 8, type hints
- TypeScript: ESLint, Prettier
- Commits: Conventional commits
- Branches: feature/*, fix/*, docs/*

### Testing
- Backend: pytest (futuro)
- Frontend: Jest + React Testing Library (futuro)
- E2E: Testing agents (actual)
- Integration: curl + screenshots

### Monitoring
- Backend logs: Render logs
- Frontend errors: Vercel analytics
- API metrics: Custom dashboard (futuro)
- User analytics: Plausible (futuro)

---

## 🆘 Troubleshooting

### Backend no responde
1. Verificar Render logs
2. Verificar environment variables
3. Verificar syntax errors (python -m py_compile)
4. Verificar dependencies (requirements.txt)

### Frontend no carga
1. Verificar Vercel build logs
2. Verificar environment variables
3. Verificar NEXT_PUBLIC_API_URL
4. Limpiar cache (.next, node_modules)

### AI services timeout
1. Verificar EMERGENT_LLM_KEY
2. Usar endpoints lightweight primero
3. Implementar retry logic
4. Verificar API quotas

---

## 📚 Referencias

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [ISO 20022 Standard](https://www.iso20022.org/)
- [NIST PQC](https://csrc.nist.gov/Projects/post-quantum-cryptography)
- [liboqs](https://openquantumsafe.org/liboqs/)

---

**Última actualización**: 2025-01-15
**Versión**: 2.0.0
**Mantenedor**: QuantPayChain Team
