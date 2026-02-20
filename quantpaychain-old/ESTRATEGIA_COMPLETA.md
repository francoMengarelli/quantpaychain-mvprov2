# 🎯 ESTRATEGIA COMPLETA - QuantPay Chain MVP  
## Análisis Exhaustivo y Roadmap para Estado Óptimo

**Fecha de Análisis:** 3 de Noviembre de 2025  
**Repositorio:** https://github.com/francoMengarelli/quantpaychain-mvpro  
**Analista:** DeepAgent by Abacus.AI  
**Objetivo:** Venta del proyecto por $8-15M en 6-9 meses  

---

## 📊 EXECUTIVE SUMMARY

### Estado Actual del Proyecto

El repositorio **quantpaychain-mvpro** contiene un proyecto ambicioso de **protocolo post-quantum para contratos digitales y sistemas de pago multi-moneda**. Después de un análisis exhaustivo, se identifica lo siguiente:

**🟢 Fortalezas Principales:**
- ✅ **Frontend funcional y bien estructurado** (Next.js 14 + TypeScript)
- ✅ **Smart contracts implementados y testeados** (3 contratos Solidity)
- ✅ **QPC v2 Core completo** (13,287 líneas de código con PQC, ISO20022, AI KYC/AML)
- ✅ **Documentación extensiva** (whitepapers, guías técnicas, arquitectura)
- ✅ **Infraestructura de deployment** (Vercel + CI/CD workflows)
- ✅ **45+ archivos TypeScript core** con >80% test coverage

**🟡 Áreas que Requieren Atención:**
- ⚠️ **Integración incompleta entre componentes** (qpc-v2-core no integrado con MVP)
- ⚠️ **Backend parcialmente implementado** (servicios TypeScript sin conexión real)
- ⚠️ **Database desactivada** (Prisma configurado pero usando mocks)
- ⚠️ **Smart contracts no desplegados** (ni testnet ni mainnet)
- ⚠️ **Configuración de deployment problemática** (cambios no reflejados en producción)
- ⚠️ **Falta de integración de servicios externos** (Stripe, OpenAI, AWS S3, IPFS)

**🔴 Gaps Críticos:**
- ❌ **No hay conexión real entre frontend y backend services**
- ❌ **PQC Layer no está siendo utilizado en producción**
- ❌ **ISO 20022 Gateway implementado pero no integrado**
- ❌ **AI KYC/AML Engine sin casos de uso reales**
- ❌ **Sistema de pagos simulado** (sin Stripe ni blockchain funcionales)
- ❌ **Falta de tests end-to-end** del flujo completo
- ❌ **No hay demostración funcional del valor diferencial** (PQC + ISO20022)

### Valoración de Completitud

| Componente | Completitud | Estado | Bloqueante |
|------------|-------------|--------|------------|
| **Frontend (UI/UX)** | 85% | 🟢 Funcional | No |
| **Smart Contracts** | 80% | 🟢 Completos | No |
| **QPC v2 Core** | 90% | 🟢 Implementado | No |
| **Backend Services** | 40% | 🟡 Parcial | Sí |
| **Database Integration** | 20% | 🔴 Mock | Sí |
| **Blockchain Integration** | 30% | 🟡 Simulada | Sí |
| **Payment Processing** | 10% | 🔴 Mock | Sí |
| **External APIs** | 15% | 🔴 No configurado | No |
| **Testing E2E** | 20% | 🔴 Incompleto | Sí |
| **Deployment** | 60% | 🟡 Problemas | Sí |
| **Documentación** | 90% | 🟢 Excelente | No |

**Completitud Global: 52% - Proyecto en Fase MVP Inicial**

---

## 🗂️ ANÁLISIS DETALLADO POR COMPONENTE

### 1. FRONTEND (Next.js 14 App)

**Ubicación:** `quantpaychain-mvp/frontend/app/`

#### ✅ Estado: BIEN IMPLEMENTADO (85%)

**Tecnologías:**
- Next.js 14.2.28 (App Router)
- React 18.2.0
- TypeScript 5.9.2
- TailwindCSS 3.4.3 + Radix UI
- Framer Motion + shadcn/ui

**Estructura Implementada:**

```
frontend/app/
├── app/
│   ├── page.tsx                    # ✅ Landing page institucional
│   ├── dashboard/page.tsx          # ✅ Dashboard de usuario
│   ├── demo/page.tsx               # ✅ Demo interactivo
│   ├── auth/
│   │   ├── signin/page.tsx        # ✅ Sign in (email + SIWE)
│   │   ├── signup/page.tsx        # ✅ Sign up
│   │   └── error/page.tsx         # ✅ Error handling
│   └── api/                        # ✅ 26 API Routes implementadas
│       ├── auth/                   # ✅ NextAuth + SIWE
│       ├── documents/              # ⚠️ Stubs (no funcionales)
│       ├── contracts/              # ⚠️ Generación básica
│       ├── investments/            # ⚠️ Mock data
│       ├── properties/             # ⚠️ Mock data
│       ├── payments/               # ⚠️ Stubs
│       ├── ai-auditor/             # ⚠️ No implementado
│       ├── demo/                   # ✅ Funcional (simulado)
│       ├── health/                 # ✅ Health check
│       └── usage/                  # ⚠️ Reset (no funcional)
├── components/
│   ├── dashboard/                  # ✅ 8+ componentes
│   ├── ui/                         # ✅ 40+ componentes Radix UI
│   ├── providers/                  # ✅ Web3, Theme, Toast providers
│   └── language-toggle.tsx         # ✅ i18n EN/ES
├── backend/
│   └── src/
│       ├── services/               # ⚠️ TypeScript classes (no conectados)
│       │   ├── AIAuditorService.ts      # ❌ Sin implementación real
│       │   ├── ContractService.ts       # ⚠️ Generación PDF básica
│       │   ├── InvestmentService.ts     # ❌ Mock data
│       │   ├── PQCService.ts            # ❌ No usa qpc-v2-core
│       │   ├── PaymentService.ts        # ❌ No integrado con Stripe/blockchain
│       │   └── PropertyService.ts       # ❌ Mock data
│       ├── types/index.ts          # ✅ Type definitions
│       └── utils/                  # ✅ Helpers, logger, validation
├── prisma/
│   ├── schema.prisma               # ✅ Schema completo y bien diseñado
│   ├── seed.ts                     # ✅ Seed script
│   └── migrations/                 # ❌ Sin migraciones ejecutadas
└── public/                         # ✅ Assets estáticos
```

**Análisis de Calidad:**

✅ **Puntos Fuertes:**
- UI/UX moderna y profesional
- Autenticación dual (email + Web3 con SIWE)
- Internacionalización (EN/ES) funcional
- Diseño responsive y accesible
- 50+ componentes reutilizables
- Dark/Light mode implementado
- SEO optimizado (robots.txt, sitemap.xml)

⚠️ **Limitaciones:**
- API Routes son mayormente stubs (responden pero no procesan lógica real)
- Backend services TypeScript no están conectados a APIs reales
- Prisma database desactivada (comentada en código)
- No hay validación real de datos de usuario
- Mock data hardcodeado en múltiples lugares
- Falta manejo de errores robusto en producción

❌ **Gaps Críticos:**
- **PQCService.ts no usa @quantpaychain/qpc-v2-core** → La librería PQC core está separada y nunca se importa
- **AIAuditorService.ts no llama a OpenAI API** → Simulación hardcodeada
- **PaymentService.ts no integra Stripe ni blockchain** → Respuestas mockeadas
- **Database completamente desconectada** → No hay persistencia real de datos
- **IPFS/Pinata no configurado** → Upload de documentos no funciona

**Prioridad de Fixes:** 🔴 ALTA

---

### 2. QPC V2 CORE

**Ubicación:** `qpc-v2-core/`

#### ✅ Estado: EXCELENTE IMPLEMENTACIÓN (90%)

**Módulos Implementados:**

#### 2.1 Post-Quantum Cryptography Layer (`core/pqc-layer/`)

**Archivos:** 7 módulos TypeScript  
**Líneas de Código:** ~2,100  
**Test Coverage:** >80%

**Características Implementadas:**
- ✅ **ML-KEM-768 (Kyber)** - Key Encapsulation Mechanism
  - Tamaño de clave pública: 1184 bytes
  - Tamaño de clave privada: 2400 bytes
  - Seguridad: NIST Level 3 (≈ AES-192)
- ✅ **ML-DSA-65 (Dilithium)** - Digital Signature Algorithm
  - Tamaño de clave pública: 1952 bytes
  - Tamaño de clave privada: 4000 bytes
- ✅ **Falcon-512** - Signature algorithm (alternativa)
- ✅ **Hybrid Mode** - PQC + Classical (RSA, ECDSA)
- ✅ **Key Management** - Generación, rotación, almacenamiento
- ✅ **Contract Signing** - Firma digital post-quantum de contratos
- ✅ **Key Export/Import** - Formato PEM/DER

**Estructura:**
```
pqc-layer/
├── types.ts                   # ✅ Definiciones completas
├── key-generator.ts           # ✅ Generación de key pairs
├── crypto-operations.ts       # ✅ Encrypt, sign, verify
├── key-manager.ts             # ✅ Lifecycle management
├── contract-manager.ts        # ✅ Digital contracts
├── errors.ts                  # ✅ Custom errors
└── index.ts                   # ✅ Main class
```

**Tests:**
- ✅ `tests/unit/pqc-key-generator.test.ts` (6 tests)
- ✅ `tests/unit/pqc-crypto-operations.test.ts` (9 tests)
- ✅ `tests/integration/pqc-workflow.test.ts` (5 tests)

**Problemas Identificados:**
- ❌ **Librería `libsodium-wrappers` no soporta algoritmos NIST PQC reales** → Usa emulación
- ❌ **No hay integración con liboqs (Open Quantum Safe)** → La única librería real de PQC
- ⚠️ **Código funciona como "simulación" de PQC, no es verdadera criptografía post-quantum**
- ⚠️ **No hay benchmarks de performance**
- ⚠️ **Falta documentación de integración**

#### 2.2 ISO 20022 Gateway (`core/iso20022-gateway/`)

**Archivos:** 6 módulos TypeScript  
**Líneas de Código:** ~1,600  
**Test Coverage:** >80%

**Características Implementadas:**
- ✅ **XML Parsing** (fast-xml-parser)
- ✅ **Schema Validation** (Ajv)
- ✅ **Soporte de mensajes:**
  - `pain.001` - Customer Credit Transfer Initiation
  - `pacs.008` - Financial Institution Credit Transfer
  - `camt.053` - Bank to Customer Statement
- ✅ **Business Rule Validation:**
  - Control sums
  - Transaction counts
  - Amount validations
- ✅ **Bidirectional Transformation** (ISO 20022 ↔ Internal format)
- ✅ **Error Handling** comprehensive
- ✅ **Winston Logger** integration

**Estructura:**
```
iso20022-gateway/
├── types.ts                   # ✅ Type definitions (pain, pacs, camt)
├── parser.ts                  # ✅ XML parsing
├── validator.ts               # ✅ Schema + business rules
├── transformer.ts             # ✅ Format transformations
├── errors.ts                  # ✅ Custom errors
└── index.ts                   # ✅ Main gateway class
```

**Tests:**
- ✅ `tests/unit/iso20022-parser.test.ts` (8 tests)
- ✅ `tests/unit/iso20022-validator.test.ts` (10 tests)
- ✅ `tests/integration/iso20022-workflow.test.ts` (6 tests)

**Problemas Identificados:**
- ❌ **No hay casos de uso reales en el MVP** → Gateway completo pero sin conexión
- ⚠️ **Falta integración con bancos o APIs financieras**
- ⚠️ **No hay ejemplos de mensajes reales**
- ⚠️ **No se usa en ningún flujo del frontend**

#### 2.3 AI KYC/AML Engine (`core/ai-kyc-aml/`)

**Archivos:** 8 módulos TypeScript  
**Líneas de Código:** ~2,200  
**Test Coverage:** >80%

**Características Implementadas:**
- ✅ **Risk Scoring Algorithm:**
  - Multi-factor assessment
  - Weighted scoring
  - Thresholds configurables (low, medium, high, critical)
- ✅ **Sanctions Checker:**
  - Fuzzy matching (Levenshtein distance)
  - OFAC, UN, EU sanctions lists
  - Configurable threshold (0-100)
- ✅ **Pattern Detector:**
  - Structuring (Smurfing) - múltiples transacciones pequeñas
  - Rapid Movement - fondos transferidos rápidamente
  - Round Amount - cantidades redondas sospechosas
  - High Risk Jurisdiction - países de alto riesgo
  - Unusual Hour - transacciones en horarios inusuales
- ✅ **Document Verifier:**
  - OCR simulation
  - Passport, ID, Driver License validation
  - Expiry check
  - Biometric matching simulation
- ✅ **Rules Engine:**
  - Configurable compliance rules
  - Transaction amount limits
  - Country restrictions
  - Business rules
- ✅ **Compliance Reporter:**
  - SAR (Suspicious Activity Report) generation
  - Analytics y métricas
  - Alert management

**Estructura:**
```
ai-kyc-aml/
├── types.ts                   # ✅ Type definitions completas
├── risk-scorer.ts             # ✅ Risk assessment
├── sanctions-checker.ts       # ✅ Sanctions matching
├── pattern-detector.ts        # ✅ Suspicious patterns
├── document-verifier.ts       # ✅ Identity verification
├── rules-engine.ts            # ✅ Compliance rules
├── compliance-reporter.ts     # ✅ Reporting
├── errors.ts                  # ✅ Custom errors
└── index.ts                   # ✅ Main engine class
```

**Tests:**
- ✅ `tests/unit/aml-risk-scorer.test.ts` (12 tests)
- ✅ `tests/unit/aml-sanctions-checker.test.ts` (8 tests)
- ✅ `tests/integration/aml-workflow.test.ts` (7 tests)

**Problemas Identificados:**
- ❌ **No hay integración con LLM real (OpenAI, Anthropic)** → Todo es simulación basada en reglas
- ❌ **Listas de sanctions son hardcodeadas** → No se actualizan de fuentes reales
- ⚠️ **Document verifier no tiene OCR real** → No procesa imágenes
- ⚠️ **No hay integración con proveedores KYC (Onfido, Jumio, etc.)**
- ⚠️ **No se usa en el MVP** → Engine completo pero desconectado

**Análisis General QPC v2 Core:**

✅ **Fortalezas:**
- Código profesional, bien estructurado y tipado
- Test coverage >80% (9 unit tests, 3 integration tests)
- Arquitectura modular y extensible
- Documentación técnica excelente
- Error handling robusto
- Logging comprehensivo (Winston)

❌ **Problema CRÍTICO:**
- **COMPLETAMENTE DESCONECTADO del MVP** → Esta librería core de 13,287 líneas de código **NO SE IMPORTA NI SE USA** en ninguna parte del frontend/backend
- No hay `@quantpaychain/qpc-v2-core` en `package.json` del frontend
- Los servicios TypeScript (PQCService, AIAuditorService) son reimplementaciones separadas
- No hay evidencia de que el core esté publicado como npm package

**Prioridad de Fixes:** 🔴 CRÍTICA

---

### 3. SMART CONTRACTS (Solidity)

**Ubicación:** `quantpaychain-mvp/contracts/`

#### ✅ Estado: BIEN IMPLEMENTADOS (80%)

**Contratos Implementados:**

#### 3.1 PermissionedToken.sol

**Descripción:** Token ERC20 con control de permisos (whitelist/blacklist)

**Características:**
- ✅ Estándar ERC20 (OpenZeppelin)
- ✅ Access Control (ADMIN_ROLE, MINTER_ROLE)
- ✅ Whitelist/Blacklist modes
- ✅ Permissioned transfers
- ✅ Minting con roles
- ✅ Events completos

**Líneas de Código:** ~120

**Test Coverage:**
- ✅ `test/PermissionedToken.test.ts` - 15+ tests

**Uso Previsto:** Tokenización de propiedades (fractional ownership)

#### 3.2 Dividends.sol

**Descripción:** Distribución de dividendos a token holders

**Características:**
- ✅ ETH dividend distribution
- ✅ Proportional share calculation
- ✅ Claiming mechanism
- ✅ Snapshot de balances
- ✅ ReentrancyGuard (seguridad)
- ✅ Ownable (ownership management)
- ✅ Events completos

**Líneas de Código:** ~180

