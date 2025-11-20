# 🎯 Plan de Migración - QuantPayChain Core & Features

## 📋 Estado Actual

### ✅ Completado en Nuevo Repo
- Frontend Next.js deployado en Vercel
- Estructura básica de páginas (Dashboard, Marketplace, Docs, Reports, Create Asset)
- Integración con Supabase (PostgreSQL)
- Componentes UI básicos (Shadcn UI)
- Tema violeta/púrpura implementado

### ❌ Faltante (Del Repo Anterior)
1. **qpc-v2-core** - Core NPM package con 3 módulos críticos
2. **Web3/Wallet Integration** - RainbowKit + Wagmi
3. **Documentos Técnicos** - Sistema de descarga/upload
4. **Panel funcional** - Error actual en dashboard

---

## 🔧 Componentes Críticos a Migrar

### 1. **qpc-v2-core** (Prioridad MÁXIMA)
**Ubicación Original**: `/qpc-v2-core/`

**Módulos del Core**:
- ✅ **ISO 20022 Gateway** - Procesamiento de mensajes financieros estándar
- ✅ **PQC Layer** - Criptografía post-cuántica (Kyber + Dilithium)
- ✅ **AI KYC/AML Engine** - Motor de compliance regulatorio con IA

**Estructura del Core**:
```
qpc-v2-core/
├── core/
│   ├── ai-kyc-aml/        # Motor KYC/AML con IA
│   ├── iso20022-gateway/  # Gateway ISO 20022
│   ├── pqc-layer/         # Capa PQC
│   └── index.ts           # Exportaciones principales
├── types/                  # TypeScript types
├── tests/                  # Unit & Integration tests
└── package.json
```

**Plan de Integración**:
1. Copiar el core completo al nuevo repo como package
2. Configurar como monorepo package (`packages/qpc-core`)
3. Instalar dependencias necesarias
4. Actualizar imports en el frontend

---

### 2. **Web3 / Wallet Integration** (Prioridad ALTA)
**Componentes a migrar**:
- `lib/wagmi-config.ts` - Configuración de Wagmi
- `lib/web3-config.ts` - Configuración Web3
- `lib/blockchain.ts` - Utilidades blockchain

**Dependencias necesarias**:
```json
{
  "@rainbow-me/rainbowkit": "^2.x",
  "wagmi": "^2.x",
  "viem": "^2.x",
  "ethers": "^6.x"
}
```

**Funcionalidades**:
- Conexión de billetera (MetaMask, WalletConnect, etc.)
- Interacción con smart contracts
- Firma de transacciones
- Gestión de cuentas Web3

---

### 3. **Sistema de Documentos Técnicos** (Prioridad ALTA)
**Componentes a migrar**:
- `components/dashboard/document-upload.tsx`
- `components/dashboard/document-list.tsx`
- `app/api/documents/` - API routes

**Storage Providers**:
- AWS S3 (`lib/s3.ts`)
- IPFS (`lib/ipfs.ts`)
- Pinata (`lib/pinata.ts`)

**Funcionalidades**:
- Upload de documentos técnicos (PDF, DOCX)
- Descarga de whitepapers
- Gestión de documentos encriptados (PQC)
- Registro en blockchain

---

### 4. **Wrappers QPC & Custom Hooks** (Prioridad ALTA)
**Wrappers** (`lib/qpc-wrappers/`):
- `pqc.ts` - Wrapper para PQC Layer
- `iso20022.ts` - Wrapper para ISO 20022
- `kyc-aml.ts` - Wrapper para KYC/AML

**Custom Hooks** (`hooks/qpc/`):
- `usePQC.ts` - Hook para operaciones PQC
- `useISO20022.ts` - Hook para mensajes ISO
- `useKYCAML.ts` - Hook para verificaciones KYC/AML

---

### 5. **Smart Contracts** (Prioridad MEDIA)
**Contratos a migrar**:
- `DocumentRegistry.sol` - Registro de documentos en blockchain
- `PermissionedToken.sol` - ERC20 con permisos para RWA
- `Dividends.sol` - Distribución de dividendos

**Deployment**:
- Scripts de deployment
- Configuración de redes (Sepolia, Polygon, Mainnet)

---

### 6. **Backend Services** (Prioridad MEDIA)
**Services a migrar**:
- `PQCService.ts` - Servicio de criptografía
- `PaymentService.ts` - Integración con Stripe/Crypto
- `ContractService.ts` - Gestión de contratos digitales
- `InvestmentService.ts` - Gestión de inversiones
- `PropertyService.ts` - Gestión de propiedades

---

## 🔄 Orden de Implementación

### **Fase 1: Core Critical** (Hoy - Día 1)
1. ✅ Migrar `qpc-v2-core` como package
2. ✅ Configurar Web3/Wallet (RainbowKit + Wagmi)
3. ✅ Implementar wrappers QPC básicos
4. ✅ Arreglar panel (dashboard error)

### **Fase 2: Documentos & Storage** (Día 2)
1. Sistema de upload/download de documentos
2. Integración con S3/IPFS/Pinata
3. Página de documentos técnicos funcional
4. Whitepapers descargables

### **Fase 3: Smart Contracts & Blockchain** (Día 3)
1. Desplegar smart contracts
2. Integración de Document Registry
3. Sistema de tokenización (PermissionedToken)
4. Gestión de dividendos

### **Fase 4: Services Backend** (Día 4)
1. Implementar backend services
2. APIs para PQC, ISO20022, KYC/AML
3. Integración con Stripe
4. Sistema de pagos crypto

### **Fase 5: Testing & Refinamiento** (Día 5)
1. Testing end-to-end
2. Corrección de bugs
3. Optimizaciones de performance
4. Documentación completa

---

## 📦 Modelo de Licencia del Core

### **Para Venta como Licencia Perpetua Compartida**:

**Componentes a Empaquetar**:
1. `@quantpaychain/qpc-core` - NPM package
2. Documentación completa de API
3. Ejemplos de integración
4. Tests unitarios e integración

**Estructura del Package**:
```
@quantpaychain/qpc-core@2.0.0
├── /dist              # Código compilado
├── /docs              # Documentación completa
├── /examples          # Ejemplos de uso
├── /types             # TypeScript definitions
├── README.md          # Guía de instalación
└── LICENSE            # Licencia perpetua compartida
```

**Pricing Model** (Del PDF):
- **Perpetual License**: $50,000 - $200,000 (one-time)
- **Annual License**: $20,000 - $80,000/year
- **Revenue Share**: 5-10% of revenue

---

## 🚀 Próximos Pasos Inmediatos

1. ⏳ **Copiar qpc-v2-core** al nuevo repo
2. ⏳ **Instalar dependencias Web3**
3. ⏳ **Configurar RainbowKit**
4. ⏳ **Arreglar error del dashboard**
5. ⏳ **Implementar sistema de documentos**

---

## ⚠️ Issues Identificados

### **Dashboard Crash**
**Error**: "Error de la aplicación: se ha producido una excepción en el lado del cliente"
**Causa probable**: 
- Falta integración Web3 (wallet)
- Estado no inicializado correctamente
- Supabase queries sin manejo de errores

**Solución**:
- Revisar console logs del navegador
- Agregar error boundaries
- Verificar queries de Supabase

### **Documentos No Descargables**
**Causa**: Sistema de storage no implementado
**Solución**: Implementar S3/IPFS integration

---

**Inicio de Implementación**: AHORA ⏰
