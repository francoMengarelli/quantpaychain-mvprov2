# Integración del Núcleo QPC v2

**Fecha:** 4 de noviembre de 2025  
**Proyecto:** QuantPay Stack (quantpaychain-mvpro)  
**Versión:** 2.0.0

---

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Arquitectura del Núcleo](#arquitectura-del-núcleo)
3. [Componentes Principales](#componentes-principales)
4. [Instalación y Configuración](#instalación-y-configuración)
5. [API Endpoints](#api-endpoints)
6. [Hooks de React](#hooks-de-react)
7. [Componentes UI](#componentes-ui)
8. [Ejemplos de Uso](#ejemplos-de-uso)
9. [Seguridad](#seguridad)
10. [Troubleshooting](#troubleshooting)

---

## Descripción General

El **núcleo QPC v2** (QuantPay Chain v2 Core) es el sistema central que integra tres componentes fundamentales para operaciones financieras seguras y conformes:

- **ISO 20022 Gateway:** Procesamiento y transformación de mensajes financieros estándar
- **Post-Quantum Cryptography (PQC) Layer:** Criptografía resistente a computación cuántica
- **AI KYC/AML Engine:** Motor de inteligencia artificial para verificación de identidad y prevención de lavado de dinero

### ✨ Características Principales

- ✅ **Procesamiento ISO 20022:** Parse, validación y transformación de mensajes financieros
- ✅ **Encriptación Post-Cuántica:** Algoritmos Kyber (encriptación) y Dilithium (firmas digitales)
- ✅ **Verificación KYC automatizada:** Scoring de riesgo, verificación de documentos con OCR
- ✅ **Detección de fraude con IA:** Análisis de patrones y comportamiento anómalo
- ✅ **Listas de sanciones:** Verificación contra OFAC, UN, EU, INTERPOL
- ✅ **Análisis AML:** Detección de estructuración, lavado de dinero y transacciones sospechosas

---

## Arquitectura del Núcleo

```
quantpaychain-mvpro/
├── quantpaychain-mvp/
│   └── frontend/
│       └── app/
│           ├── backend/
│           │   └── src/
│           │       └── qpc-v2-core/          ← NÚCLEO QPC v2
│           │           ├── index.ts
│           │           ├── types.ts
│           │           ├── utils.ts
│           │           ├── iso20022-gateway/
│           │           │   └── src/
│           │           │       ├── index.ts
│           │           │       ├── types.ts
│           │           │       ├── parser.ts
│           │           │       ├── validator.ts
│           │           │       └── transformer.ts
│           │           ├── pqc-layer/
│           │           │   └── src/
│           │           │       ├── index.ts
│           │           │       ├── types.ts
│           │           │       ├── key-manager.ts
│           │           │       ├── encryption.ts
│           │           │       └── signature.ts
│           │           └── ai-kyc-aml/
│           │               └── src/
│           │                   ├── index.ts
│           │                   ├── types.ts
│           │                   ├── risk-scoring.ts
│           │                   ├── document-verification.ts
│           │                   ├── sanctions-check.ts
│           │                   └── fraud-detection.ts
│           ├── app/
│           │   ├── api/
│           │   │   └── qpc/                  ← API ROUTES
│           │   │       ├── iso20022/
│           │   │       │   ├── parse/
│           │   │       │   ├── transform/
│           │   │       │   └── create/
│           │   │       ├── pqc/
│           │   │       │   ├── generate-keys/
│           │   │       │   ├── encrypt/
│           │   │       │   ├── decrypt/
│           │   │       │   ├── sign/
│           │   │       │   └── verify/
│           │   │       └── kyc-aml/
│           │   │           ├── verify-customer/
│           │   │           ├── verify-document/
│           │   │           ├── analyze-transaction/
│           │   │           └── check-sanctions/
│           │   └── qpc-demo/
│           │       └── page.tsx              ← PÁGINA DEMO
│           ├── hooks/
│           │   ├── useQPCCore.ts             ← HOOK PRINCIPAL
│           │   └── qpc/
│           │       ├── useISO20022.ts
│           │       ├── usePQC.ts
│           │       └── useKYCAML.ts
│           └── components/
│               └── qpc/                      ← COMPONENTES UI
│                   ├── ISO20022Parser.tsx
│                   ├── PQCEncryption.tsx
│                   ├── KYCVerification.tsx
│                   └── QPCDashboard.tsx
```

---

## Componentes Principales

### 1. ISO 20022 Gateway

**Ubicación:** `backend/src/qpc-v2-core/iso20022-gateway/`

Procesamiento de mensajes financieros estándar ISO 20022.

#### Mensajes Soportados

- `pain.001` - Customer Credit Transfer Initiation
- `pain.002` - Customer Payment Status Report
- `pacs.008` - FI To FI Customer Credit Transfer
- `pacs.009` - Financial Institution Credit Transfer
- `camt.053` - Bank To Customer Statement
- `camt.054` - Bank To Customer Debit Credit Notification

#### Funciones Principales

```typescript
// Parser
parseISO20022Message(xml: string): Promise<ISO20022Message>
createPain001Message(data: any): string

// Validator
validateISO20022Message(message: ISO20022Message): Promise<ValidationResult>
validateAgainstSchema(xml: string, schemaPath: string): Promise<ValidationResult>

// Transformer
transformToBlockchain(message: ISO20022Message): Promise<TransformationResult>
transformFromBlockchain(transaction: BlockchainTransaction): Promise<ISO20022Message>
```

---

### 2. Post-Quantum Cryptography Layer

**Ubicación:** `backend/src/qpc-v2-core/pqc-layer/`

Criptografía resistente a computación cuántica usando algoritmos del NIST.

#### Algoritmos Soportados

**Encriptación:**
- `kyber512` - NIST Level 1
- `kyber768` - NIST Level 3 (por defecto)
- `kyber1024` - NIST Level 5

**Firmas Digitales:**
- `dilithium2` - NIST Level 2
- `dilithium3` - NIST Level 3 (por defecto)
- `dilithium5` - NIST Level 5

#### Funciones Principales

```typescript
// Key Manager
generatePQCKeyPair(algorithm?: PQCAlgorithm): Promise<PQCKeyPair>
generateHybridKeyPair(pqcAlgorithm?, classicalAlgorithm?): Promise<HybridKeyPair>
rotateKeyPair(oldKeyPair: PQCKeyPair): Promise<{newKeyPair, oldKeyPair}>

// Encryption
encryptPQC(data: string | Buffer, publicKey: string, algorithm?): Promise<EncryptedData>
decryptPQC(encryptedData: EncryptedData, privateKey: string): Promise<Buffer>

// Signature
signPQC(data: string | Buffer, privateKey: string, algorithm?): Promise<PQCSignature>
verifyPQC(data: string | Buffer, signature: PQCSignature, publicKey: string): Promise<SignatureVerificationResult>
signTransaction(transaction: any, privateKey: string): Promise<string>
verifyTransaction(transaction: any, signature: string, publicKey: string): Promise<boolean>
```

---

### 3. AI KYC/AML Engine

**Ubicación:** `backend/src/qpc-v2-core/ai-kyc-aml/`

Motor de inteligencia artificial para verificación de identidad y prevención de lavado de dinero.

#### Funciones Principales

```typescript
// Risk Scoring
calculateRiskScore(customer: Customer): Promise<number>
determineRiskLevel(score: number): RiskLevel
performKYCVerification(customer: Customer): Promise<KYCResult>
analyzeTransactionAML(transaction: AMLTransaction, history?): Promise<AMLAnalysisResult>

// Document Verification
verifyDocument(documentImage: Buffer | string, documentType): Promise<DocumentVerification>
detectDocumentForgery(documentImage: Buffer | string): Promise<{isForgery, confidence, indicators}>

// Sanctions Check
checkSanctions(customer: Customer): Promise<SanctionsCheckResult>
checkHighRiskJurisdiction(country: string): Promise<{isHighRisk, riskLevel, lists}>
checkPEP(customer: Customer): Promise<{isPEP, pepType?, position?}>

// Fraud Detection
detectFraud(customer: Customer, transactions?): Promise<FraudDetectionResult>
detectAnomalies(customer: Customer, transactions): Promise<{hasAnomalies, anomalies}>
```

---

## Instalación y Configuración

### Requisitos Previos

- Node.js 20+ LTS
- Next.js 14
- TypeScript 5.x

### Instalación

El núcleo ya está integrado en el proyecto. No se requiere instalación adicional.

### Configuración

El núcleo QPC v2 está configurado para funcionar inmediatamente. Para personalizar:

```typescript
// backend/src/qpc-v2-core/config.ts (crear si necesario)
export const qpcConfig: QPCConfig = {
  environment: 'development',
  iso20022: {
    version: '2022',
    validateSchemas: true,
    supportedMessageTypes: ['pain.001', 'pacs.008'],
  },
  pqc: {
    algorithm: 'kyber768',
    keySize: 1184,
    enableHybridMode: false,
  },
  aiKycAml: {
    riskThreshold: 70,
    enableDocumentOCR: true,
    enableSanctionsCheck: true,
  },
};
```

---

## API Endpoints

Todos los endpoints están disponibles bajo `/api/qpc/`.

### ISO 20022 Endpoints

#### Parse Message
```
POST /api/qpc/iso20022/parse
```

**Request:**
```json
{
  "xml": "<Document>...</Document>"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": {
      "messageType": "pain.001",
      "messageId": "MSG-001",
      "creationDateTime": "2025-11-04T10:00:00Z",
      ...
    },
    "validation": {
      "valid": true
    }
  }
}
```

#### Transform to Blockchain
```
POST /api/qpc/iso20022/transform
```

**Request:**
```json
{
  "xml": "<Document>...</Document>"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "blockchainData": {
      "transactions": [...]
    },
    "metadata": {
      "messageType": "pain.001",
      "totalAmount": 1000.00,
      "currency": "USD"
    }
  }
}
```

#### Create Message
```
POST /api/qpc/iso20022/create
```

**Request:**
```json
{
  "messageType": "pain.001",
  "data": {
    "numberOfTransactions": 1,
    "controlSum": 1000.00,
    "initiatingParty": {
      "name": "Company ABC"
    },
    "paymentInformation": [...]
  }
}
```

---

### PQC Endpoints

#### Generate Keys
```
POST /api/qpc/pqc/generate-keys
```

**Request:**
```json
{
  "algorithm": "kyber768",
  "hybrid": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "publicKey": "base64encodedkey...",
    "privateKey": "base64encodedkey...",
    "algorithm": "kyber768",
    "createdAt": "2025-11-04T10:00:00Z"
  }
}
```

#### Encrypt
```
POST /api/qpc/pqc/encrypt
```

**Request:**
```json
{
  "data": "sensitive information",
  "publicKey": "base64encodedkey...",
  "algorithm": "kyber768"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ciphertext": "base64encrypted...",
    "algorithm": "kyber768",
    "nonce": "base64...",
    "tag": "base64..."
  }
}
```

#### Sign
```
POST /api/qpc/pqc/sign
```

**Request:**
```json
{
  "data": "transaction data",
  "privateKey": "base64encodedkey...",
  "algorithm": "dilithium3"
}
```

---

### KYC/AML Endpoints

#### Verify Customer
```
POST /api/qpc/kyc-aml/verify-customer
```

**Request:**
```json
{
  "customer": {
    "id": "CUS-001",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1985-01-15",
    "nationality": "US",
    "email": "john@example.com"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "customerId": "CUS-001",
    "status": "approved",
    "riskScore": 25,
    "riskLevel": "low",
    "checks": [...],
    "sanctions": {...},
    "fraud": {...}
  }
}
```

#### Analyze Transaction
```
POST /api/qpc/kyc-aml/analyze-transaction
```

**Request:**
```json
{
  "transaction": {
    "id": "TXN-001",
    "customerId": "CUS-001",
    "amount": 15000,
    "currency": "USD",
    "type": "withdrawal",
    "timestamp": "2025-11-04T10:00:00Z"
  },
  "customerHistory": [...]
}
```

---

## Hooks de React

### useQPCCore

Hook principal que integra todas las funcionalidades:

```typescript
import { useQPCCore } from '@/hooks/useQPCCore';

function MyComponent() {
  const { iso20022, pqc, kycAml } = useQPCCore();
  
  // Usar submódulos
}
```

### useISO20022

```typescript
import { useISO20022 } from '@/hooks/qpc/useISO20022';

function ISO20022Component() {
  const { loading, error, parseMessage, transformToBlockchain, createMessage } = useISO20022();
  
  const handleParse = async () => {
    const result = await parseMessage(xmlString);
    console.log(result);
  };
}
```

### usePQC

```typescript
import { usePQC } from '@/hooks/qpc/usePQC';

function PQCComponent() {
  const { loading, error, generateKeys, encrypt, decrypt, sign, verify } = usePQC();
  
  const handleEncrypt = async () => {
    const keys = await generateKeys('kyber768');
    const encrypted = await encrypt('sensitive data', keys.publicKey);
    console.log(encrypted);
  };
}
```

### useKYCAML

```typescript
import { useKYCAML } from '@/hooks/qpc/useKYCAML';

function KYCComponent() {
  const { loading, error, verifyCustomer, analyzeTransaction, checkSanctions } = useKYCAML();
  
  const handleVerify = async () => {
    const result = await verifyCustomer(customerData);
    console.log(result);
  };
}
```

---

## Componentes UI

### QPCDashboard

Componente principal que integra todos los módulos:

```typescript
import { QPCDashboard } from '@/components/qpc/QPCDashboard';

export default function Page() {
  return <QPCDashboard />;
}
```

**Ubicación:** `/qpc-demo`

### ISO20022Parser

Parsea y visualiza mensajes ISO 20022:

```typescript
import { ISO20022Parser } from '@/components/qpc/ISO20022Parser';

<ISO20022Parser />
```

### PQCEncryption

Demuestra encriptación y firma post-cuántica:

```typescript
import { PQCEncryption } from '@/components/qpc/PQCEncryption';

<PQCEncryption />
```

### KYCVerification

Verificación KYC y análisis AML:

```typescript
import { KYCVerification } from '@/components/qpc/KYCVerification';

<KYCVerification />
```

---

## Ejemplos de Uso

### Ejemplo 1: Procesar Mensaje ISO 20022

```typescript
import { parseISO20022Message, transformToBlockchain } from '@/backend/src/qpc-v2-core';

async function processPayment(xmlMessage: string) {
  // 1. Parse mensaje
  const message = await parseISO20022Message(xmlMessage);
  console.log('Tipo de mensaje:', message.messageType);
  
  // 2. Validar
  const validation = await validateISO20022Message(message);
  if (!validation.valid) {
    throw new Error('Mensaje inválido');
  }
  
  // 3. Transformar a blockchain
  const transformation = await transformToBlockchain(message);
  
  // 4. Procesar transacciones
  for (const tx of transformation.blockchainData.transactions) {
    console.log('Transacción:', tx);
    // Enviar a blockchain...
  }
}
```

### Ejemplo 2: Encriptar Transacción con PQC

```typescript
import { generatePQCKeyPair, encryptPQC, signTransaction } from '@/backend/src/qpc-v2-core';

async function secureTransaction(transaction: any) {
  // 1. Generar claves
  const keyPair = await generatePQCKeyPair('kyber768');
  
  // 2. Serializar transacción
  const txData = JSON.stringify(transaction);
  
  // 3. Encriptar
  const encrypted = await encryptPQC(txData, keyPair.publicKey);
  
  // 4. Firmar
  const signature = await signTransaction(transaction, keyPair.privateKey);
  
  return {
    encrypted,
    signature,
    publicKey: keyPair.publicKey,
  };
}
```

### Ejemplo 3: Verificación KYC Completa

```typescript
import { performKYCVerification, checkSanctions, detectFraud } from '@/backend/src/qpc-v2-core';

async function onboardCustomer(customer: Customer) {
  // 1. Verificación KYC básica
  const kycResult = await performKYCVerification(customer);
  
  if (kycResult.status === 'rejected') {
    throw new Error('KYC rechazado');
  }
  
  // 2. Verificar sanciones
  const sanctionsResult = await checkSanctions(customer);
  
  if (sanctionsResult.status === 'match') {
    throw new Error('Cliente en lista de sanciones');
  }
  
  // 3. Detectar fraude
  const fraudResult = await detectFraud(customer);
  
  if (fraudResult.isFraudulent) {
    throw new Error('Posible fraude detectado');
  }
  
  // 4. Aprobar cliente
  return {
    approved: true,
    riskScore: kycResult.riskScore,
    riskLevel: kycResult.riskLevel,
  };
}
```

### Ejemplo 4: Análisis AML de Transacciones

```typescript
import { analyzeTransactionAML, monitorCustomerTransactions } from '@/backend/src/qpc-v2-core';

async function monitorTransaction(transaction: AMLTransaction, history: AMLTransaction[]) {
  // 1. Analizar transacción individual
  const analysis = await analyzeTransactionAML(transaction, history);
  
  console.log('Risk Score:', analysis.riskScore);
  console.log('Suspicious:', analysis.suspicious);
  
  // 2. Verificar recomendación
  switch (analysis.recommendation) {
    case 'approve':
      // Aprobar automáticamente
      break;
    case 'review':
      // Enviar a revisión manual
      break;
    case 'reject':
      // Rechazar transacción
      break;
    case 'report':
      // Reportar a autoridades
      break;
  }
  
  // 3. Procesar alertas
  for (const alert of analysis.alerts) {
    console.log(`Alerta ${alert.type}:`, alert.description);
  }
  
  return analysis;
}
```

---

## Seguridad

### Mejores Prácticas

1. **Gestión de Claves**
   - Nunca almacenar claves privadas en el frontend
   - Usar rotación de claves regularmente
   - Implementar HSM para claves críticas en producción

2. **Validación de Datos**
   - Siempre validar mensajes ISO 20022 antes de procesar
   - Verificar firmas PQC antes de ejecutar transacciones
   - Implementar rate limiting en endpoints API

3. **KYC/AML**
   - Realizar verificación completa antes de onboarding
   - Monitorear transacciones continuamente
   - Mantener registros de auditoría

4. **Encriptación**
   - Usar modo híbrido (PQC + clásico) en producción
   - Encriptar datos sensibles en reposo y en tránsito
   - Implementar certificados SSL/TLS

### Configuración de Seguridad

```typescript
// config/security.ts
export const securityConfig = {
  pqc: {
    enableHybridMode: true, // Modo híbrido en producción
    minKeySize: 768,
    rotationPeriod: 90, // días
  },
  kyc: {
    maxRiskScore: 70,
    requireDocumentVerification: true,
    sanctionsCheckRequired: true,
  },
  api: {
    rateLimit: 100, // requests por minuto
    timeout: 30000, // ms
    enableCORS: false,
  },
};
```

---

## Troubleshooting

### Problemas Comunes

#### Error: "Cannot find module '@/backend/src/qpc-v2-core'"

**Solución:** Verificar que tsconfig.json tenga el path correcto:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./"],
      "@/backend/*": ["./backend/*"]
    }
  }
}
```

#### Error: "Algorithm not supported"

**Solución:** Verificar que el algoritmo esté en la lista de soportados:
- Encriptación: `kyber512`, `kyber768`, `kyber1024`
- Firma: `dilithium2`, `dilithium3`, `dilithium5`

#### Error: "Invalid XML message"

**Solución:** Verificar que el XML sea válido y del tipo soportado:
- Usar namespace correcto: `urn:iso:std:iso:20022:tech:xsd:pain.001.001.03`
- Incluir todos los campos requeridos
- Validar contra esquema XSD

#### Error: "KYC verification failed"

**Solución:** Verificar que todos los campos requeridos estén presentes:
- `id`, `firstName`, `lastName`, `dateOfBirth`, `nationality`
- Formato de fecha: ISO 8601 o Date object
- Código de país: ISO 3166-1 alpha-2 (2 letras)

### Logs de Depuración

Habilitar logs de depuración:

```typescript
// En desarrollo
process.env.NODE_ENV = 'development';

// Los logs se mostrarán automáticamente en consola
```

### Reportar Problemas

Para reportar problemas o solicitar funcionalidades:

1. Crear issue en GitHub: https://github.com/francoMengarelli/quantpaychain-mvpro/issues
2. Incluir:
   - Descripción del problema
   - Pasos para reproducir
   - Logs relevantes
   - Versión del núcleo QPC v2

---

## Roadmap

### v2.1 (Q1 2026)

- [ ] Integración con liboqs para PQC real
- [ ] Soporte para más tipos de mensajes ISO 20022
- [ ] API de streaming para transacciones en tiempo real
- [ ] Dashboard de métricas y analytics

### v2.2 (Q2 2026)

- [ ] Modelos de ML personalizados para KYC/AML
- [ ] Integración con APIs de listas de sanciones reales
- [ ] Soporte multi-idioma
- [ ] Exportación de reportes de compliance

### v3.0 (Q3 2026)

- [ ] Blockchain nativa con consenso PQC
- [ ] Smart contracts con verificación formal
- [ ] Interoperabilidad con otras blockchains
- [ ] Federación de identidades descentralizada

---

## Conclusión

El núcleo QPC v2 proporciona una base sólida para operaciones financieras seguras, conformes y resistentes a amenazas futuras. La integración completa con Next.js y React permite un desarrollo rápido y una experiencia de usuario fluida.

Para más información, consultar la documentación técnica en `/docs` o visitar la página de demostración en `/qpc-demo`.

---

**Mantenido por:** Equipo QuantPay Stack  
**Última actualización:** 4 de noviembre de 2025  
**Versión del documento:** 1.0.0