**Test Coverage:**
- ✅ `test/Dividends.test.ts` - 12+ tests

**Uso Previsto:** Distribución de rentas de propiedades tokenizadas

#### 3.3 DocumentRegistry.sol

**Descripción:** Registro on-chain de documentos con firmas digitales

**Características:**
- ✅ Upgradeable contract (OpenZeppelin)
- ✅ Access Control (ADMIN, REGISTRAR, VERIFIER roles)
- ✅ EIP-712 structured signatures
- ✅ Multi-signature workflows
- ✅ Document hash storage (IPFS CID)
- ✅ Pausable (emergency stop)
- ✅ Timestamp tracking
- ✅ Signature verification on-chain

**Líneas de Código:** ~250

**Test Coverage:**
- ✅ `test/DocumentRegistry.test.ts` - 20+ tests

**Uso Previsto:** Registro de contratos con firma post-quantum

**Configuración del Proyecto:**

```json
// contracts/package.json
{
  "name": "quantpaychain-contracts",
  "scripts": {
    "test": "hardhat test",
    "compile": "hardhat compile",
    "deploy:local": "hardhat run scripts/deploy.ts --network localhost",
    "deploy:sepolia": "hardhat run scripts/deploy.ts --network sepolia",
    "node": "hardhat node"
  },
  "dependencies": {
    "@openzeppelin/contracts": "^5.4.0",
    "@openzeppelin/contracts-upgradeable": "^5.4.0",
    "ethers": "^6.15.0"
  },
  "devDependencies": {
    "hardhat": "^2.22.0",
    // ... testing tools
  }
}
```

**Hardhat Config:**
- ✅ TypeScript configurado
- ✅ Network configs (localhost, sepolia)
- ✅ Gas reporter
- ✅ Solidity coverage
- ✅ Contract verification (Etherscan)

**Problemas Identificados:**

❌ **Contratos NO DESPLEGADOS:**
- No hay addresses de contratos desplegados en testnet
- No hay script de deployment ejecutado
- No hay verificación en Etherscan
- `ENV_SAMPLE` menciona Sepolia pero sin configuración real

⚠️ **Integración con Frontend:**
- Frontend tiene ethers.js configurado
- Frontend tiene RainbowKit + Wagmi para Web3
- Pero no hay addresses de contratos en config
- No hay ABIs en frontend
- API de blockchain es simulada

⚠️ **Post-Quantum Security:**
- Contratos NO usan PQC layer
- EIP-712 signatures son ECDSA clásicas (no post-quantum)
- Falta integración con contract-manager.ts de qpc-v2-core

**Recomendaciones:**
1. Desplegar a Sepolia testnet
2. Integrar PQC signatures en DocumentRegistry
3. Conectar frontend con contratos reales
4. Generar ABIs y TypeChain types
5. Implementar deployment scripts completos

**Prioridad de Fixes:** 🟡 MEDIA-ALTA

---

### 4. DATABASE & PERSISTENCE

**Ubicación:** `quantpaychain-mvp/frontend/app/prisma/`

#### ⚠️ Estado: CONFIGURADO PERO DESACTIVADO (20%)

**Prisma Schema Análisis:**

```prisma
// schema.prisma - Estado: Excelente diseño, no ejecutado

generator client {
    provider = "prisma-client-js"
    binaryTargets = ["native", "linux-musl-arm64-openssl-3.0.x"]
}

datasource db {
    provider = "postgresql"
    url = env("DATABASE_URL")
}

// ✅ 15+ modelos definidos:
// - User, Account, Session, VerificationToken (NextAuth)
// - Document, Signature (DocuSign-like)
// - Property, Investment, Payment (RWA tokenization)
// - Contract, Notification
```

**Modelos Principales:**

1. **User** - Sistema de usuarios completo
   - ✅ NextAuth.js integration
   - ✅ Email + wallet address
   - ✅ KYC levels (none, basic, full)
   - ✅ Plan types (free, starter, pro)

2. **Document** - Documentos con IPFS
   - ✅ Upload tracking
   - ✅ IPFS hash storage
   - ✅ Blockchain transaction hash
   - ✅ Status workflow

3. **Property** - Propiedades tokenizadas
   - ✅ Real estate details
   - ✅ Tokenomics (totalTokens, tokenPrice)
   - ✅ ROI projections
   - ✅ Location data

4. **Investment** - Inversiones de usuarios
   - ✅ Amount tracking
   - ✅ Token quantity
   - ✅ Returns calculation
   - ✅ Status workflow

5. **Payment** - Procesamiento de pagos
   - ✅ Multi-currency (USD, USDC, ETH)
   - ✅ Provider tracking (stripe, blockchain)
   - ✅ Transaction hashes

**Seed Script:**
- ✅ `prisma/seed.ts` - Script completo para datos de prueba
- ✅ Properties mock (10+ propiedades)
- ✅ Users mock
- ✅ Investments mock

**Problemas Identificados:**

❌ **Database NO CONECTADA:**
- `DATABASE_URL` no configurada en producción (Vercel)
- Prisma client probablemente genera error en runtime
- Código frontend usa try/catch para ignorar errores de DB
- Todos los datos son mock/hardcoded

❌ **Migraciones NO EJECUTADAS:**
- No hay archivos en `prisma/migrations/`
- Schema nunca se aplicó a una DB real
- Seed script nunca se ejecutó

⚠️ **Configuración Faltante:**
- Sin PostgreSQL database (Vercel Postgres, Supabase, Neon no configurados)
- Sin variables de entorno en Vercel
- Sin backup strategy
- Sin conexión pooling config

**Estimación de Datos:**
- Schema soporta ~15 modelos
- Relaciones complejas (1-to-many, many-to-many)
- ~50+ campos totales
- Diseño sólido y escalable

**Prioridad de Fixes:** 🔴 CRÍTICA (bloqueante para producción real)

---

### 5. BACKEND SERVICES

**Ubicación:** `quantpaychain-mvp/frontend/app/backend/src/services/`

#### ⚠️ Estado: ESTRUCTURA IMPLEMENTADA, LÓGICA MOCK (40%)

**Servicios TypeScript:**

#### 5.1 PQCService.ts

**Propósito:** Post-Quantum Cryptography operations

**Implementación Actual:**
```typescript
// ❌ PROBLEMA: No importa @quantpaychain/qpc-v2-core
// ❌ Usa libsodium directamente (no es PQC real)
// ⚠️ Métodos simulan PQC pero son crypto clásica

class PQCService {
  async generateKeyPair() { /* libsodium.crypto_sign_keypair() */ }
  async signDocument() { /* libsodium.crypto_sign() */ }
  async verifySignature() { /* libsodium.crypto_sign_open() */ }
  async encryptData() { /* libsodium.crypto_box_seal() */ }
}
```

**Problemas:**
- No usa ML-KEM-768 ni ML-DSA-65 de qpc-v2-core
- No hay verdadera criptografía post-quantum
- Libsodium usa Ed25519 (vulnerable a quantum)

#### 5.2 AIAuditorService.ts

**Propósito:** AI-powered contract auditing

**Implementación Actual:**
```typescript
// ❌ PROBLEMA: No llama a OpenAI API
// ❌ Respuestas hardcodeadas

class AIAuditorService {
  async analyzeContract() {
    // Simula análisis con setTimeout
    return {
      score: 85,
      findings: [/* datos hardcodeados */],
      recommendations: [/* texto fijo */]
    }
  }
}
```

**Problemas:**
- Sin integración con OpenAI, Anthropic, etc.
- No procesa documentos reales
- No hay ML/AI real

#### 5.3 PaymentService.ts

**Propósito:** Stripe + Crypto payments

**Implementación Actual:**
```typescript
// ❌ PROBLEMA: No integra Stripe SDK
// ❌ No interactúa con blockchain

class PaymentService {
  async createStripePayment() {
    // Retorna mock payment intent
    return { clientSecret: 'mock_secret' }
  }
  
  async createCryptoPayment() {
    // Retorna mock blockchain address
    return { address: '0x...' }
  }
}
```

**Problemas:**
- Sin Stripe API key configurada
- Sin conexión a blockchain (ethers.js no conectado)
- No hay webhooks de Stripe
- No hay validación de pagos on-chain

#### 5.4 ContractService.ts

**Propósito:** Legal contract generation

**Implementación Actual:**
```typescript
// ⚠️ SEMI-FUNCIONAL

class ContractService {
  async generateContract(data) {
    // Usa jspdf para generar PDF
    // Template básico hardcodeado
    return pdfBuffer
  }
}
```

**Problemas:**
- Templates muy básicos (no profesionales)
- Sin customización por jurisdicción
- Sin integración con PQC signing
- Sin almacenamiento en IPFS

#### 5.5 PropertyService.ts

**Propósito:** Property management + RWA tokenization

**Implementación Actual:**
```typescript
// ❌ PROBLEMA: Mock data hardcodeado

class PropertyService {
  async getProperties() {
    return MOCK_PROPERTIES // Array hardcodeado
  }
  
  async tokenizeProperty() {
    // Simula blockchain transaction
    return { txHash: 'mock_hash' }
  }
}
```

**Problemas:**
- Sin database connection
- Sin blockchain interaction
- No hay real tokenization
- Datos estáticos

#### 5.6 InvestmentService.ts

**Propósito:** Investment tracking + returns calculation

**Implementación Actual:**
```typescript
// ❌ PROBLEMA: Mock data

class InvestmentService {
  async getUserInvestments(userId) {
    return MOCK_INVESTMENTS.filter(i => i.userId === userId)
  }
  
  async calculateReturns() {
    // Cálculo básico mockeado
  }
}
```

**Problemas:**
- Sin database persistence
- Sin blockchain verification
- No hay histórico real

**Análisis General Backend Services:**

⚠️ **Estructura Correcta:**
- Separación de concerns (cada servicio tiene su responsabilidad)
- Type safety con TypeScript
- Error handling básico
- Logging configurado

❌ **Implementación Insuficiente:**
- **0% de conexiones reales a servicios externos**
- **100% mock data y simulación**
- **Sin integración con qpc-v2-core**
- **Sin integración con database**
- **Sin integración con blockchain**

**Prioridad de Fixes:** 🔴 CRÍTICA

---

### 6. DEPLOYMENT & INFRASTRUCTURE

**Ubicación:** Root + `.github/workflows/`

#### ⚠️ Estado: CONFIGURADO CON PROBLEMAS (60%)

**Vercel Deployment:**

**Config Actual:**
```json
// vercel.json (raíz del repo)
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

**Problemas Identificados:**

1. ❌ **Build apunta a directorio incorrecto**
   - `vercel.json` está en raíz
   - Frontend está en `quantpaychain-mvp/frontend/app/`
   - Vercel probablemente no encuentra el proyecto Next.js

2. ❌ **Variables de entorno no configuradas**
   - Sin `DATABASE_URL`
   - Sin `NEXTAUTH_SECRET`
   - Sin API keys (Stripe, OpenAI, Pinata, AWS)
   - Sin blockchain RPC URLs

3. ⚠️ **Dominio apunta a deployment antiguo**
   - `quantpaychain.com` no muestra últimos cambios
   - Problema reportado en `DEPLOYMENT_DIAGNOSIS.md`
   - Vercel desplegando commit viejo (d33b484 vs 9f40fd4)

4. ⚠️ **Root package.json ambiguo**
```json
// package.json (raíz)
{
  "scripts": {
    "dev": "cd quantpaychain-mvp/frontend/app && npm run dev",
    "build": "cd quantpaychain-mvp/frontend/app && npm run build",
    "start": "cd quantpaychain-mvp/frontend/app && npm run start",
    "postinstall": "cd quantpaychain-mvp/frontend/app && npm install"
  }
}
```
- Scripts redirigen a subdirectorio
- Posible conflicto con Vercel auto-detection

**CI/CD Workflows:**

#### 6.1 `.github/workflows/ci.yml`

**Estado:** ✅ Configurado

**Jobs:**
- Linting (ESLint)
- Type checking (TypeScript)
- Unit tests (Jest)
- Build verification

**Problemas:**
- Tests probablemente fallan (database no conectada)
- No hay deployment automático post-merge

#### 6.2 `.github/workflows/ci-cd.yml`

**Estado:** ✅ Configurado

**Jobs:**
- Build & Test
- Deploy to Vercel (con secrets)
- Notification

**Problemas:**
- Secrets de Vercel posiblemente incorrectos
- No hay rollback strategy

#### 6.3 `.github/workflows/security.yml`

**Estado:** ✅ Configurado

**Jobs:**
- Dependency scanning (npm audit)
- CodeQL analysis
- Container security

**Recomendaciones Deployment:**

1. **Reconfigurar Vercel Project:**
   - Root Directory: `quantpaychain-mvp/frontend/app`
   - Build Command: `npm run build`
   - Install Command: `npm install`
   - Framework Preset: Next.js

2. **Configurar Variables de Entorno:**
   - DATABASE_URL (Vercel Postgres o Supabase)
   - NEXTAUTH_SECRET (generado)
   - NEXTAUTH_URL (https://quantpaychain.com)
   - Stripe keys (test mode)
   - OpenAI API key (opcional)

3. **Invalidar Cache:**
   - Redeploy con "Clear Cache and Redeploy"
   - Verificar que dominio apunte al deployment correcto

4. **Monitoreo:**
   - Setup Vercel Analytics
   - Error tracking (Sentry)
   - Performance monitoring

**Prioridad de Fixes:** 🔴 ALTA (bloqueante para demo)

---

### 7. DOCUMENTACIÓN

**Ubicación:** Múltiples archivos `.md` y `.pdf` en raíz y subdirectorios

#### ✅ Estado: EXCELENTE (90%)

**Documentos Existentes:**

1. **Whitepapers:**
   - ✅ `WHITEPAPER_EN.md` (105KB, completo)
   - ✅ `WHITEPAPER_ES.md` (122KB, completo)
   - Cobertura: Arquitectura, tokenomics, PQC, ISO20022, roadmap

2. **Guías Técnicas:**
   - ✅ `PROJECT_INVENTORY.md` - Inventario completo del proyecto
   - ✅ `INTEGRATION_STATUS.md` - Estado de integración de componentes
   - ✅ `BACKEND_ARCHITECTURE.md` - Blueprint de arquitectura backend
   - ✅ `qpc-v2-core/QPC_V2_IMPLEMENTATION.md` - Reporte de implementación PQC
   - ✅ `qpc-v2-core/ARCHITECTURE.md` - Arquitectura del core

3. **Guías de Deployment:**
   - ✅ `VERCEL_DEPLOYMENT_GUIDE.md`
   - ✅ `VERCEL_ENV_SETUP.md`
   - ✅ `DEPLOYMENT_DIAGNOSIS.md`
   - ✅ `VERCEL_FIX.md`

4. **Project Status:**
   - ✅ `PROJECT_STATUS.md` - Reporte detallado del estado
   - ✅ `NEXT_STEPS.md` - Pasos siguientes (dentro de quantpaychain-mvp)
   - ✅ `IMPLEMENTATION_SUMMARY.md`

5. **README Files:**
   - ✅ `quantpaychain-mvp/README.md` (EN)
   - ✅ `quantpaychain-mvp/README-ES.md` (ES)
   - ✅ `qpc-v2-core/README.md`
   - ✅ `quantpaychain-mvp/contracts/README.md`

6. **API Documentation:**
   - ✅ `quantpaychain-mvp/API_DOCUMENTATION.md`
   - ✅ `quantpaychain-mvp/docs/api-documentation.md`

7. **Security & Compliance:**
   - ✅ `quantpaychain-mvp/docs/SECURITY-PQC.md`

8. **Guides:**
   - ✅ `QUICK_FIX_GUIDE.md`
   - ✅ `GIT_EMAIL_FIX.md`
   - ✅ `INTEGRATION_GUIDE.md`

**Análisis de Calidad:**

✅ **Fortalezas:**
- Documentación exhaustiva y profesional
- Múltiples idiomas (EN/ES)
- Diagramas y arquitectura bien explicados
- Guías paso a paso
- Troubleshooting incluido
- Documentación para inversores (whitepapers)

⚠️ **Gaps Menores:**
- Algunos PDFs desactualizados
- Falta documentación de API con ejemplos de código
- No hay postman collection o OpenAPI spec
- Falta guía de contribución (CONTRIBUTING.md)

**Prioridad de Fixes:** 🟢 BAJA

---

## 🔍 MATRIZ DE COMPLETITUD DETALLADA

### Componente por Componente

| ID | Componente | Implementado | Testeado | Integrado | Documentado | Score | Bloqueante |
|----|------------|--------------|----------|-----------|-------------|-------|------------|
| **F1** | Landing Page | 95% | 0% | 100% | 90% | 85% | No |
| **F2** | Dashboard UI | 90% | 0% | 70% | 80% | 70% | No |
| **F3** | Auth (Email) | 95% | 50% | 100% | 90% | 84% | No |
| **F4** | Auth (Web3/SIWE) | 90% | 0% | 80% | 80% | 75% | No |
| **F5** | Document Upload | 70% | 0% | 0% | 60% | 40% | Sí |
| **F6** | Payment UI | 80% | 0% | 0% | 70% | 45% | Sí |
| **F7** | Investment UI | 75% | 0% | 20% | 60% | 45% | Sí |
| **F8** | Property List | 85% | 0% | 0% | 70% | 50% | Sí |
| **F9** | Demo Page | 95% | 50% | 100% | 90% | 84% | No |
| **F10** | i18n (EN/ES) | 95% | 0% | 100% | 80% | 85% | No |
| **B1** | API Routes (26) | 80% | 30% | 40% | 70% | 55% | Sí |
| **B2** | PQCService | 60% | 0% | 0% | 50% | 30% | Sí |
| **B3** | AIAuditorService | 40% | 0% | 0% | 40% | 25% | Sí |
| **B4** | PaymentService | 30% | 0% | 0% | 50% | 25% | Sí |
| **B5** | ContractService | 60% | 0% | 20% | 60% | 40% | No |
| **B6** | PropertyService | 50% | 0% | 0% | 50% | 30% | Sí |
| **B7** | InvestmentService | 50% | 0% | 0% | 50% | 30% | Sí |
| **C1** | QPC v2 Core (PQC) | 95% | 85% | 0% | 95% | 65% | Sí |
| **C2** | QPC v2 Core (ISO20022) | 95% | 85% | 0% | 95% | 65% | Sí |
| **C3** | QPC v2 Core (AI KYC/AML) | 95% | 85% | 0% | 95% | 65% | Sí |
| **SC1** | PermissionedToken.sol | 95% | 90% | 0% | 80% | 70% | Sí |
| **SC2** | Dividends.sol | 95% | 85% | 0% | 75% | 68% | Sí |
| **SC3** | DocumentRegistry.sol | 95% | 90% | 0% | 80% | 70% | Sí |
| **DB1** | Prisma Schema | 95% | 0% | 0% | 70% | 45% | Sí |
| **DB2** | Database Connection | 0% | 0% | 0% | 80% | 20% | Sí |
| **DB3** | Migrations | 0% | 0% | 0% | 60% | 15% | Sí |
| **DB4** | Seed Data | 80% | 0% | 0% | 70% | 40% | No |
| **D1** | Vercel Deployment | 70% | 0% | 60% | 90% | 60% | Sí |
| **D2** | Environment Vars | 20% | 0% | 20% | 95% | 30% | Sí |
| **D3** | CI/CD Workflows | 80% | 50% | 60% | 70% | 65% | No |
| **D4** | Domain Config | 60% | 0% | 60% | 80% | 55% | Sí |
| **DOC1** | Whitepapers | 100% | N/A | N/A | 100% | 95% | No |
| **DOC2** | Technical Docs | 95% | N/A | N/A | 95% | 90% | No |
| **DOC3** | API Docs | 70% | N/A | N/A | 70% | 65% | No |
| **DOC4** | README Files | 90% | N/A | N/A | 90% | 85% | No |

**Leyenda:**
- **Implementado:** Código escrito
- **Testeado:** Tests automatizados
- **Integrado:** Conectado con otros componentes
- **Documentado:** Documentación existente
- **Score:** Promedio ponderado
- **Bloqueante:** Crítico para MVP funcional

**Resumen por Categoría:**

| Categoría | Score Promedio | Estado |
|-----------|----------------|--------|
| Frontend UI | 70% | 🟡 Bueno |
| Backend Services | 32% | 🔴 Crítico |
| QPC v2 Core | 65% | 🟡 Bueno pero desconectado |
| Smart Contracts | 69% | 🟡 Completos pero no desplegados |
| Database | 30% | 🔴 Crítico |
| Deployment | 53% | 🟡 Problemático |
| Documentation | 84% | 🟢 Excelente |
| **GLOBAL** | **52%** | **🟡 MVP INICIAL** |

---

## 🚨 PROBLEMAS CRÍTICOS IDENTIFICADOS

### Prioridad P0 (Bloqueantes)

1. **❌ QPC v2 Core Desconectado (CRÍTICO)**
   - **Problema:** 13,287 líneas de código core nunca se importan ni usan
   - **Impacto:** El diferenciador tecnológico principal (PQC + ISO20022) no funciona
   - **Solución:** Publicar `@quantpaychain/qpc-v2-core` como npm package e integrar

2. **❌ Database Completamente Mock (BLOQUEANTE)**
   - **Problema:** PostgreSQL no configurado, Prisma no conectado, todos los datos son hardcoded
   - **Impacto:** No hay persistencia real, no hay demo funcional
   - **Solución:** Setup Vercel Postgres o Supabase, ejecutar migraciones, conectar Prisma client

3. **❌ Smart Contracts No Desplegados (BLOQUEANTE)**
   - **Problema:** 3 contratos Solidity completos pero sin deployment en ninguna red
   - **Impacto:** Blockchain features completamente simuladas
   - **Solución:** Deploy a Sepolia testnet, integrar addresses en frontend

4. **❌ Servicios Backend Sin Implementación Real (BLOQUEANTE)**
   - **Problema:** PaymentService, AIAuditorService, PropertyService, etc. son todos mocks
   - **Impacto:** No hay funcionalidad real, solo simulación
   - **Solución:** Integrar APIs reales (Stripe, OpenAI, blockchain RPCs)

5. **❌ Vercel Deployment Problemático (BLOQUEANTE PARA DEMO)**
   - **Problema:** Dominio muestra deployment antiguo, cambios no reflejados
   - **Impacto:** No se puede demostrar progreso a inversores
   - **Solución:** Reconfigurar proyecto Vercel, verificar build settings

### Prioridad P1 (Críticos)

6. **⚠️ PQC No Es Real Post-Quantum**
   - **Problema:** libsodium-wrappers no soporta ML-KEM-768 ni ML-DSA-65 reales
   - **Impacto:** Marketing claim de "Post-Quantum" es técnicamente incorrecto
   - **Solución:** Integrar liboqs (Open Quantum Safe library) o usar PQC real

7. **⚠️ ISO 20022 Gateway Sin Casos de Uso**
   - **Problema:** Gateway completo pero no usado en ningún flujo
   - **Impacto:** No hay demostración de interoperabilidad financiera
   - **Solución:** Crear flujo demo de payment processing con mensajes ISO 20022

8. **⚠️ AI KYC/AML Sin AI Real**
   - **Problema:** Engine usa reglas hardcodeadas, sin LLM ni ML
   - **Impacto:** Feature "AI-powered" es misleading
   - **Solución:** Integrar OpenAI API para análisis de documentos

9. **⚠️ Variables de Entorno No Configuradas**
   - **Problema:** Vercel deployment sin DATABASE_URL, API keys, secrets
   - **Impacto:** Aplicación crashea o funciona en modo fallback
   - **Solución:** Configurar todas las env vars en Vercel dashboard

10. **⚠️ Tests End-to-End Faltantes**
    - **Problema:** No hay tests de flujo completo (user journey)
    - **Impacto:** No se puede verificar que sistema funciona de punta a punta
    - **Solución:** Implementar E2E tests con Playwright o Cypress

### Prioridad P2 (Importantes)

11. **⚠️ IPFS/Pinata No Configurado**
    - **Problema:** Document upload no guarda en IPFS real
    - **Impacto:** Feature de descentralización no funcional
    - **Solución:** Setup Pinata API, integrar en DocumentService

12. **⚠️ Stripe Webhooks No Implementados**
    - **Problema:** Payments no se verifican desde Stripe backend
    - **Impacto:** Vulnerabilidad de seguridad, pagos no confirmados
    - **Solución:** Implementar webhook handler, verificar signatures

13. **⚠️ Falta Monitoreo y Logs**
    - **Problema:** No hay error tracking, analytics, o logging en producción
    - **Impacto:** Difícil diagnosticar problemas post-deployment
    - **Solución:** Integrar Sentry, Vercel Analytics, Winston logging

---

## 📈 ESTIMACIÓN DE ESFUERZO

### Por Fase de Implementación

| Fase | Descripción | Esfuerzo (horas) | Prioridad | Bloqueante |
|------|-------------|------------------|-----------|------------|
| **Fase 0** | **Fixes Críticos de Deployment** | 8h | P0 | Sí |
| 0.1 | Reconfigurar Vercel project (root directory) | 2h | P0 | Sí |
| 0.2 | Configurar variables de entorno mínimas | 2h | P0 | Sí |
| 0.3 | Setup Database (Vercel Postgres o Supabase) | 3h | P0 | Sí |
| 0.4 | Ejecutar Prisma migrations + seed | 1h | P0 | Sí |
| **Fase 1** | **Integración Backend Real** | 32h | P0 | Sí |
| 1.1 | Conectar Prisma client en backend services | 4h | P0 | Sí |
| 1.2 | Implementar PaymentService con Stripe API | 8h | P0 | Sí |
| 1.3 | Deploy smart contracts a Sepolia | 4h | P0 | Sí |
| 1.4 | Integrar contratos con frontend (ethers.js) | 6h | P0 | Sí |
| 1.5 | Implementar DocumentService con IPFS/Pinata | 6h | P0 | Sí |
| 1.6 | Conectar PropertyService y InvestmentService a DB | 4h | P0 | Sí |
| **Fase 2** | **Integración QPC v2 Core** | 24h | P0 | Sí |
| 2.1 | Publicar @quantpaychain/qpc-v2-core como npm package | 4h | P0 | No |
| 2.2 | Integrar PQC Layer en PQCService | 6h | P0 | Sí |
| 2.3 | Conectar ISO 20022 Gateway en payment flow | 8h | P1 | No |
| 2.4 | Integrar AI KYC/AML Engine en onboarding | 6h | P1 | No |
| **Fase 3** | **AI & Advanced Features** | 20h | P1 | No |
| 3.1 | Integrar OpenAI API en AIAuditorService | 8h | P1 | No |
| 3.2 | Implementar document OCR (Tesseract.js o API) | 6h | P2 | No |
| 3.3 | Mejorar ContractService con templates profesionales | 6h | P2 | No |
| **Fase 4** | **Testing & Quality Assurance** | 16h | P1 | No |
| 4.1 | Unit tests para backend services | 6h | P1 | No |
| 4.2 | Integration tests (API routes) | 4h | P1 | No |
| 4.3 | E2E tests (Playwright) - flujo completo | 6h | P1 | No |
| **Fase 5** | **PQC Real (Opcional)** | 40h | P2 | No |
| 5.1 | Research liboqs integration en Node.js | 8h | P2 | No |
| 5.2 | Implementar wrapper de liboqs | 16h | P2 | No |
| 5.3 | Reemplazar libsodium por liboqs en PQC Layer | 12h | P2 | No |
| 5.4 | Re-test todo el flujo PQC | 4h | P2 | No |
| **Fase 6** | **Optimización & Polish** | 16h | P2 | No |
| 6.1 | Performance optimization (caching, lazy loading) | 4h | P2 | No |
| 6.2 | SEO improvements | 2h | P2 | No |
| 6.3 | Accessibility audit (WCAG AA) | 4h | P2 | No |
| 6.4 | Security hardening (CSP, rate limiting) | 4h | P2 | No |
| 6.5 | Monitoring setup (Sentry, Analytics) | 2h | P2 | No |
| **Fase 7** | **Documentation & Demo** | 12h | P1 | No |
| 7.1 | Actualizar README con setup instructions | 2h | P1 | No |
| 7.2 | Crear video demo (Loom o YouTube) | 4h | P1 | No |
| 7.3 | Preparar pitch deck técnico | 4h | P1 | No |
| 7.4 | Crear postman collection / OpenAPI spec | 2h | P2 | No |

**TOTAL ESTIMADO:** 168 horas (~4-5 semanas con 1 developer full-time)

**Mínimo Viable (P0 solo):** 64 horas (~1.5-2 semanas)

---

## 🛠️ ESTRATEGIA PASO A PASO

### FASE 0: DEPLOYMENT CRÍTICO (2 días)

**Objetivo:** Hacer que quantpaychain.com muestre la versión actual y funcione básicamente

#### ✅ Checklist Fase 0:

1. **Reconfigurar Vercel Project**
   ```bash
   # En Vercel Dashboard:
   # 1. Settings → General → Root Directory
   # Cambiar de: "." a "quantpaychain-mvp/frontend/app"
   
   # 2. Settings → General → Build & Development Settings
   # Build Command: npm run build
   # Output Directory: .next
   # Install Command: npm install
   # Development Command: npm run dev
   ```

2. **Setup Database**
   ```bash
   # Opción A: Vercel Postgres (recomendado)
   # 1. En Vercel Dashboard → Storage → Create Database → Postgres
   # 2. Automáticamente agrega DATABASE_URL a env vars
   
   # Opción B: Supabase
   # 1. Crear proyecto en supabase.com
   # 2. Copiar connection string
   # 3. Agregar DATABASE_URL en Vercel env vars
   ```

3. **Configurar Variables de Entorno Mínimas**
   ```bash
   # En Vercel → Settings → Environment Variables:
   
   DATABASE_URL="postgresql://..." # De Vercel Postgres o Supabase
   NEXTAUTH_SECRET="$(openssl rand -base64 32)"
   NEXTAUTH_URL="https://quantpaychain.com"
   
   # Opcional pero recomendado:
   NEXT_PUBLIC_APP_URL="https://quantpaychain.com"
   ```

4. **Ejecutar Migrations**
   ```bash
   # Localmente (con DATABASE_URL de producción):
   cd quantpaychain-mvp/frontend/app
   npx prisma migrate deploy
   npx prisma db seed
   ```

5. **Redeploy con Cache Clear**
   ```bash
   # En Vercel Dashboard:
   # Deployments → Latest → Three dots menu → Redeploy → Clear Cache and Redeploy
   ```

6. **Verificar Deployment**
   ```bash
   # 1. Ir a https://quantpaychain.com
   # 2. Verificar que muestra último diseño
   # 3. Probar signup con email
   # 4. Verificar que dashboard carga
   # 5. Check /api/health endpoint
   ```

**Resultado Esperado:**
- ✅ Sitio actualizado
- ✅ Database conectada
- ✅ Auth funcional
- ✅ No más mock data en Users table

---

### FASE 1: BACKEND FUNCIONAL (1-2 semanas)

**Objetivo:** Conectar todos los servicios backend con APIs reales

#### Subtarea 1.1: Database Integration (4h)

```typescript
// quantpaychain-mvp/frontend/app/backend/src/utils/db.ts

import { PrismaClient } from '@prisma/client'

// Singleton pattern para Prisma client
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Conectar en todos los servicios:
import { prisma } from '@/backend/src/utils/db'

// Ejemplo en PropertyService:
async getProperties() {
  return await prisma.property.findMany({
    where: { status: 'ACTIVE' },
    include: { investments: true }
  })
}
```

**Tests:**
```bash
npm run test:integration -- PropertyService.test.ts
```

#### Subtarea 1.2: Stripe Payment Integration (8h)

```typescript
// quantpaychain-mvp/frontend/app/backend/src/services/PaymentService.ts

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export class PaymentService {
  async createPaymentIntent(amount: number, currency: string, userId: string) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // cents
      currency,
      metadata: { userId },
    })
    
    // Guardar en DB
    await prisma.payment.create({
      data: {
        userId,
        amount,
        currency,
        provider: 'stripe',
        stripePaymentIntentId: paymentIntent.id,
        status: 'PENDING',
      }
    })
    
    return paymentIntent
  }
  
  async handleWebhook(sig: string, body: Buffer) {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
    
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object
      await prisma.payment.update({
        where: { stripePaymentIntentId: paymentIntent.id },
        data: { status: 'COMPLETED' }
      })
    }
    
    return { received: true }
  }
}
```

**API Route:**
```typescript
// app/api/payments/stripe/webhook/route.ts

import { headers } from 'next/headers'
import { PaymentService } from '@/backend/src/services/PaymentService'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')!
  
  const paymentService = new PaymentService()
  return paymentService.handleWebhook(signature, Buffer.from(body))
}
```

**Environment Variables:**
```bash
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

**Tests:**
- Crear payment intent con monto test
- Simular webhook con Stripe CLI
- Verificar que payment se marca como COMPLETED

#### Subtarea 1.3: Deploy Smart Contracts (4h)

```bash
# quantpaychain-mvp/contracts/

# 1. Configurar .env
cat > .env << EOF
SEPOLIA_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY"
PRIVATE_KEY_DEPLOY="YOUR_PRIVATE_KEY"
ETHERSCAN_API_KEY="YOUR_ETHERSCAN_KEY"
EOF

# 2. Compilar contratos
npm run compile

# 3. Deploy a Sepolia
npm run deploy:sepolia

# Output esperado:
# ✅ PermissionedToken deployed to: 0x1234...
# ✅ Dividends deployed to: 0x5678...
# ✅ DocumentRegistry deployed to: 0x9ABC...

# 4. Verificar en Etherscan
npx hardhat verify --network sepolia 0x1234... "QuantPay Token" "QPT"

# 5. Guardar addresses
cat > deployed-addresses.json << EOF
{
  "sepolia": {
    "PermissionedToken": "0x1234...",
    "Dividends": "0x5678...",
    "DocumentRegistry": "0x9ABC..."
  }
}
EOF
```

**Integración con Frontend:**
```typescript
// quantpaychain-mvp/frontend/app/lib/contracts/addresses.ts

export const CONTRACT_ADDRESSES = {
  sepolia: {
    PermissionedToken: '0x1234...',
    Dividends: '0x5678...',
    DocumentRegistry: '0x9ABC...',
  }
} as const

// quantpaychain-mvp/frontend/app/lib/contracts/abis.ts
export { default as PermissionedTokenABI } from './PermissionedToken.json'
export { default as DocumentRegistryABI } from './DocumentRegistry.json'

// quantpaychain-mvp/frontend/app/lib/contracts/hooks.ts
import { useContract } from 'wagmi'
import { CONTRACT_ADDRESSES, DocumentRegistryABI } from '@/lib/contracts'

export function useDocumentRegistry() {
  return useContract({
    address: CONTRACT_ADDRESSES.sepolia.DocumentRegistry,
    abi: DocumentRegistryABI,
  })
}
```

**Tests:**
```bash
# Testear interacción con contrato
npm run test -- DocumentRegistry.integration.test.ts
```

#### Subtarea 1.4: IPFS/Pinata Integration (6h)

```typescript
// quantpaychain-mvp/frontend/app/backend/src/services/DocumentService.ts

import { PinataSDK } from 'pinata'

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: process.env.PINATA_GATEWAY!
})

export class DocumentService {
  async uploadDocument(file: File, userId: string) {
    // 1. Upload a Pinata
    const upload = await pinata.upload.file(file)
    const ipfsHash = upload.IpfsHash
    
    // 2. Register on blockchain
    const contract = new ethers.Contract(
      CONTRACT_ADDRESSES.sepolia.DocumentRegistry,
      DocumentRegistryABI,
      signer
    )
    
    const tx = await contract.registerDocument(
      ipfsHash,
      ethers.keccak256(file.arrayBuffer()), // document hash
      { from: userId }
    )
    await tx.wait()
    
    // 3. Save in database
    const document = await prisma.document.create({
      data: {
        userId,
        name: file.name,
        ipfsHash,
        blockchainTxHash: tx.hash,
        status: 'REGISTERED',
      }
    })
    
    return document
  }
  
  async downloadDocument(documentId: string) {
    const doc = await prisma.document.findUnique({
      where: { id: documentId }
    })
    
    // Get file from Pinata
    const url = `https://${process.env.PINATA_GATEWAY}/ipfs/${doc.ipfsHash}`
    return url
  }
}
```

**Environment Variables:**
```bash
PINATA_JWT="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
PINATA_GATEWAY="gateway.pinata.cloud"
```

**API Routes:**
```typescript
// app/api/documents/upload/route.ts
export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  const userId = req.headers.get('x-user-id')!
  
  const documentService = new DocumentService()
  const document = await documentService.uploadDocument(file, userId)
  
  return Response.json(document)
}

// app/api/documents/[id]/download/route.ts
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const documentService = new DocumentService()
  const url = await documentService.downloadDocument(params.id)
  
  return Response.redirect(url)
}
```

**Tests:**
- Upload test file
- Verify IPFS hash
- Verify blockchain transaction
- Download file from IPFS

#### Subtarea 1.5: Property & Investment Services (4h)

```typescript
// PropertyService.ts - Conectar a DB

export class PropertyService {
  async getProperties(filters?: PropertyFilters) {
    return await prisma.property.findMany({
      where: {
        status: 'ACTIVE',
        ...filters
      },
      include: {
        investments: {
          select: {
            tokenQuantity: true
          }
        }
      }
    })
  }
  
  async tokenizeProperty(propertyData: CreatePropertyDTO) {
    // 1. Create property in DB
    const property = await prisma.property.create({
      data: {
        ...propertyData,
        status: 'PENDING_TOKENIZATION'
      }
    })
    
    // 2. Mint tokens on blockchain
    const tokenContract = new ethers.Contract(
      CONTRACT_ADDRESSES.sepolia.PermissionedToken,
      PermissionedTokenABI,
      signer
    )
    
    const tx = await tokenContract.mint(
      property.ownerAddress,
      ethers.parseUnits(property.totalTokens.toString(), 18)
    )
    await tx.wait()
    
    // 3. Update property status
    await prisma.property.update({
      where: { id: property.id },
      data: {
        status: 'TOKENIZED',
        blockchainTokenAddress: tokenContract.address,
        blockchainTxHash: tx.hash
      }
    })
    
    return property
  }
}

// InvestmentService.ts

export class InvestmentService {
  async createInvestment(data: CreateInvestmentDTO) {
    const { userId, propertyId, amount, tokenQuantity } = data
    
    // 1. Create investment record
    const investment = await prisma.investment.create({
      data: {
        userId,
        propertyId,
        amount,
        tokenQuantity,
        status: 'PENDING_PAYMENT'
      }
    })
    
    // 2. Create payment intent
    const paymentService = new PaymentService()
    const paymentIntent = await paymentService.createPaymentIntent(
      amount,
      'usd',
      userId
    )
    
    // 3. Link payment to investment
    await prisma.payment.update({
      where: { id: paymentIntent.id },
      data: { investmentId: investment.id }
    })
    
    return { investment, clientSecret: paymentIntent.client_secret }
  }
  
  async processInvestment(investmentId: string) {
    // Called by Stripe webhook after payment success
    
    const investment = await prisma.investment.findUnique({
      where: { id: investmentId },
      include: { property: true, user: true }
    })
    
    // Transfer tokens on blockchain
    const tokenContract = new ethers.Contract(
      investment.property.blockchainTokenAddress!,
      PermissionedTokenABI,
      signer
    )
    
    const tx = await tokenContract.transfer(
      investment.user.walletAddress,
      ethers.parseUnits(investment.tokenQuantity.toString(), 18)
    )
    await tx.wait()
    
    // Update investment status
    await prisma.investment.update({
      where: { id: investmentId },
      data: {
        status: 'COMPLETED',
        blockchainTxHash: tx.hash
      }
    })
    
    // Generate digital contract
    const contractService = new ContractService()
    await contractService.generateInvestmentContract(investment)
  }
}
```

**API Routes:**
```typescript
// app/api/properties/route.ts
export async function GET(req: Request) {
  const propertyService = new PropertyService()
  const properties = await propertyService.getProperties()
  return Response.json(properties)
}

// app/api/investments/route.ts
export async function POST(req: Request) {
  const data = await req.json()
  const investmentService = new InvestmentService()
  const result = await investmentService.createInvestment(data)
  return Response.json(result)
}
```

**✅ Checklist Fase 1:**
- [x] Prisma client conectado en todos los servicios
- [x] Stripe payment intents funcionando
- [x] Stripe webhooks procesando pagos
- [x] Smart contracts desplegados en Sepolia
- [x] Frontend conectado a contratos con ethers.js
- [x] IPFS upload/download funcional
- [x] Property service persistiendo en DB
- [x] Investment flow end-to-end completo

**Tests:**
```bash
# Integration tests
npm run test:integration

# E2E test manual:
# 1. Browse properties
# 2. Select property, invest $100
# 3. Pay with Stripe test card (4242 4242 4242 4242)
# 4. Verify tokens transferred on blockchain
# 5. Verify investment appears in dashboard
```

---

### FASE 2: INTEGRACIÓN QPC V2 CORE (1-1.5 semanas)

**Objetivo:** Conectar la librería core de 13,287 líneas con el MVP

#### Subtarea 2.1: Publicar NPM Package (4h)

```bash
# qpc-v2-core/

# 1. Build el paquete
npm run build

# Output: dist/
# - index.js
# - index.d.ts
# - /pqc-layer/...
# - /iso20022-gateway/...
# - /ai-kyc-aml/...

# 2. Verificar package.json
cat package.json
# {
#   "name": "@quantpaychain/qpc-v2-core",
#   "version": "2.0.0",
#   "main": "dist/index.js",
#   "types": "dist/index.d.ts",
#   ...
# }

# 3. Opción A: Publicar en npm (público o privado)
npm login
npm publish --access public

# Opción B: Link localmente para desarrollo
npm link

# En quantpaychain-mvp/frontend/app:
npm link @quantpaychain/qpc-v2-core
```

#### Subtarea 2.2: Integrar PQC Layer en PQCService (6h)

```typescript
// quantpaychain-mvp/frontend/app/backend/src/services/PQCService.ts

// ✅ ANTES (mock):
// import libsodium from 'libsodium-wrappers'

// ✅ AHORA (real):
import { PQCLayer, KeyPair, ContractSignature } from '@quantpaychain/qpc-v2-core'

export class PQCService {
  private pqcLayer: PQCLayer
  
  constructor() {
    this.pqcLayer = new PQCLayer({
      algorithm: 'ML-DSA-65', // Dilithium for signatures
      mode: 'hybrid', // PQC + Classical
      keyStorage: {
        type: 'database',
        encryption: true
      }
    })
  }
  
  async generateKeyPair(userId: string): Promise<KeyPair> {
    // Generar key pair post-quantum
    const keyPair = await this.pqcLayer.generateKeyPair({
      algorithm: 'ML-DSA-65',
      userId
    })
    
    // Guardar en DB
    await prisma.user.update({
      where: { id: userId },
      data: {
        pqcPublicKey: keyPair.publicKey,
        pqcPrivateKey: keyPair.encryptedPrivateKey, // Encrypted!
      }
    })
    
    return keyPair
  }
  
  async signDocument(
    documentHash: string,
    userId: string
  ): Promise<ContractSignature> {
    // Get user's PQC keys
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { pqcPrivateKey: true }
    })
    
    // Sign with PQC
    const signature = await this.pqcLayer.signDocument({
      documentHash,
      privateKey: user.pqcPrivateKey,
      algorithm: 'ML-DSA-65'
    })
    
    // Store signature on blockchain + DB
    await this.storeSignature(documentHash, signature)
    
    return signature
  }
  
  async verifySignature(
    documentHash: string,
    signature: string,
    publicKey: string
  ): Promise<boolean> {
    return await this.pqcLayer.verifySignature({
      documentHash,
      signature,
      publicKey,
      algorithm: 'ML-DSA-65'
    })
  }
  
  async encryptData(data: Buffer, recipientPublicKey: string): Promise<Buffer> {
    // Usar ML-KEM-768 (Kyber) para encryption
    return await this.pqcLayer.encryptData({
      data,
      recipientPublicKey,
      algorithm: 'ML-KEM-768'
    })
  }
}
```

**API Routes:**
```typescript
// app/api/pqc/generate-keys/route.ts
export async function POST(req: Request) {
  const { userId } = await req.json()
  const pqcService = new PQCService()
  const keyPair = await pqcService.generateKeyPair(userId)
  
  return Response.json({
    publicKey: keyPair.publicKey,
    message: 'PQC keys generated successfully'
  })
}

// app/api/documents/[id]/sign/route.ts
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await req.json()
  const document = await prisma.document.findUnique({ where: { id: params.id } })
  
  const pqcService = new PQCService()
  const signature = await pqcService.signDocument(document.hash, userId)
  
  // Save signature
  await prisma.signature.create({
    data: {
      documentId: params.id,
      userId,
      signature: signature.signature,
      algorithm: 'ML-DSA-65',
      timestamp: new Date()
    }
  })
  
  return Response.json({ success: true, signature })
}
```

**Frontend Integration:**
```typescript
// components/dashboard/document-sign.tsx

export function DocumentSignButton({ documentId }: { documentId: string }) {
  const { address } = useAccount()
  
  const handleSign = async () => {
    // 1. Call PQC signing API
    const response = await fetch(`/api/documents/${documentId}/sign`, {
      method: 'POST',
      body: JSON.stringify({ userId: address }),
    })
    
    const { signature } = await response.json()
    
    // 2. Display success + signature details
    toast.success('Document signed with Post-Quantum Cryptography!')
    
    // 3. Show signature info (algorithm, timestamp, hash)
    console.log('PQC Signature:', signature)
  }
  
  return (
    <Button onClick={handleSign}>
      🔐 Sign with PQC (ML-DSA-65)
    </Button>
  )
}
```

**Tests:**
```typescript
// tests/integration/pqc-integration.test.ts

describe('PQC Integration', () => {
  it('should generate PQC key pair', async () => {
    const pqcService = new PQCService()
    const keyPair = await pqcService.generateKeyPair('user-123')
    
    expect(keyPair.publicKey).toBeDefined()
    expect(keyPair.publicKey.length).toBeGreaterThan(1900) // ML-DSA-65: ~1952 bytes
  })
  
  it('should sign and verify document', async () => {
    const pqcService = new PQCService()
    const keyPair = await pqcService.generateKeyPair('user-123')
    
    const documentHash = 'abc123...'
    const signature = await pqcService.signDocument(documentHash, 'user-123')
    
    const isValid = await pqcService.verifySignature(
      documentHash,
      signature.signature,
      keyPair.publicKey
    )
    
    expect(isValid).toBe(true)
  })
})
```

#### Subtarea 2.3: Integrar ISO 20022 Gateway (8h)

**Caso de Uso:** Payment processing con mensajes estándar ISO 20022

```typescript
// quantpaychain-mvp/frontend/app/backend/src/services/ISO20022Service.ts

import { ISO20022Gateway, Pain001Message, Pacs008Message } from '@quantpaychain/qpc-v2-core'

export class ISO20022Service {
  private gateway: ISO20022Gateway
  
  constructor() {
    this.gateway = new ISO20022Gateway({
      validator: {
        schemaValidation: true,
        businessRules: true
      },
      logger: logger // Winston logger
    })
  }
  
  async createPaymentMessage(payment: Payment): Promise<string> {
    // Crear mensaje pain.001 (Customer Credit Transfer Initiation)
    const pain001: Pain001Message = {
      messageId: payment.id,
      creationDateTime: new Date().toISOString(),
      numberOfTransactions: 1,
      controlSum: payment.amount,
      initiatingParty: {
        name: payment.sender.name,
        identification: payment.sender.accountNumber
      },
      paymentInformation: [{
        paymentMethod: 'TRF',
        debtorAccount: payment.sender.accountNumber,
        debtorAgent: payment.sender.bankBIC,
        creditTransfers: [{
          paymentId: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          creditorName: payment.receiver.name,
          creditorAccount: payment.receiver.accountNumber,
          creditorAgent: payment.receiver.bankBIC,
          remittanceInformation: payment.description
        }]
      }]
    }
    
    // Validar y convertir a XML
    const xmlMessage = await this.gateway.createMessage(pain001, 'pain.001')
    
    // Guardar en DB
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        iso20022Message: xmlMessage,
        iso20022MessageType: 'pain.001'
      }
    })
    
    return xmlMessage
  }
  
  async processIncomingMessage(xmlMessage: string): Promise<any> {
    // Parse y valida mensaje ISO 20022
    const parsed = await this.gateway.parseMessage(xmlMessage)
    
    if (parsed.messageType === 'pacs.008') {
      // Financial Institution Credit Transfer
      const pacs008 = parsed.data as Pacs008Message
      
      // Process payment
      await this.processInstitutionalPayment(pacs008)
    } else if (parsed.messageType === 'camt.053') {
      // Bank to Customer Statement
      await this.processBankStatement(parsed.data)
    }
    
    return parsed
  }
  
  async transformToInternalFormat(xmlMessage: string) {
    // Convertir ISO 20022 → Internal payment format
    return await this.gateway.transform(xmlMessage, 'toInternal')
  }
  
  async transformToISO20022(internalPayment: any) {
    // Convertir Internal format → ISO 20022
    return await this.gateway.transform(internalPayment, 'toISO20022')
  }
}
```

**Integration with Payment Flow:**
```typescript
// PaymentService.ts - Enhanced

export class PaymentService {
  private iso20022Service: ISO20022Service
  
  async processPayment(paymentData: PaymentDTO) {
    // 1. Create payment in DB
    const payment = await prisma.payment.create({ data: paymentData })
    
    // 2. Generate ISO 20022 message
    const iso20022Message = await this.iso20022Service.createPaymentMessage(payment)
    
    // 3. Send to payment processor (Stripe, bank API, etc.)
    if (paymentData.provider === 'stripe') {
      await this.processStripePayment(payment)
    } else if (paymentData.provider === 'bank_transfer') {
      // Send ISO 20022 message to bank API
      await this.sendToBankAPI(iso20022Message)
    }
    
    return payment
  }
}
```

**API Routes:**
```typescript
// app/api/iso20022/create-message/route.ts
export async function POST(req: Request) {
  const paymentData = await req.json()
  const iso20022Service = new ISO20022Service()
  
  const xmlMessage = await iso20022Service.createPaymentMessage(paymentData)
  
  return new Response(xmlMessage, {
    headers: { 'Content-Type': 'application/xml' }
  })
}

// app/api/iso20022/parse/route.ts
export async function POST(req: Request) {
  const xmlMessage = await req.text()
  const iso20022Service = new ISO20022Service()
  
  const parsed = await iso20022Service.processIncomingMessage(xmlMessage)
  
  return Response.json(parsed)
}
```

**Demo Page:**
```typescript
// app/demo-iso20022/page.tsx

export default function ISO20022DemoPage() {
  const [xmlMessage, setXmlMessage] = useState('')
  const [parsedData, setParsedData] = useState(null)
  
  const handleGenerate = async () => {
    const response = await fetch('/api/iso20022/create-message', {
      method: 'POST',
      body: JSON.stringify({
        amount: 1000,
        currency: 'USD',
        sender: { name: 'Alice', accountNumber: '123456' },
        receiver: { name: 'Bob', accountNumber: '789012' }
      })
    })
    
    const xml = await response.text()
    setXmlMessage(xml)
  }
  
  return (
    <div>
      <h1>ISO 20022 Gateway Demo</h1>
      <Button onClick={handleGenerate}>Generate pain.001 Message</Button>
      
      {xmlMessage && (
        <pre className="bg-gray-100 p-4 rounded">
          {xmlMessage}
        </pre>
      )}
      
      <p className="text-sm text-gray-600 mt-4">
        ✅ ISO 20022 compliant payment message
        <br />
        ✅ Schema validated
        <br />
        ✅ Business rules checked
      </p>
    </div>
  )
}
```

#### Subtarea 2.4: Integrar AI KYC/AML Engine (6h)

**Caso de Uso:** User onboarding con KYC/AML checks

```typescript
// quantpaychain-mvp/frontend/app/backend/src/services/KYCAMLService.ts

import { AIKYCAMLEngine, RiskAssessment, ComplianceReport } from '@quantpaychain/qpc-v2-core'

export class KYCAMLService {
  private engine: AIKYCAMLEngine
  
  constructor() {
    this.engine = new AIKYCAMLEngine({
      riskThresholds: {
        low: 30,
        medium: 60,
        high: 80
      },
      sanctionsLists: ['OFAC', 'UN', 'EU'],
      enablePatternDetection: true
    })
  }
  
  async performKYCCheck(userData: KYCData): Promise<RiskAssessment> {
    // 1. Check sanctions lists
    const sanctionsResult = await this.engine.checkSanctions({
      name: userData.fullName,
      dateOfBirth: userData.dateOfBirth,
      nationality: userData.nationality
    })
    
    if (sanctionsResult.isMatch) {
      throw new Error('User is on sanctions list')
    }
    
    // 2. Verify identity document
    const documentVerification = await this.engine.verifyDocument({
      documentType: userData.documentType,
      documentNumber: userData.documentNumber,
      documentImage: userData.documentImage, // Base64 or URL
      selfieImage: userData.selfieImage
    })
    
    if (!documentVerification.isValid) {
      throw new Error('Document verification failed')
    }
    
    // 3. Assess risk
    const riskScore = await this.engine.assessRisk({
      user: userData,
      transactionHistory: [],
      geolocation: userData.country
    })
    
    // 4. Save in DB
    await prisma.user.update({
      where: { id: userData.userId },
      data: {
        kycVerified: riskScore.level !== 'critical',
        kycLevel: riskScore.level === 'low' ? 'full' : 'basic',
        kycRiskScore: riskScore.score
      }
    })
    
    return riskScore
  }
  
  async monitorTransaction(transaction: Transaction): Promise<ComplianceReport> {
    // 1. Detect suspicious patterns
    const patterns = await this.engine.detectPatterns([transaction])
    
    // 2. Check if transaction triggers AML rules
    const ruleViolations = await this.engine.checkRules(transaction)
    
    // 3. Generate compliance report
    const report = await this.engine.generateComplianceReport({
      transaction,
      patterns,
      ruleViolations,
      timestamp: new Date()
    })
    
    // 4. If high risk, flag for manual review
    if (report.riskLevel === 'high' || report.riskLevel === 'critical') {
      await this.flagForReview(transaction, report)
    }
    
    return report
  }
  
  async flagForReview(transaction: Transaction, report: ComplianceReport) {
    await prisma.complianceAlert.create({
      data: {
        transactionId: transaction.id,
        alertType: 'AML_HIGH_RISK',
        riskScore: report.riskScore,
        findings: report.findings,
        status: 'PENDING_REVIEW'
      }
    })
    
    // Send notification to compliance team
    await this.notifyComplianceTeam(report)
  }
}
```

**API Routes:**
```typescript
// app/api/kyc/verify/route.ts
export async function POST(req: Request) {
  const kycData = await req.json()
  const kycService = new KYCAMLService()
  
  try {
    const riskAssessment = await kycService.performKYCCheck(kycData)
    
    return Response.json({
      success: true,
      riskLevel: riskAssessment.level,
      message: 'KYC verification completed'
    })
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 400 })
  }
}

// app/api/aml/monitor/route.ts (webhook o cron job)
export async function POST(req: Request) {
  const { transactionId } = await req.json()
  const transaction = await prisma.transaction.findUnique({ where: { id: transactionId } })
  
  const kycService = new KYCAMLService()
  const report = await kycService.monitorTransaction(transaction)
  
  return Response.json(report)
}
```

**Frontend Integration:**
```typescript
// app/onboarding/kyc/page.tsx

export default function KYCOnboardingPage() {
  const [kycData, setKYCData] = useState({})
  const [isVerifying, setIsVerifying] = useState(false)
  
  const handleSubmitKYC = async () => {
    setIsVerifying(true)
    
    const response = await fetch('/api/kyc/verify', {
      method: 'POST',
      body: JSON.stringify(kycData)
    })
    
    const result = await response.json()
    
    if (result.success) {
      toast.success(`KYC Approved! Risk Level: ${result.riskLevel}`)
      router.push('/dashboard')
    } else {
      toast.error(`KYC Failed: ${result.error}`)
    }
    
    setIsVerifying(false)
  }
  
  return (
    <form>
      <h1>KYC Verification</h1>
      
      <Input label="Full Name" onChange={(e) => setKYCData({ ...kycData, fullName: e.target.value })} />
      <Input label="Date of Birth" type="date" />
      <Select label="Document Type">
        <option>Passport</option>
        <option>Driver License</option>
        <option>National ID</option>
      </Select>
      <FileUpload label="Upload Document" accept="image/*" />
      <FileUpload label="Upload Selfie" accept="image/*" />
      
      <Button onClick={handleSubmitKYC} disabled={isVerifying}>
        {isVerifying ? 'Verifying with AI...' : 'Submit KYC'}
      </Button>
      
      <p className="text-sm">
        ✅ Sanctions list check (OFAC, UN, EU)
        <br />
        ✅ Document verification with OCR
        <br />
        ✅ AI-powered risk assessment
      </p>
    </form>
  )
}
```

**✅ Checklist Fase 2:**
- [x] @quantpaychain/qpc-v2-core publicado como npm package
- [x] PQCService usando PQC Layer real (ML-DSA-65, ML-KEM-768)
- [x] Document signing con post-quantum signatures
- [x] ISO 20022 Gateway integrado en payment flow
- [x] AI KYC/AML Engine funcionando en onboarding
- [x] Tests de integración pasando
- [x] Demo pages mostrando features PQC + ISO20022

---

### FASE 3: AI & ADVANCED FEATURES (1 semana)

**Objetivo:** Integrar AI real y mejorar features avanzadas

#### Subtarea 3.1: OpenAI Integration en AIAuditorService (8h)

```typescript
// quantpaychain-mvp/frontend/app/backend/src/services/AIAuditorService.ts

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export class AIAuditorService {
  async analyzeContract(contractText: string): Promise<AuditReport> {
    // 1. Call OpenAI GPT-4 for contract analysis
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an expert legal contract auditor. Analyze the following contract and provide:
          1. Risk score (0-100)
          2. Key findings (security issues, legal concerns, ambiguities)
          3. Recommendations for improvement
          4. Compliance check (GDPR, securities law, etc.)
          
          Format response as JSON.`
        },
        {
          role: 'user',
          content: contractText
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3
    })
    
    const analysis = JSON.parse(completion.choices[0].message.content!)
    
    // 2. Enhance with rule-based checks
    const ruleBasedScore = await this.performRuleBasedAudit(contractText)
    
    // 3. Combine AI + rules
    const finalReport: AuditReport = {
      score: (analysis.riskScore + ruleBasedScore) / 2,
      findings: [
        ...analysis.findings,
        ...this.checkStandardClauses(contractText)
      ],
      recommendations: analysis.recommendations,
      compliance: analysis.compliance,
      timestamp: new Date(),
      aiModel: 'gpt-4-turbo'
    }
    
    // 4. Save in DB
    await prisma.audit.create({
      data: {
        contractId: contractText.substring(0, 50), // ID placeholder
        report: finalReport,
        status: 'COMPLETED'
      }
    })
    
    return finalReport
  }
  
  async performRuleBasedAudit(contractText: string): Promise<number> {
    let score = 100
    
    // Deduct points for missing clauses
    if (!contractText.includes('confidentiality')) score -= 10
    if (!contractText.includes('termination')) score -= 15
    if (!contractText.includes('governing law')) score -= 20
    if (!contractText.includes('dispute resolution')) score -= 15
    
    // Deduct for risky terms
    if (contractText.includes('unlimited liability')) score -= 30
    if (contractText.includes('perpetual agreement')) score -= 20
    
    return Math.max(0, score)
  }
  
  async checkStandardClauses(contractText: string) {
    const requiredClauses = [
      'Confidentiality Clause',
      'Termination Clause',
      'Governing Law',
      'Dispute Resolution',
      'Force Majeure'
    ]
    
    return requiredClauses
      .filter(clause => !contractText.toLowerCase().includes(clause.toLowerCase()))
      .map(clause => ({
        type: 'missing_clause',
        severity: 'medium',
        description: `Missing: ${clause}`
      }))
  }
}
```

**API Routes:**
```typescript
// app/api/ai-auditor/analyze/route.ts
export async function POST(req: Request) {
  const { contractId } = await req.json()
  
  const contract = await prisma.contract.findUnique({
    where: { id: contractId }
  })
  
  const aiAuditor = new AIAuditorService()
  const report = await aiAuditor.analyzeContract(contract.content)
  
  return Response.json(report)
}
```

**Frontend Component:**
```typescript
// components/dashboard/ai-audit-button.tsx

export function AIAuditButton({ contractId }: { contractId: string }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [report, setReport] = useState<AuditReport | null>(null)
  
  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    
    const response = await fetch('/api/ai-auditor/analyze', {
      method: 'POST',
      body: JSON.stringify({ contractId })
    })
    
    const auditReport = await response.json()
    setReport(auditReport)
    setIsAnalyzing(false)
  }
  
  return (
    <div>
      <Button onClick={handleAnalyze} disabled={isAnalyzing}>
        {isAnalyzing ? (
          <>
            <Loader2 className="animate-spin" />
            Analyzing with AI...
          </>
        ) : (
          <>
            🤖 AI Audit Contract
          </>
        )}
      </Button>
      
      {report && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>AI Audit Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold">
                {report.score}/100
              </span>
              <Badge variant={
                report.score > 80 ? 'success' :
                report.score > 60 ? 'warning' : 'destructive'
              }>
                {report.score > 80 ? 'Low Risk' :
                 report.score > 60 ? 'Medium Risk' : 'High Risk'}
              </Badge>
            </div>
            
            <h4 className="font-semibold mb-2">Findings:</h4>
            <ul className="list-disc pl-5">
              {report.findings.map((finding, i) => (
                <li key={i}>{finding.description}</li>
              ))}
            </ul>
            
            <h4 className="font-semibold mt-4 mb-2">Recommendations:</h4>
            <ul className="list-disc pl-5">
              {report.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
```

**Environment Variables:**
```bash
OPENAI_API_KEY="sk-proj-..."
```

#### Subtarea 3.2: Document OCR (6h)

**Opción A: Tesseract.js (Client-side, free)**
```typescript
// components/dashboard/document-upload-ocr.tsx

import Tesseract from 'tesseract.js'

export function DocumentUploadWithOCR() {
  const [ocrText, setOCRText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  
  const handleFileUpload = async (file: File) => {
    setIsProcessing(true)
    
    const { data: { text } } = await Tesseract.recognize(
      file,
      'eng',
      {
        logger: (m) => console.log(m)
      }
    )
    
    setOCRText(text)
    setIsProcessing(false)
  }
  
  return (
    <div>
      <FileUpload onUpload={handleFileUpload} />
      
      {isProcessing && (
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin" />
          Processing OCR...
        </div>
      )}
      
      {ocrText && (
        <Card>
          <CardHeader>
            <CardTitle>Extracted Text</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap">{ocrText}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
```

**Opción B: Azure Computer Vision API (Server-side, más preciso)**
```typescript
// backend/src/services/OCRService.ts

import { ComputerVisionClient } from '@azure/cognitiveservices-computervision'
import { ApiKeyCredentials } from '@azure/ms-rest-js'

export class OCRService {
  private client: ComputerVisionClient
  
  constructor() {
    const credentials = new ApiKeyCredentials({
      inHeader: { 'Ocp-Apim-Subscription-Key': process.env.AZURE_CV_KEY! }
    })
    this.client = new ComputerVisionClient(
      credentials,
      process.env.AZURE_CV_ENDPOINT!
    )
  }
  
  async extractText(imageUrl: string): Promise<string> {
    const result = await this.client.read(imageUrl)
    const operationId = result.operationLocation!.split('/').pop()!
    
    // Poll for result
    let readResult
    do {
      readResult = await this.client.getReadResult(operationId)
      await this.delay(1000)
    } while (readResult.status === 'running' || readResult.status === 'notStarted')
    
    // Extract text
    const text = readResult.analyzeResult!.readResults
      .map(page => page.lines.map(line => line.text).join('\n'))
      .join('\n')
    
    return text
  }
  
  async verifyIdentityDocument(imageUrl: string): Promise<IDVerificationResult> {
    // Extract text
    const text = await this.extractText(imageUrl)
    
    // Parse fields using regex
    const nameMatch = text.match(/Name:\s*(.+)/i)
    const dobMatch = text.match(/Date of Birth:\s*(\d{2}\/\d{2}\/\d{4})/i)
    const idNumberMatch = text.match(/ID Number:\s*([A-Z0-9]+)/i)
    
    return {
      fullName: nameMatch?.[1],
      dateOfBirth: dobMatch?.[1],
      idNumber: idNumberMatch?.[1],
      extractedText: text,
      confidence: 0.85 // Azure returns confidence scores
    }
  }
}
```

#### Subtarea 3.3: Contract Templates Profesionales (6h)

```typescript
// backend/src/services/ContractService.ts - Enhanced

import PDFDocument from 'pdfkit'
import { compile } from 'handlebars'
import fs from 'fs'

export class ContractService {
  private templates: Map<string, string>
  
  constructor() {
    // Load professional contract templates
    this.templates = new Map([
      ['investment', fs.readFileSync('./templates/investment-agreement.hbs', 'utf-8')],
      ['nda', fs.readFileSync('./templates/nda.hbs', 'utf-8')],
      ['service', fs.readFileSync('./templates/service-agreement.hbs', 'utf-8')],
    ])
  }
  
  async generateInvestmentContract(data: InvestmentContractData): Promise<Buffer> {
    // 1. Compile Handlebars template
    const template = compile(this.templates.get('investment')!)
    const html = template({
      investor: data.investor,
      property: data.property,
      amount: data.amount,
      tokenQuantity: data.tokenQuantity,
      roi: data.expectedROI,
      date: new Date().toLocaleDateString(),
      jurisdiction: data.jurisdiction || 'Delaware, USA',
      // ... más campos
    })
    
    // 2. Generate PDF with professional styling
    const pdf = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    })
    
    const chunks: Buffer[] = []
    pdf.on('data', (chunk) => chunks.push(chunk))
    
    // Header
    pdf
      .fontSize(20)
      .font('Helvetica-Bold')
      .text('INVESTMENT AGREEMENT', { align: 'center' })
      .moveDown()
    
    pdf
      .fontSize(10)
      .font('Helvetica')
      .text(`Contract ID: ${data.contractId}`)
      .text(`Date: ${new Date().toLocaleDateString()}`)
      .moveDown()
    
    // Parties section
    pdf
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('PARTIES')
      .moveDown(0.5)
    
    pdf
      .fontSize(10)
      .font('Helvetica')
      .text(`Investor: ${data.investor.name}`)
      .text(`Address: ${data.investor.address}`)
      .text(`Wallet: ${data.investor.walletAddress}`)
      .moveDown()
    
    pdf
      .text(`Property Issuer: ${data.property.issuer}`)
      .text(`Property: ${data.property.name}`)
      .text(`Location: ${data.property.location}`)
      .moveDown(2)
    
    // Terms section
    pdf
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('INVESTMENT TERMS')
      .moveDown(0.5)
    
    pdf
      .fontSize(10)
      .font('Helvetica')
      .text(`Investment Amount: $${data.amount.toLocaleString()}`)
      .text(`Token Quantity: ${data.tokenQuantity}`)
      .text(`Expected Annual ROI: ${data.expectedROI}%`)
      .text(`Distribution Frequency: Quarterly`)
      .moveDown(2)
    
    // Legal clauses
    pdf
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('LEGAL PROVISIONS')
      .moveDown(0.5)
    
    const clauses = [
      '1. REPRESENTATIONS AND WARRANTIES: Investor represents that they are an accredited investor...',
      '2. RISK DISCLOSURE: Investor acknowledges the risks associated with real estate tokenization...',
      '3. CONFIDENTIALITY: Both parties agree to maintain confidentiality of proprietary information...',
      '4. GOVERNING LAW: This agreement shall be governed by the laws of Delaware, USA...',
      '5. DISPUTE RESOLUTION: Any disputes shall be resolved through arbitration...',
      '6. TERMINATION: This agreement may be terminated by mutual written consent...',
    ]
    
    clauses.forEach(clause => {
      pdf
        .fontSize(10)
        .font('Helvetica')
        .text(clause)
        .moveDown(0.5)
    })
    
    // Signature section
    pdf.addPage()
    pdf
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('SIGNATURES')
      .moveDown(2)
    
    pdf
      .fontSize(10)
      .font('Helvetica')
      .text('Investor Signature:')
      .moveDown(1)
      .text('_'.repeat(40))
      .moveDown(0.5)
      .text(`Name: ${data.investor.name}`)
      .text(`Date: ${new Date().toLocaleDateString()}`)
      .text(`Digital Signature (PQC): ${data.pqcSignature?.substring(0, 64)}...`)
      .moveDown(2)
    
    pdf
      .text('Property Issuer Signature:')
      .moveDown(1)
      .text('_'.repeat(40))
      .moveDown(0.5)
      .text(`Name: ${data.property.issuer}`)
      .text(`Date: ${new Date().toLocaleDateString()}`)
    
    // Footer
    pdf
      .fontSize(8)
      .text(
        'This document was generated and signed using Post-Quantum Cryptography (ML-DSA-65)',
        50,
        pdf.page.height - 50,
        { align: 'center' }
      )
    
    pdf.end()
    
    return new Promise((resolve) => {
      pdf.on('end', () => {
        resolve(Buffer.concat(chunks))
      })
    })
  }
  
  async signContractWithPQC(contractBuffer: Buffer, userId: string): Promise<SignedContract> {
    // 1. Hash contract
    const contractHash = createHash('sha256').update(contractBuffer).digest('hex')
    
    // 2. Sign with PQC
    const pqcService = new PQCService()
    const signature = await pqcService.signDocument(contractHash, userId)
    
    // 3. Upload to IPFS
    const documentService = new DocumentService()
    const ipfsHash = await documentService.uploadToIPFS(contractBuffer)
    
    // 4. Register on blockchain
    const blockchainTx = await this.registerOnBlockchain(contractHash, ipfsHash, signature)
    
    // 5. Save in database
    const signedContract = await prisma.contract.create({
      data: {
        userId,
        contractHash,
        ipfsHash,
        pqcSignature: signature.signature,
        blockchainTxHash: blockchainTx.hash,
        status: 'SIGNED'
      }
    })
    
    return signedContract
  }
}
```

**Template Handlebars Example:**
```handlebars
<!-- templates/investment-agreement.hbs -->

<div class="contract">
  <h1>INVESTMENT AGREEMENT</h1>
  
  <section class="parties">
    <h2>PARTIES</h2>
    <p>
      This Investment Agreement ("Agreement") is entered into on {{date}}, 
      between:
    </p>
    <p>
      <strong>Investor:</strong> {{investor.name}}<br>
      Address: {{investor.address}}<br>
      Wallet Address: {{investor.walletAddress}}
    </p>
    <p>
      <strong>Property Issuer:</strong> {{property.issuer}}<br>
      Property: {{property.name}}<br>
      Location: {{property.location}}
    </p>
  </section>
  
  <section class="terms">
    <h2>INVESTMENT TERMS</h2>
    <ul>
      <li>Investment Amount: ${{amount}}</li>
      <li>Token Quantity: {{tokenQuantity}}</li>
      <li>Expected Annual ROI: {{roi}}%</li>
      <li>Distribution Frequency: Quarterly</li>
    </ul>
  </section>
  
  <!-- ... más secciones ... -->
</div>
```

**✅ Checklist Fase 3:**
- [x] OpenAI GPT-4 integrado en AIAuditorService
- [x] Document OCR funcional (Tesseract.js o Azure CV)
- [x] Contract templates profesionales (investment, NDA, service)
- [x] PDF generation mejorado con styling
- [x] Contract signing con PQC + IPFS + blockchain
- [x] Frontend components para AI audit y OCR

---

### FASE 4: TESTING & QA (1 semana)

**Objetivo:** Asegurar calidad y estabilidad del sistema

#### Subtarea 4.1: Unit Tests Backend Services (6h)

```typescript
// tests/unit/PaymentService.test.ts

import { PaymentService } from '@/backend/src/services/PaymentService'
import { prisma } from '@/backend/src/utils/db'

describe('PaymentService', () => {
  let paymentService: PaymentService
  
  beforeAll(() => {
    paymentService = new PaymentService()
  })
  
  describe('createPaymentIntent', () => {
    it('should create Stripe payment intent', async () => {
      const result = await paymentService.createPaymentIntent(
        100, // amount
        'usd',
        'user-123'
      )
      
      expect(result.clientSecret).toBeDefined()
      expect(result.amount).toBe(10000) // cents
      
      // Verify DB record
      const payment = await prisma.payment.findFirst({
        where: { stripePaymentIntentId: result.id }
      })
      expect(payment).toBeDefined()
      expect(payment?.status).toBe('PENDING')
    })
  })
  
  describe('handleWebhook', () => {
    it('should process payment_intent.succeeded', async () => {
      // Setup test payment
      const payment = await prisma.payment.create({
        data: {
          userId: 'user-123',
          amount: 100,
          currency: 'usd',
          provider: 'stripe',
          stripePaymentIntentId: 'pi_test_123',
          status: 'PENDING'
        }
      })
      
      // Simulate webhook event
      const event = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test_123',
            amount: 10000
          }
        }
      }
      
      await paymentService.handleWebhookEvent(event)
      
      // Verify status updated
      const updated = await prisma.payment.findUnique({
        where: { id: payment.id }
      })
      expect(updated?.status).toBe('COMPLETED')
    })
  })
})

// tests/unit/PQCService.test.ts

import { PQCService } from '@/backend/src/services/PQCService'

describe('PQCService', () => {
  let pqcService: PQCService
  
  beforeAll(() => {
    pqcService = new PQCService()
  })
  
  it('should generate PQC key pair', async () => {
    const keyPair = await pqcService.generateKeyPair('user-123')
    
    expect(keyPair.publicKey).toBeDefined()
    expect(keyPair.publicKey.length).toBeGreaterThan(1900) // ML-DSA-65
  })
  
  it('should sign and verify document', async () => {
    const keyPair = await pqcService.generateKeyPair('user-123')
    const documentHash = 'abc123...'
    
    const signature = await pqcService.signDocument(documentHash, 'user-123')
    
    const isValid = await pqcService.verifySignature(
      documentHash,
      signature.signature,
      keyPair.publicKey
    )
    
    expect(isValid).toBe(true)
  })
  
  it('should reject invalid signature', async () => {
    const keyPair = await pqcService.generateKeyPair('user-123')
    const documentHash = 'abc123...'
    
    const isValid = await pqcService.verifySignature(
      documentHash,
      'invalid_signature',
      keyPair.publicKey
    )
    
    expect(isValid).toBe(false)
  })
})
```

**Run Tests:**
```bash
npm run test:unit -- --coverage
```

#### Subtarea 4.2: Integration Tests API Routes (4h)

```typescript
// tests/integration/api-routes.test.ts

import { createMocks } from 'node-mocks-http'
import { POST as createPaymentIntent } from '@/app/api/payments/stripe/create-intent/route'

describe('API Routes - Payments', () => {
  it('POST /api/payments/stripe/create-intent', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        amount: 100,
        currency: 'usd',
        userId: 'user-123'
      }
    })
    
    const response = await createPaymentIntent(req as any)
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.clientSecret).toBeDefined()
  })
})

describe('API Routes - Documents', () => {
  it('POST /api/documents/upload', async () => {
    const formData = new FormData()
    formData.append('file', new File(['test'], 'test.pdf'))
    formData.append('userId', 'user-123')
    
    const response = await fetch('http://localhost:3000/api/documents/upload', {
      method: 'POST',
      body: formData
    })
    
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.ipfsHash).toBeDefined()
  })
})
```

#### Subtarea 4.3: E2E Tests con Playwright (6h)

```typescript
// tests/e2e/investment-flow.spec.ts

import { test, expect } from '@playwright/test'

test.describe('Investment Flow E2E', () => {
  test('complete investment journey', async ({ page }) => {
    // 1. Landing page
    await page.goto('http://localhost:3000')
    await expect(page.locator('h1')).toContainText('QuantPay Chain')
    
    // 2. Sign up
    await page.click('text=Sign Up')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'Test123!')
    await page.click('button[type="submit"]')
    
    // 3. Verify dashboard loaded
    await expect(page).toHaveURL(/.*dashboard/)
    
    // 4. Browse properties
    await page.click('text=Properties')
    await expect(page.locator('.property-card')).toHaveCount.greaterThan(0)
    
    // 5. Select property
    await page.click('.property-card').first()
    await expect(page.locator('h1')).toContainText('Property Details')
    
    // 6. Invest
    await page.fill('input[name="amount"]', '1000')
    await page.click('button:has-text("Invest Now")')
    
    // 7. Payment with Stripe
    const stripeFrame = page.frameLocator('iframe[name*="stripe"]')
    await stripeFrame.fill('input[name="cardNumber"]', '4242424242424242')
    await stripeFrame.fill('input[name="cardExpiry"]', '12/34')
    await stripeFrame.fill('input[name="cardCvc"]', '123')
    await page.click('button:has-text("Pay $1,000")')
    
    // 8. Verify success
    await expect(page.locator('.success-message')).toBeVisible()
    await expect(page.locator('.success-message')).toContainText('Investment successful')
    
    // 9. Check dashboard for investment
    await page.goto('http://localhost:3000/dashboard')
    await expect(page.locator('.investment-card')).toHaveCount(1)
    await expect(page.locator('.investment-card')).toContainText('$1,000')
    
    // 10. Download contract
    await page.click('text=Download Contract')
    const download = await page.waitForEvent('download')
    expect(download.suggestedFilename()).toContain('.pdf')
  })
  
  test('PQC signature flow', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard')
    
    // Upload document
    await page.setInputFiles('input[type="file"]', 'test-contract.pdf')
    await page.click('button:has-text("Upload")')
    
    // Wait for upload
    await expect(page.locator('.document-card')).toBeVisible()
    
    // Sign with PQC
    await page.click('button:has-text("Sign with PQC")')
    
    // Verify signature
    await expect(page.locator('.signature-badge')).toContainText('ML-DSA-65')
    await expect(page.locator('.signature-badge')).toContainText('Signed')
  })
})
```

**Playwright Config:**
```typescript
// playwright.config.ts

import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

**Run E2E Tests:**
```bash
npx playwright test
npx playwright show-report
```

**✅ Checklist Fase 4:**
- [x] Unit tests para todos los servicios backend
- [x] Integration tests para API routes
- [x] E2E tests para flujos críticos (investment, signup, payment)
- [x] Test coverage >70%
- [x] CI pipeline ejecutando tests automáticamente

---

### FASE 5: PQC REAL (Opcional - Técnico Avanzado)

**⚠️ ADVERTENCIA:** Esta fase es técnicamente compleja y requiere expertise en criptografía. Solo si necesitas verdadera PQC para compliance o marketing crítico.

#### Subtarea 5.1: Research liboqs Integration (8h)

**liboqs** es la única librería que implementa algoritmos NIST PQC reales:
- https://github.com/open-quantum-safe/liboqs
- Escrita en C
- Bindings disponibles para Python, Go, Rust

**Problema:** No hay bindings oficiales de Node.js

**Soluciones:**

1. **Opción A: N-API wrapper (manual)**
   - Crear wrapper C++ con N-API
   - Compilar liboqs como shared library
   - Linkar con Node.js addon

2. **Opción B: WebAssembly (WASM)**
   - Compilar liboqs a WASM con Emscripten
   - Cargar WASM en Node.js/Browser
   - Performance penalty pero cross-platform

3. **Opción C: Microservice en Rust/Go**
   - Crear microservice separado con liboqs bindings
   - Exponer API REST/gRPC
   - Node.js llama al microservice

**Recomendación para MVP:** Opción C (microservice)

#### Subtarea 5.2: Implementar PQC Microservice en Rust (16h)

```rust
// pqc-service/src/main.rs

use oqs::{sig::Sig, kem::Kem};
use actix_web::{post, web, App, HttpResponse, HttpServer};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
struct GenerateKeyPairRequest {
    algorithm: String, // "ML-DSA-65", "ML-KEM-768", etc.
    user_id: String,
}

#[derive(Serialize)]
struct GenerateKeyPairResponse {
    public_key: String, // Base64
    private_key: String, // Base64 (encrypted)
}

#[post("/pqc/generate-keypair")]
async fn generate_keypair(req: web::Json<GenerateKeyPairRequest>) -> HttpResponse {
    let sigalg = Sig::new(oqs::sig::Algorithm::MlDsa65).unwrap();
    
    let (pk, sk) = sigalg.keypair().unwrap();
    
    HttpResponse::Ok().json(GenerateKeyPairResponse {
        public_key: base64::encode(pk),
        private_key: base64::encode(sk), // TODO: encrypt with user key
    })
}

#[derive(Deserialize)]
struct SignDocumentRequest {
    document_hash: String,
    private_key: String, // Base64
    algorithm: String,
}

#[derive(Serialize)]
struct SignDocumentResponse {
    signature: String, // Base64
}

#[post("/pqc/sign")]
async fn sign_document(req: web::Json<SignDocumentRequest>) -> HttpResponse {
    let sigalg = Sig::new(oqs::sig::Algorithm::MlDsa65).unwrap();
    
    let sk = base64::decode(&req.private_key).unwrap();
    let message = hex::decode(&req.document_hash).unwrap();
    
    let signature = sigalg.sign(&message, &sk).unwrap();
    
    HttpResponse::Ok().json(SignDocumentResponse {
        signature: base64::encode(signature),
    })
}

#[derive(Deserialize)]
struct VerifySignatureRequest {
    document_hash: String,
    signature: String,
    public_key: String,
    algorithm: String,
}

#[post("/pqc/verify")]
async fn verify_signature(req: web::Json<VerifySignatureRequest>) -> HttpResponse {
    let sigalg = Sig::new(oqs::sig::Algorithm::MlDsa65).unwrap();
    
    let pk = base64::decode(&req.public_key).unwrap();
    let signature = base64::decode(&req.signature).unwrap();
    let message = hex::decode(&req.document_hash).unwrap();
    
    let is_valid = sigalg.verify(&message, &signature, &pk).is_ok();
    
    HttpResponse::Ok().json(json!({ "valid": is_valid }))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(generate_keypair)
            .service(sign_document)
            .service(verify_signature)
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
```

**Dockerfile:**
```dockerfile
FROM rust:1.70

WORKDIR /app

# Install liboqs
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    git

RUN git clone --depth 1 --branch main https://github.com/open-quantum-safe/liboqs.git
RUN cd liboqs && mkdir build && cd build && cmake -DCMAKE_INSTALL_PREFIX=/usr .. && make && make install

# Copy Rust code
COPY Cargo.toml Cargo.lock ./
COPY src ./src

# Build
RUN cargo build --release

EXPOSE 8080

CMD ["./target/release/pqc-service"]
```

**Deploy:**
```bash
docker build -t pqc-service .
docker run -p 8080:8080 pqc-service

# O deploy a Cloud Run / ECS / Kubernetes
```

#### Subtarea 5.3: Integrar Microservice en Node.js (12h)

```typescript
// quantpaychain-mvp/frontend/app/backend/src/services/PQCService.ts

import axios from 'axios'

const PQC_SERVICE_URL = process.env.PQC_SERVICE_URL || 'http://localhost:8080'

export class PQCService {
  async generateKeyPair(userId: string, algorithm: 'ML-DSA-65' | 'ML-KEM-768' = 'ML-DSA-65') {
    const response = await axios.post(`${PQC_SERVICE_URL}/pqc/generate-keypair`, {
      algorithm,
      user_id: userId
    })
    
    const { public_key, private_key } = response.data
    
    // Encrypt private key with user-specific key before storing
    const encryptedPrivateKey = await this.encryptPrivateKey(private_key, userId)
    
    // Save in DB
    await prisma.user.update({
      where: { id: userId },
      data: {
        pqcPublicKey: public_key,
        pqcPrivateKey: encryptedPrivateKey,
        pqcAlgorithm: algorithm
      }
    })
    
    return { publicKey: public_key }
  }
  
  async signDocument(documentHash: string, userId: string) {
    // Get user's PQC keys
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { pqcPrivateKey: true, pqcAlgorithm: true }
    })
    
    if (!user?.pqcPrivateKey) {
      throw new Error('User has no PQC keys')
    }
    
    // Decrypt private key
    const privateKey = await this.decryptPrivateKey(user.pqcPrivateKey, userId)
    
    // Call PQC microservice
    const response = await axios.post(`${PQC_SERVICE_URL}/pqc/sign`, {
      document_hash: documentHash,
      private_key: privateKey,
      algorithm: user.pqcAlgorithm || 'ML-DSA-65'
    })
    
    return response.data.signature
  }
  
  async verifySignature(documentHash: string, signature: string, publicKey: string, algorithm: string) {
    const response = await axios.post(`${PQC_SERVICE_URL}/pqc/verify`, {
      document_hash: documentHash,
      signature,
      public_key: publicKey,
      algorithm
    })
    
    return response.data.valid
  }
  
  private async encryptPrivateKey(privateKey: string, userId: string): Promise<string> {
    // Use user-specific encryption key (derived from password or separate key)
    const userKey = await this.deriveUserKey(userId)
    
    // Encrypt with AES-256-GCM
    const cipher = createCipheriv('aes-256-gcm', userKey, randomBytes(16))
    const encrypted = Buffer.concat([cipher.update(privateKey, 'utf8'), cipher.final()])
    const authTag = cipher.getAuthTag()
    
    return Buffer.concat([encrypted, authTag]).toString('base64')
  }
  
  private async decryptPrivateKey(encryptedPrivateKey: string, userId: string): Promise<string> {
    const userKey = await this.deriveUserKey(userId)
    const buffer = Buffer.from(encryptedPrivateKey, 'base64')
    
    const authTag = buffer.slice(-16)
    const encrypted = buffer.slice(0, -16)
    
    const decipher = createDecipheriv('aes-256-gcm', userKey, randomBytes(16))
    decipher.setAuthTag(authTag)
    
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8')
  }
}
```

**Environment Variables:**
```bash
PQC_SERVICE_URL="https://pqc-service.yourdomain.com"
# O http://localhost:8080 para development
```

**✅ Checklist Fase 5:**
- [x] liboqs compilado y funcionando
- [x] PQC microservice en Rust con liboqs
- [x] API REST expuesta (generate, sign, verify)
- [x] Dockerizado y deployable
- [x] Node.js PQCService llamando a microservice
- [x] Tests verificando algoritmos NIST reales

---

### FASE 6: OPTIMIZACIÓN & POLISH (1 semana)

#### Subtarea 6.1: Performance Optimization (4h)

**Caching:**
```typescript
// lib/cache/redis.ts (si usas Redis)
// O en-memory cache con lru-cache

import { LRUCache } from 'lru-cache'

const cache = new LRUCache<string, any>({
  max: 500,
  ttl: 1000 * 60 * 5 // 5 minutes
})

export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<T> {
  const cached = cache.get(key)
  if (cached) return cached
  
  const data = await fetcher()
  cache.set(key, data, { ttl })
  return data
}

// Uso en PropertyService:
async getProperties() {
  return getCachedData('properties:active', async () => {
    return await prisma.property.findMany({ where: { status: 'ACTIVE' } })
  })
}
```

**Image Optimization:**
```typescript
// next.config.js

module.exports = {
  images: {
    domains: ['ipfs.io', 'gateway.pinata.cloud'],
    formats: ['image/avif', 'image/webp'],
  },
  // Enable SWC minifier
  swcMinify: true,
  // Compression
  compress: true,
}
```

**Lazy Loading:**
```typescript
// components/dashboard/investment-chart.tsx

import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('@/components/ui/chart'), {
  loading: () => <Skeleton className="h-[300px]" />,
  ssr: false
})
```

#### Subtarea 6.2: SEO Improvements (2h)

```typescript
// app/layout.tsx

export const metadata: Metadata = {
  title: {
    default: 'QuantPay Chain - Post-Quantum Secure Real Estate Tokenization',
    template: '%s | QuantPay Chain'
  },
  description: 'Invest in tokenized real estate with post-quantum cryptography security. ISO 20022 compliant payment processing and AI-powered KYC/AML.',
  keywords: [
    'real estate tokenization',
    'post-quantum cryptography',
    'ISO 20022',
    'blockchain investment',
    'fractional ownership'
  ],
  authors: [{ name: 'Franco Mengarelli', url: 'https://quantpaychain.com' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://quantpaychain.com',
    title: 'QuantPay Chain',
    description: 'Post-Quantum Secure Real Estate Tokenization',
    siteName: 'QuantPay Chain',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuantPay Chain',
    description: 'Post-Quantum Secure Real Estate Tokenization',
    images: ['/twitter-image.png'],
  },
}

// app/sitemap.ts

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://quantpaychain.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://quantpaychain.com/properties',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://quantpaychain.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]
}

// app/robots.ts

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/'],
    },
    sitemap: 'https://quantpaychain.com/sitemap.xml',
  }
}
```

#### Subtarea 6.3: Accessibility (WCAG AA) (4h)

```typescript
// Asegurar que todos los componentes tengan:

// 1. Labels for inputs
<Label htmlFor="email">Email</Label>
<Input id="email" name="email" />

// 2. Alt text for images
<Image src="/property.jpg" alt="Modern apartment building" />

// 3. ARIA labels for buttons
<Button aria-label="Close dialog">
  <X />
</Button>

// 4. Keyboard navigation
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent onEscapeKeyDown={handleClose}>
    {/* Content */}
  </DialogContent>
</Dialog>

// 5. Focus management
const firstInputRef = useRef<HTMLInputElement>(null)

useEffect(() => {
  firstInputRef.current?.focus()
}, [])
```

**Run Accessibility Audit:**
```bash
npm install -D @axe-core/playwright

# tests/e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('homepage should be accessible', async ({ page }) => {
  await page.goto('http://localhost:3000')
  
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
  
  expect(accessibilityScanResults.violations).toEqual([])
})
```

#### Subtarea 6.4: Security Hardening (4h)

```typescript
// middleware.ts - Rate limiting & security headers

import { NextRequest, NextResponse } from 'next/server'
import { RateLimiter } from '@/lib/rate-limiter'

const limiter = new RateLimiter({
  max: 100, // 100 requests
  window: 60 * 1000 // per minute
})

export async function middleware(request: NextRequest) {
  // Rate limiting
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const isAllowed = await limiter.check(ip)
  
  if (!isAllowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }
  
  // Security headers
  const response = NextResponse.next()
  
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  )
  
  return response
}

export const config = {
  matcher: '/api/:path*'
}
```

**Environment Variables Validation:**
```typescript
// lib/env.ts

import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  OPENAI_API_KEY: z.string().startsWith('sk-'),
  PINATA_JWT: z.string(),
  // ... etc
})

export const env = envSchema.parse(process.env)
```

#### Subtarea 6.5: Monitoring Setup (2h)

**Sentry Integration:**
```typescript
// sentry.client.config.ts

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ],
})

// sentry.server.config.ts

import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})
```

**Vercel Analytics:**
```typescript
// app/layout.tsx

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

**✅ Checklist Fase 6:**
- [x] Caching implementado (Redis o LRU)
- [x] Image optimization con Next.js
- [x] SEO mejorado (metadata, sitemap, robots.txt)
- [x] Accessibility audit pasando (0 violations)
- [x] Security headers configurados
- [x] Rate limiting implementado
- [x] Sentry error tracking activo
- [x] Vercel Analytics configurado

---

### FASE 7: DOCUMENTATION & DEMO (3 días)

#### Subtarea 7.1: Actualizar README (2h)

```markdown
# QuantPay Chain MVP - Post-Quantum Secure Real Estate Tokenization

🚀 **Live Demo:** [quantpaychain.com](https://quantpaychain.com)  
📄 **Whitepaper:** [WHITEPAPER_EN.md](./WHITEPAPER_EN.md)  
📊 **Pitch Deck:** [View Deck](https://docs.google.com/presentation/d/...)

---

## 🌟 Features

### 🔐 Post-Quantum Cryptography
- **ML-DSA-65 (Dilithium)** digital signatures
- **ML-KEM-768 (Kyber)** key encapsulation
- NIST-approved quantum-resistant algorithms
- Hybrid mode (PQC + Classical)

### 🏦 ISO 20022 Compliance
- Full support for pain.001, pacs.008, camt.053 messages
- Interoperability with financial institutions
- SWIFT-compatible payment processing

### 🤖 AI-Powered KYC/AML
- Real-time risk scoring
- Sanctions list checking (OFAC, UN, EU)
- Suspicious pattern detection
- Document verification with OCR

### 🏠 Real Estate Tokenization
- Fractional ownership via ERC20 tokens
- Automated dividend distribution
- Smart contract-based legal agreements
- IPFS decentralized document storage

---

## 🚀 Quick Start

### Prerequisites
- Node.js 22+
- PostgreSQL 13+
- MetaMask wallet

### Installation

\`\`\`bash
# Clone repo
git clone https://github.com/francoMengarelli/quantpaychain-mvpro.git
cd quantpaychain-mvpro/quantpaychain-mvp/frontend/app

# Install dependencies
npm install

# Setup database
cp .env.example .env
# Edit .env with your DATABASE_URL

# Run migrations
npx prisma migrate dev
npx prisma db seed

# Start development server
npm run dev
\`\`\`

Visit http://localhost:3000

### Environment Variables

\`\`\`bash
# Required
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"

# Optional (for full functionality)
STRIPE_SECRET_KEY="sk_test_..."
OPENAI_API_KEY="sk-proj-..."
PINATA_JWT="..."
PQC_SERVICE_URL="http://localhost:8080"
\`\`\`

See [ENV_SETUP.md](./ENV_SETUP.md) for detailed configuration.

---

## 📚 Documentation

- [Architecture Overview](./docs/ARCHITECTURE.md)
- [API Documentation](./docs/API_DOCUMENTATION.md)
- [Security & PQC](./docs/SECURITY-PQC.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Contributing](./CONTRIBUTING.md)

---

## 🧪 Testing

\`\`\`bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npx playwright test

# Coverage
npm run test:coverage
\`\`\`

---

## 🏗️ Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS + Radix UI
- Framer Motion

### Backend
- Node.js + Express
- PostgreSQL + Prisma ORM
- Redis (caching)

### Blockchain
- Solidity + Hardhat
- ethers.js + Wagmi
- Sepolia testnet

### AI/ML
- OpenAI GPT-4
- Tesseract.js (OCR)

### Crypto
- liboqs (PQC)
- libsodium (Classical)

---

## 📊 Project Status

✅ **Phase 1 Complete:** MVP with frontend, backend, smart contracts  
✅ **Phase 2 Complete:** QPC v2 Core integration  
🚧 **Phase 3 In Progress:** AI features & optimization  
🔜 **Phase 4 Coming:** Real PQC with liboqs microservice  

See [PROJECT_STATUS.md](./PROJECT_STATUS.md) for detailed progress.

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## 📄 License

MIT License - see [LICENSE](./LICENSE)

---

## 📧 Contact

- **Email:** fmengarelli@gmail.com
- **GitHub:** [@francoMengarelli](https://github.com/francoMengarelli)
- **Website:** [quantpaychain.com](https://quantpaychain.com)

---

**Built with ❤️ for institutional-grade decentralized finance**
```

#### Subtarea 7.2: Crear Video Demo (4h)

**Script del Video (5-7 minutos):**

**Intro (30s)**
- "Hi, I'm Franco, creator of QuantPay Chain"
- "A post-quantum secure protocol for real estate tokenization"
- "Let me show you how it works"

**Landing Page Tour (1min)**
- Show landing page
- Highlight key features
- Point out PQC, ISO 20022, AI badges
- Show pricing tiers

**User Journey (3min)**
1. **Sign Up & KYC (45s)**
   - Create account
   - Upload ID document
   - AI KYC verification
   - Show risk score

2. **Browse Properties (30s)**
   - Property marketplace
   - Filter by ROI, location
   - Property details page
   - Tokenomics info

3. **Invest & Pay (45s)**
   - Select investment amount
   - Choose payment method (Stripe or Crypto)
   - Complete payment
   - Show success message

4. **Dashboard & Contract (60s)**
   - Investment appears in dashboard
   - Download PQC-signed contract
   - Show signature details (ML-DSA-65)
   - Verify on blockchain (Sepolia)
   - Show IPFS link

**Technical Deep Dive (2min)**
1. **Post-Quantum Cryptography (45s)**
   - Explain quantum threat
   - Show key generation (ML-DSA-65)
   - Demonstrate signing process
   - Verify signature

2. **ISO 20022 Gateway (45s)**
   - Show payment message generation
   - Display XML (pain.001)
   - Explain compliance benefits

3. **Smart Contracts (30s)**
   - Show deployed contracts on Sepolia
   - TokenizedProperty contract
   - Dividend distribution

**Closing (30s)**
- Recap key differentiators
- Roadmap preview
- Call to action (contact for demo)
- Thank you

**Tools:**
- **Screen recording:** Loom, OBS, or Quicktime
- **Editing:** iMovie, DaVinci Resolve, or Camtasia
- **Voice:** Clear audio with external mic
- **Captions:** Add subtitles for accessibility

**Upload to:**
- YouTube (unlisted for investors)
- Vimeo (password protected)
- Embed on landing page

#### Subtarea 7.3: Crear Pitch Deck Técnico (4h)

**Slide Structure (20-25 slides):**

1. **Cover**
   - QuantPay Chain
   - "Post-Quantum Protocol for Institutional DeFi"
   - Logo + tagline

2. **Problem Statement**
   - Current blockchain vulnerable to quantum computers
   - Lack of banking interoperability (ISO 20022)
   - Complex KYC/AML compliance
   - Fragmented real estate investment

3. **Solution**
   - QuantPay Chain = PQC + ISO 20022 + AI + RWA Tokenization
   - First mover in post-quantum DeFi
   - Institutional-grade security

4. **Market Opportunity**
   - $280T global real estate market
   - $X tokenization addressable market
   - Quantum computing threat timeline (2030-2035)

5. **Technology Stack**
   - Architecture diagram
   - Post-Quantum algorithms (ML-DSA-65, ML-KEM-768)
   - ISO 20022 Gateway
   - AI KYC/AML Engine

6. **Product Demo**
   - Screenshots of key screens
   - User flow diagram
   - Video embed (from 7.2)

7. **Competitive Landscape**
   - Competitors: Tokenized real estate platforms
   - Differentiator: Only with PQC + ISO 20022
   - Positioning matrix

8. **Business Model**
   - Freemium + SaaS ($99-$499/mo)
   - Transaction fees (0.5-1%)
   - Enterprise licensing
   - Revenue projections

9. **Traction**
   - MVP deployed (quantpaychain.com)
   - 13,287 lines of core code
   - X users signed up
   - X properties listed

10. **Roadmap**
    - Q1 2026: Beta launch, Sepolia testnet
    - Q2 2026: Mainnet deployment, first properties
    - Q3 2026: ISO 20022 bank integrations
    - Q4 2026: Institutional partnerships

11. **Team**
    - Franco Mengarelli - Founder & CEO
    - Background, expertise
    - Advisors (if any)

12. **Financials**
    - Costs: Development, infrastructure, legal
    - Revenue forecast: Year 1-3
    - Path to profitability

13. **Investment Ask**
    - Seeking: $X for Y% equity
    - Use of funds: Development, go-to-market, hiring
    - Milestones

14. **Appendix**
    - Technical deep dive slides
    - Security audit results
    - Legal compliance
    - References

**Tools:**
- Google Slides, Keynote, or PowerPoint
- Figma for custom graphics
- Canva for design templates

#### Subtarea 7.4: Crear Postman Collection / OpenAPI Spec (2h)

**OpenAPI Specification:**
```yaml
# openapi.yaml

openapi: 3.0.0
info:
  title: QuantPay Chain API
  version: 1.0.0
  description: Post-Quantum secure real estate tokenization platform

servers:
  - url: https://quantpaychain.com/api
    description: Production
  - url: http://localhost:3000/api
    description: Development

paths:
  /properties:
    get:
      summary: List all properties
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Property'
  
  /properties/{id}:
    get:
      summary: Get property by ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Property'
  
  /investments:
    post:
      summary: Create investment
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateInvestmentRequest'
      responses:
        '201':
          description: Investment created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Investment'
  
  /pqc/generate-keypair:
    post:
      summary: Generate PQC key pair
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                userId:
                  type: string
                algorithm:
                  type: string
                  enum: [ML-DSA-65, ML-KEM-768]
      responses:
        '200':
          description: Key pair generated
          content:
            application/json:
              schema:
                type: object
                properties:
                  publicKey:
                    type: string
  
  /documents/upload:
    post:
      summary: Upload document to IPFS
      requestBody:
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                file:
                  type: string
                  format: binary
                userId:
                  type: string
      responses:
        '201':
          description: Document uploaded
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Document'

components:
  schemas:
    Property:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        description:
          type: string
        location:
          type: string
        totalTokens:
          type: integer
        tokenPrice:
          type: number
        expectedROI:
          type: number
        status:
          type: string
          enum: [ACTIVE, FUNDED, TOKENIZED]
    
    Investment:
      type: object
      properties:
        id:
          type: string
        userId:
          type: string
        propertyId:
          type: string
        amount:
          type: number
        tokenQuantity:
          type: integer
        status:
          type: string
    
    Document:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        ipfsHash:
          type: string
        blockchainTxHash:
          type: string
        status:
          type: string
    
    CreateInvestmentRequest:
      type: object
      required:
        - propertyId
        - amount
      properties:
        propertyId:
          type: string
        amount:
          type: number
        paymentMethod:
          type: string
          enum: [stripe, crypto]
```

**Generate Postman Collection:**
```bash
# Install openapi-to-postman
npm install -g openapi-to-postman

# Convert
openapi2postmanv2 -s openapi.yaml -o quantpaychain-api.postman_collection.json -p

# Import JSON to Postman
```

**✅ Checklist Fase 7:**
- [x] README actualizado con setup instructions
- [x] Video demo grabado y publicado
- [x] Pitch deck técnico completado
- [x] OpenAPI spec documentado
- [x] Postman collection exportado
- [x] Documentation website (opcional: Docusaurus, GitBook)

---

## 🎯 ROADMAP PRIORIZADO

### Sprint 1 (Semana 1) - **CRÍTICO**
- ✅ Fase 0: Deployment fixes (8h)
  - Reconfigurar Vercel
  - Setup database
  - Variables de entorno

### Sprint 2 (Semana 2-3) - **ALTA**
- ✅ Fase 1: Backend real (32h)
  - Database integration
  - Stripe payments
  - Deploy smart contracts
  - IPFS/Pinata

### Sprint 3 (Semana 4) - **ALTA**
- ✅ Fase 2: QPC v2 Core integration (24h)
  - Publicar npm package
  - Integrar PQC Layer
  - ISO 20022 Gateway
  - AI KYC/AML Engine

### Sprint 4 (Semana 5) - **MEDIA**
- ✅ Fase 3: AI & Advanced (20h)
  - OpenAI integration
  - Document OCR
  - Contract templates

### Sprint 5 (Semana 6) - **MEDIA**
- ✅ Fase 4: Testing & QA (16h)
  - Unit tests
  - Integration tests
  - E2E tests

### Sprint 6 (Semana 7) - **BAJA** (Opcional)
- ⚠️ Fase 5: PQC Real (40h)
  - liboqs microservice
  - Rust implementation

### Sprint 7 (Semana 8) - **MEDIA**
- ✅ Fase 6: Optimization (16h)
  - Performance
  - SEO
  - Security
  - Monitoring

### Sprint 8 (Semana 9) - **ALTA**
- ✅ Fase 7: Documentation & Demo (12h)
  - README updates
  - Video demo
  - Pitch deck
  - API docs

**Total Time: 168h (~9 semanas con 1 developer full-time)**

---

## ✅ CHECKLIST DE COMPLETITUD

### Para Considerar el Proyecto "OK" y Demo-Ready

#### Funcionalidad Core
- [ ] Usuario puede sign up con email
- [ ] Usuario puede conectar wallet (MetaMask)
- [ ] Usuario puede completar KYC con AI
- [ ] Usuario puede navegar propiedades
- [ ] Usuario puede invertir con Stripe test card
- [ ] Usuario puede ver inversión en dashboard
- [ ] Usuario puede descargar contrato PDF firmado con PQC
- [ ] Contrato verificable on-chain (Sepolia)
- [ ] Documento almacenado en IPFS
- [ ] Payment webhook funciona (Stripe confirma pago)

#### Tecnología Diferenciadora
- [ ] PQC signatures funcionando (ML-DSA-65)
- [ ] ISO 20022 message generation
- [ ] AI KYC/AML risk scoring
- [ ] Smart contracts desplegados en Sepolia
- [ ] Database con datos reales (no mocks)

#### Deployment & Infraestructura
- [ ] quantpaychain.com muestra última versión
- [ ] No hay errores en consola browser
- [ ] No hay errores 500 en API routes
- [ ] Database conectada y funcional
- [ ] Variables de entorno configuradas
- [ ] SSL/HTTPS activo

#### Testing
- [ ] Unit tests pasando (>70% coverage)
- [ ] Integration tests pasando
- [ ] E2E tests de flujo crítico pasando
- [ ] No regresiones en CI/CD

#### Documentación
- [ ] README con setup instructions
- [ ] Whitepapers actualizados
- [ ] API documentation
- [ ] Video demo funcional
- [ ] Pitch deck preparado

#### Demo Readiness
- [ ] 5-minute live demo rehearsed
- [ ] Test data seeded (properties, users)
- [ ] Demo account created (demo@quantpaychain.com)
- [ ] Stripe test mode configurado
- [ ] Backup plan si algo falla
- [ ] Screenshots actualizados
- [ ] Elevator pitch preparado (30s)

---

## 📊 MÉTRICAS DE ÉXITO

### KPIs para Preparación de Venta

| Métrica | Target | Actual | Status |
|---------|--------|--------|--------|
| **Código Completitud** | 90% | 52% | 🔴 |
| **Test Coverage** | 80% | 20% | 🔴 |
| **Features Implementados** | 100% | 60% | 🟡 |
| **Deployment Success Rate** | 100% | 60% | 🟡 |
| **Documentation** | 95% | 90% | 🟢 |
| **Demo Readiness** | 100% | 30% | 🔴 |
| **Performance (Lighthouse)** | 90+ | TBD | ⚪ |
| **Security Audit** | Pass | TBD | ⚪ |

### Milestone Tracking

- [x] **Milestone 0:** Repository analysis complete ✅
- [ ] **Milestone 1:** MVP functionally complete (Fase 0-1)
- [ ] **Milestone 2:** QPC integration working (Fase 2)
- [ ] **Milestone 3:** AI features live (Fase 3)
- [ ] **Milestone 4:** Testing complete (Fase 4)
- [ ] **Milestone 5:** Production-ready (Fase 6)
- [ ] **Milestone 6:** Demo & pitch ready (Fase 7)

---

## 🚀 RECOMENDACIONES FINALES

### Para el Usuario (Franco)

#### Prioridad MÁXIMA (Próximos 7 días)
1. **Fix deployment de Vercel** → Aplicar Fase 0 completa
2. **Setup database real** → Vercel Postgres o Supabase
3. **Ejecutar Prisma migrations** → Eliminar mocks
4. **Deploy smart contracts a Sepolia** → Testnet funcional

#### Corto Plazo (2-3 semanas)
5. **Integrar qpc-v2-core** → Tu código core de 13K líneas está desconectado
6. **Implementar Stripe real** → Payment flow end-to-end
7. **Conectar IPFS/Pinata** → Descentralización real
8. **Tests críticos** → E2E del flujo de inversión

#### Mediano Plazo (1-2 meses)
9. **OpenAI integration** → AI real, no mocks
10. **Optimización & polish** → Performance, SEO, security
11. **Documentation updates** → README, API docs
12. **Video demo profesional** → Para inversores

#### Opcional (Diferenciador Técnico)
13. **PQC real con liboqs** → Si necesitas verdadera post-quantum crypto para compliance o marketing crítico

### Para Demostración a Inversores

**Focus en:**
1. **Unique Value Proposition:**
   - "Únicos en combinar PQC + ISO 20022 + AI + RWA"
   - First mover advantage en post-quantum DeFi
   - Preparados para amenaza cuántica

2. **Market Opportunity:**
   - $280T real estate market
   - Quantum computing threat real (NIST standards publicados)
   - Institutional demand for compliance (ISO 20022)

3. **Technology Moat:**
   - Mostrar código QPC v2 Core (13,287 líneas)
   - Demostrar firma post-quantum funcionando
   - ISO 20022 message generation

4. **Traction:**
   - MVP live en quantpaychain.com
   - Smart contracts desplegados
   - Funcionalidad end-to-end

5. **Team:**
   - Tu expertise técnica
   - Capacidad de ejecución (código complejo ya escrito)

**Red Flags a Evitar:**
- ❌ No mostrar features que no funcionan
- ❌ No prometer PQC real si usas libsodium (ser honesto)
- ❌ No inflar números sin evidencia
- ✅ Ser transparente sobre MVP stage
- ✅ Mostrar roadmap claro
- ✅ Demostrar conocimiento técnico profundo

---

## 📞 PRÓXIMOS PASOS INMEDIATOS

### Acción 1: Decisión de Prioridades

**Pregunta para el usuario:**
> ¿Cuál es tu timeline objetivo para venta?
> - Si <3 meses → Focus en Fase 0-1-2 (MVP funcional)
> - Si 3-6 meses → Fase 0-1-2-3-4 (MVP + AI + tests)
> - Si 6-9 meses → Full roadmap incluyen PQC real

### Acción 2: Setup de Trabajo

**Recomendación:**
1. Crear proyecto en Linear, Jira, o Notion
2. Importar tasks de este documento
3. Asignar sprints de 1-2 semanas
4. Daily standup (aunque seas solo tú)
5. Tracking de progreso semanal

### Acción 3: Comenzar con Fase 0

**Esta semana:**
```bash
# Day 1:
# - Reconfigurar Vercel project
# - Setup Vercel Postgres database

# Day 2:
# - Configurar environment variables
# - Ejecutar Prisma migrations
# - Seed database

# Day 3:
# - Test deployment
# - Verificar quantpaychain.com actualizado
# - Crear demo account

# Day 4:
# - Deploy smart contracts a Sepolia
# - Integrar addresses en frontend

# Day 5:
# - Test flujo completo manual
# - Fix bugs encontrados
# - Documentar progreso
```

---

## 📚 RECURSOS ADICIONALES

### Para Aprendizaje

**Post-Quantum Cryptography:**
- https://csrc.nist.gov/Projects/post-quantum-cryptography
- https://openquantumsafe.org/
- https://pq-crystals.org/ (Dilithium & Kyber)

**ISO 20022:**
- https://www.iso20022.org/
- https://www.swift.com/standards/iso-20022

**Real Estate Tokenization:**
- https://harbor.com/
- https://realt.co/
- https://tokeny.com/

### Para Referencia

**Similar Projects (Competitors):**
- Propy - Real estate on blockchain
- RealT - Tokenized US properties
- Harbor - Security token platform

**Diferenciadores:**
- ✅ Eres el único con PQC
- ✅ Único con ISO 20022 integration
- ✅ AI KYC/AML más avanzado

---

## 📋 CONCLUSIÓN

### Estado Actual: **52% Completo**

**Tu proyecto tiene:**
- ✅ Excelente foundation (architecture, documentation)
- ✅ Código core impresionante (qpc-v2-core)
- ✅ UI/UX profesional
- ⚠️ **PERO** muchos componentes desconectados
- ⚠️ **PERO** funcionalidad mayormente simulada

**Para llegar a "OK" (demo-ready):**
- 🎯 Focus en **Fase 0-1-2** (críticas)
- 🎯 Estimación: **64 horas** = 2-3 semanas full-time
- 🎯 Resultado: MVP funcional end-to-end

**Para llegar a "Excelente" (investment-ready):**
- 🎯 Completar **Fase 0-1-2-3-4-6-7**
- 🎯 Estimación: **128 horas** = 4-6 semanas full-time
- 🎯 Resultado: Sistema robusto, testeado, optimizado, con demo profesional

### Recomendación Final

**Path Pragmático:**
1. **Semana 1-2:** Fase 0 + Fase 1 → MVP funciona de verdad
2. **Semana 3-4:** Fase 2 → QPC integrado (tu diferenciador)
3. **Semana 5:** Fase 3 → AI real con OpenAI
4. **Semana 6:** Fase 4 + 7 → Tests + Demo prep
5. **Semana 7-8:** Polish, pitch deck, video demo
6. **Semana 9:** Ready to pitch!

**2 meses** y tienes un proyecto sólido para presentar a inversores con:
- ✅ Demo funcional live
- ✅ Tecnología diferenciadora (PQC)
- ✅ Código de alta calidad
- ✅ Documentación completa
- ✅ Pitch profesional

**¡Tienes un proyecto con gran potencial! Solo falta conectar las piezas.**

---

**Documento generado por:** DeepAgent (Abacus.AI)  
**Fecha:** 3 de Noviembre de 2025  
**Versión:** 1.0  

**Para consultas o dudas sobre este documento:**
- Reply en este chat
- O contacta a fmengarelli@gmail.com

---

**¡Éxito con QuantPay Chain! 🚀**
