# QuantPay Chain - API Documentation

**REST API v1.0 - Documentación Completa**

---

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Autenticación](#autenticación)
3. [Base URL y Convenciones](#base-url-y-convenciones)
4. [Códigos de Respuesta](#códigos-de-respuesta)
5. [Endpoints por Módulo](#endpoints-por-módulo)
   - [Health Check](#health-check)
   - [Authentication](#authentication)
   - [Properties](#properties)
   - [Investments](#investments)
   - [Payments](#payments)
   - [Contracts](#contracts)
   - [AI Auditor](#ai-auditor)
   - [Documents](#documents)
   - [Demo](#demo)
6. [Modelos de Datos](#modelos-de-datos)
7. [Rate Limiting](#rate-limiting)
8. [Manejo de Errores](#manejo-de-errores)
9. [Mejores Prácticas](#mejores-prácticas)

---

## Introducción

La API REST de QuantPay Chain proporciona acceso programático a todas las funcionalidades de la plataforma de tokenización inmobiliaria.

### Características

- ✅ **RESTful:** Arquitectura REST estándar
- ✅ **JSON:** Todas las peticiones y respuestas en JSON
- ✅ **Autenticación:** JWT con NextAuth.js
- ✅ **HTTPS:** Encriptación TLS 1.2+
- ✅ **Versionado:** Preparado para versionado futuro
- ✅ **Documentado:** Ejemplos completos para cada endpoint

### Tecnologías

- **Framework:** Next.js 14 API Routes
- **Autenticación:** NextAuth.js v4
- **Base de Datos:** PostgreSQL + Prisma ORM
- **Validación:** Zod schemas
- **Pagos:** Stripe SDK

---

## Autenticación

### Tipos de Autenticación

QuantPay Chain soporta dos métodos de autenticación:

#### 1. Session-based Authentication (NextAuth)

**Para usuarios tradicionales (email/password)**

```typescript
// Después del login, NextAuth crea una sesión
// Las peticiones subsecuentes incluyen automáticamente la cookie de sesión
// Cookie: next-auth.session-token=...
```

**No requiere headers especiales** - la sesión se maneja automáticamente por el navegador.

#### 2. Sign-In With Ethereum (SIWE)

**Para usuarios Web3 (wallets)**

```typescript
// Login con wallet conectada
POST /api/auth/siwe
{
  "message": "Sign this message...",
  "signature": "0x..."
}
```

### Obtener Sesión Actual

La mayoría de endpoints protegidos usan `getServerSession()` internamente para verificar autenticación.

**En el cliente (React):**
```typescript
import { useSession } from 'next-auth/react';

function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'unauthenticated') return <div>Please sign in</div>;
  
  return <div>Welcome {session?.user?.email}</div>;
}
```

### Endpoints Protegidos

Los endpoints que requieren autenticación retornan `401 Unauthorized` si no hay sesión:

```json
{
  "success": false,
  "error": "Unauthorized - Please sign in"
}
```

---

## Base URL y Convenciones

### Base URL

**Desarrollo:**
```
http://localhost:3000/api
```

**Producción:**
```
https://quantpaychain.com/api
```

### Convenciones de Respuesta

Todas las respuestas siguen este formato:

**Éxito:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Headers Comunes

**Request:**
```http
Content-Type: application/json
Accept: application/json
Cookie: next-auth.session-token=... (automático en navegador)
```

**Response:**
```http
Content-Type: application/json
```

---

## Códigos de Respuesta

| Código | Significado | Cuándo se usa |
|--------|-------------|---------------|
| **200** | OK | Petición exitosa |
| **201** | Created | Recurso creado exitosamente |
| **400** | Bad Request | Datos de entrada inválidos |
| **401** | Unauthorized | No autenticado |
| **403** | Forbidden | No autorizado (autenticado pero sin permiso) |
| **404** | Not Found | Recurso no encontrado |
| **409** | Conflict | Conflicto (ej: email ya existe) |
| **500** | Internal Server Error | Error del servidor |

---

## Endpoints por Módulo

## Health Check

### GET /api/health

Verifica el estado de la API.

**Autenticación:** ❌ No requerida

**Request:**
```bash
curl http://localhost:3000/api/health
```

**Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2025-10-24T12:00:00.000Z",
  "version": "1.0.0"
}
```

---

## Authentication

### POST /api/auth/signup

Registra un nuevo usuario con email y password.

**Autenticación:** ❌ No requerida

**Request Body:**
```json
{
  "email": "investor@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "country": "US"
}
```

**Validación:**
- `email`: Required, formato de email válido
- `password`: Required, mínimo 8 caracteres
- `firstName`: Optional
- `lastName`: Optional
- `phoneNumber`: Optional
- `country`: Optional, código ISO de 2 letras

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clxx123abc",
      "email": "investor@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "country": "US",
      "createdAt": "2025-10-24T12:00:00.000Z"
    }
  },
  "message": "User registered successfully"
}
```

**Errores:**

**409 Conflict - Email ya existe:**
```json
{
  "success": false,
  "error": "Email already registered"
}
```

**400 Bad Request - Password inválido:**
```json
{
  "success": false,
  "error": "Password must be at least 8 characters"
}
```

**Ejemplo con curl:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "investor@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Ejemplo con JavaScript/TypeScript:**
```typescript
const response = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'investor@example.com',
    password: 'SecurePass123!',
    firstName: 'John',
    lastName: 'Doe',
  }),
});

const data = await response.json();
if (data.success) {
  console.log('User created:', data.data.user);
}
```

---

### POST /api/auth/[...nextauth]

Manejado por NextAuth.js - endpoints de autenticación estándar.

**Endpoints incluidos:**
- `POST /api/auth/signin` - Iniciar sesión
- `POST /api/auth/signout` - Cerrar sesión
- `GET /api/auth/session` - Obtener sesión actual
- `GET /api/auth/providers` - Listar providers disponibles

**Documentación:** [next-auth.js.org/getting-started/rest-api](https://next-auth.js.org/getting-started/rest-api)

**Ejemplo de login:**
```typescript
import { signIn } from 'next-auth/react';

await signIn('credentials', {
  email: 'investor@quantpay.com',
  password: 'Demo1234!',
  redirect: false,
});
```

---

### POST /api/auth/siwe

Sign-In With Ethereum - Autenticación con wallet Web3.

**Autenticación:** ❌ No requerida (este es el endpoint de autenticación)

**Request Body:**
```json
{
  "message": "quantpaychain.com wants you to sign in with your Ethereum account:\n0x1234...\n\nSign in to QuantPay Chain\n\nURI: https://quantpaychain.com\nVersion: 1\nChain ID: 1\nNonce: 12345678\nIssued At: 2025-10-24T12:00:00.000Z",
  "signature": "0xabcd1234..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clxx456def",
      "walletAddress": "0x1234567890abcdef...",
      "email": null,
      "createdAt": "2025-10-24T12:00:00.000Z"
    }
  }
}
```

---

## Properties

### GET /api/properties

Obtiene lista de propiedades con filtros y paginación.

**Autenticación:** ❌ No requerida

**Query Parameters:**

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `propertyType` | string | Tipo(s) de propiedad (separados por coma) | `RESIDENTIAL,COMMERCIAL` |
| `minPrice` | number | Precio mínimo | `100000` |
| `maxPrice` | number | Precio máximo | `5000000` |
| `minReturn` | number | Retorno anual mínimo (%) | `10` |
| `city` | string | Ciudad(es) | `Miami,Austin` |
| `country` | string | País(es) | `US,MX` |
| `status` | string | Estado(s) | `FUNDING,ACTIVE` |
| `search` | string | Búsqueda full-text | `beachfront luxury` |
| `page` | number | Número de página | `1` (default) |
| `limit` | number | Resultados por página | `20` (default) |
| `sortBy` | string | Campo de ordenamiento | `createdAt` (default) |
| `sortOrder` | string | Orden: `asc` o `desc` | `desc` (default) |

**Property Types:**
- `RESIDENTIAL` - Residencial
- `COMMERCIAL` - Comercial
- `INDUSTRIAL` - Industrial
- `MIXED_USE` - Uso mixto
- `LAND` - Terreno

**Property Status:**
- `DRAFT` - Borrador
- `UNDER_REVIEW` - En revisión
- `APPROVED` - Aprobado
- `FUNDING` - En recaudación
- `FUNDED` - Fondeado
- `ACTIVE` - Activo
- `COMPLETED` - Completado
- `CANCELLED` - Cancelado

**Request Example:**
```bash
curl "http://localhost:3000/api/properties?propertyType=RESIDENTIAL&minPrice=500000&maxPrice=2000000&status=FUNDING&page=1&limit=10"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "clxx789ghi",
        "title": "Luxury Beachfront Condo",
        "description": "Modern 3-bedroom condo with ocean views...",
        "propertyType": "RESIDENTIAL",
        "status": "FUNDING",
        "address": "123 Ocean Drive",
        "city": "Miami Beach",
        "country": "US",
        "postalCode": "33139",
        "totalPrice": "850000.00",
        "tokenPrice": "1000.00",
        "totalTokens": 850,
        "tokensSold": 425,
        "tokensAvailable": 425,
        "minimumInvestment": "5000.00",
        "annualReturn": "12.50",
        "projectedAppreciation": "5.00",
        "rentalYield": "7.50",
        "images": [
          "https://thumbs.dreamstime.com/b/houses-different-size-value-stacks-coins-concept-property-mortgage-real-estate-investment-d-illustration-139565371.jpg",
          "https://lh5.googleusercontent.com/uyzpXBOuIJZlLZHtXmnmbHrfgLbTO_6QgziepriQYGri5rDgY2hvHFBX2PrL3l49_6i2FvpY88FEA1y0hheEN1ZCI8XMyjvV77pMIiZJ5InGCXGfdyIfDBdNAjHz4qEEBNyB7pELvjCz3JMd_vF8FvE"
        ],
        "fundingProgress": 50.0,
        "createdAt": "2025-10-15T10:00:00.000Z",
        "updatedAt": "2025-10-24T12:00:00.000Z"
      }
      // ... more properties
    ],
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

**JavaScript Example:**
```typescript
async function getProperties(filters = {}) {
  const params = new URLSearchParams({
    propertyType: filters.types?.join(',') || '',
    minPrice: filters.minPrice || '',
    maxPrice: filters.maxPrice || '',
    status: 'FUNDING',
    page: '1',
    limit: '20',
  });

  const response = await fetch(`/api/properties?${params}`);
  const data = await response.json();
  
  return data.data;
}
```

---

### GET /api/properties/featured

Obtiene propiedades destacadas (algoritmo de trending).

**Autenticación:** ❌ No requerida

**Query Parameters:**

| Parámetro | Tipo | Descripción | Default |
|-----------|------|-------------|---------|
| `limit` | number | Número máximo de propiedades | `6` |

**Request:**
```bash
curl "http://localhost:3000/api/properties/featured?limit=6"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "clxx789ghi",
      "title": "Luxury Beachfront Condo",
      "status": "FUNDING",
      "totalPrice": "850000.00",
      "annualReturn": "12.50",
      "fundingProgress": 50.0,
      "images": ["https://www.shutterstock.com/image-photo/this-photo-taken-somewhere-miami-260nw-2341437271.jpg
      "city": "Miami Beach",
      "country": "US"
    }
    // ... 5 more featured properties
  ]
}
```

---

### GET /api/properties/[id]

Obtiene detalles completos de una propiedad específica.

**Autenticación:** ❌ No requerida

**Path Parameters:**
- `id` - ID de la propiedad (cuid)

**Request:**
```bash
curl http://localhost:3000/api/properties/clxx789ghi
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "clxx789ghi",
    "title": "Luxury Beachfront Condo",
    "description": "Modern 3-bedroom condo with ocean views in the heart of Miami Beach. Recently renovated with high-end finishes...",
    "propertyType": "RESIDENTIAL",
    "status": "FUNDING",
    "address": "123 Ocean Drive",
    "city": "Miami Beach",
    "state": "Florida",
    "country": "US",
    "postalCode": "33139",
    "coordinates": {
      "lat": 25.7907,
      "lng": -80.1300
    },
    "totalPrice": "850000.00",
    "tokenPrice": "1000.00",
    "totalTokens": 850,
    "tokensSold": 425,
    "tokensAvailable": 425,
    "minimumInvestment": "5000.00",
    "annualReturn": "12.50",
    "projectedAppreciation": "5.00",
    "rentalYield": "7.50",
    "investmentPeriod": 60,
    "propertySize": 1800,
    "bedrooms": 3,
    "bathrooms": 2,
    "yearBuilt": 2018,
    "images": [
      "https://ssl.cdn-redfin.com/photo/9/mbphotov3/790/genMid.425068790_2.jpg",
      "https://i.ytimg.com/vi/Smesr1R0430/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLA2Cg3_IVq4HHbC1-XIdoizF_QhIg",
      "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmVhbCUyMGVzdGF0ZSUyMGJ1aWxkaW5nfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000"
    ],
    "documents": [
      {
        "type": "title_deed",
        "url": "https://example.com/deed.pdf"
      },
      {
        "type": "appraisal",
        "url": "https://example.com/appraisal.pdf"
      }
    ],
    "features": [
      "Ocean view",
      "Pool access",
      "Gym",
      "24/7 Security",
      "Parking"
    ],
    "fundingProgress": 50.0,
    "investorsCount": 42,
    "createdAt": "2025-10-15T10:00:00.000Z",
    "updatedAt": "2025-10-24T12:00:00.000Z"
  }
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Property not found"
}
```

---

### POST /api/properties/[id]/calculate

Calcula proyección de inversión para una cantidad específica.

**Autenticación:** ❌ No requerida

**Path Parameters:**
- `id` - ID de la propiedad

**Request Body:**
```json
{
  "amount": 10000
}
```

**Request:**
```bash
curl -X POST http://localhost:3000/api/properties/clxx789ghi/calculate \
  -H "Content-Type: application/json" \
  -d '{"amount": 10000}'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "investmentAmount": 10000,
    "tokens": 10,
    "ownershipPercent": 1.1765,
    "annualReturn": 1250.00,
    "monthlyReturn": 104.17,
    "projections": {
      "1year": 11250.00,
      "3years": 13968.75,
      "5years": 17623.05
    },
    "breakEvenMonths": 96,
    "totalReturnPercent": 76.23
  }
}
```

**Cálculos incluidos:**
- `tokens`: Cantidad de tokens adquiridos
- `ownershipPercent`: Porcentaje de propiedad
- `annualReturn`: Retorno anual en USD
- `monthlyReturn`: Retorno mensual estimado
- `projections`: Proyección de valor a 1, 3 y 5 años
- `breakEvenMonths`: Meses para recuperar inversión
- `totalReturnPercent`: ROI total a 5 años

---

## Investments

### POST /api/investments

Crea una nueva inversión (estado PENDING).

**Autenticación:** ✅ Requerida

**Request Body:**
```json
{
  "propertyId": "clxx789ghi",
  "amount": 10000,
  "paymentMethod": "STRIPE"
}
```

**Validación:**
- `propertyId`: Required, debe existir
- `amount`: Required, mínimo = `property.minimumInvestment`
- `paymentMethod`: Required, uno de: `STRIPE`, `ETH`, `USDC`, `DAI`, `BTC`

**Request:**
```bash
curl -X POST http://localhost:3000/api/investments \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "propertyId": "clxx789ghi",
    "amount": 10000,
    "paymentMethod": "STRIPE"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "clxx111aaa",
    "userId": "clxx456def",
    "propertyId": "clxx789ghi",
    "amount": "10000.00",
    "tokens": 10,
    "ownershipPercent": "1.1765",
    "status": "PENDING",
    "paymentMethod": "STRIPE",
    "createdAt": "2025-10-24T12:00:00.000Z",
    "property": {
      "id": "clxx789ghi",
      "title": "Luxury Beachfront Condo",
      "tokenPrice": "1000.00",
      "images": ["https://images.ctfassets.net/wlzmdirin2hy/7DDgWlIdlnY2lvlOAvW53G/9297e430401dcc0c40fe5afa5a4d4815/LX_Miami33_HOM_Scott_06-scaled.jpg
    }
  },
  "message": "Investment created successfully. Please proceed with payment."
}
```

**Errores:**

**401 Unauthorized:**
```json
{
  "success": false,
  "error": "Unauthorized - Please sign in"
}
```

**400 Bad Request - Amount too low:**
```json
{
  "success": false,
  "error": "Investment amount must be at least $5,000.00"
}
```

**400 Bad Request - Insufficient tokens:**
```json
{
  "success": false,
  "error": "Not enough tokens available. Available: 100, Requested: 150"
}
```

**Flujo completo:**
```typescript
// 1. Crear inversión
const investment = await createInvestment({
  propertyId,
  amount: 10000,
  paymentMethod: 'STRIPE'
});

// 2. Procesar pago (ver Payments)
const payment = await createStripePaymentIntent({
  investmentId: investment.id,
  amount: investment.amount
});

// 3. Confirmar pago → Investment status = CONFIRMED
```

---

### GET /api/investments

Obtiene inversiones del usuario autenticado.

**Autenticación:** ✅ Requerida

**Query Parameters:**

| Parámetro | Tipo | Descripción | Default |
|-----------|------|-------------|---------|
| `status` | string | Filtrar por estado | All |
| `propertyId` | string | Filtrar por propiedad | All |

**Request:**
```bash
curl http://localhost:3000/api/investments?status=CONFIRMED \
  -H "Cookie: next-auth.session-token=..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "clxx111aaa",
      "propertyId": "clxx789ghi",
      "amount": "10000.00",
      "tokens": 10,
      "ownershipPercent": "1.1765",
      "status": "CONFIRMED",
      "paymentMethod": "STRIPE",
      "createdAt": "2025-10-24T12:00:00.000Z",
      "confirmedAt": "2025-10-24T12:05:00.000Z",
      "property": {
        "id": "clxx789ghi",
        "title": "Luxury Beachfront Condo",
        "city": "Miami Beach",
        "annualReturn": "12.50",
        "images": ["https://www.miamiluxuryhomes.com/wp-content/uploads/2018/11/57-Ocean-Terrace.jpg
      },
      "payments": [
        {
          "id": "clxx222bbb",
          "amount": "10000.00",
          "status": "COMPLETED",
          "method": "STRIPE",
          "confirmedAt": "2025-10-24T12:05:00.000Z"
        }
      ]
    }
    // ... more investments
  ]
}
```

---

### GET /api/investments/stats

Obtiene estadísticas del portfolio del usuario.

**Autenticación:** ✅ Requerida

**Request:**
```bash
curl http://localhost:3000/api/investments/stats \
  -H "Cookie: next-auth.session-token=..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalInvested": "45000.00",
    "totalProperties": 5,
    "totalTokens": 52,
    "averageReturn": "11.80",
    "projectedAnnualReturn": "5310.00",
    "projectedMonthlyReturn": "442.50",
    "portfolioDistribution": [
      {
        "propertyType": "RESIDENTIAL",
        "count": 3,
        "totalInvested": "28000.00",
        "percentage": 62.22
      },
      {
        "propertyType": "COMMERCIAL",
        "count": 2,
        "totalInvested": "17000.00",
        "percentage": 37.78
      }
    ],
    "byStatus": {
      "CONFIRMED": 4,
      "PENDING": 1,
      "CANCELLED": 0
    },
    "topInvestments": [
      {
        "propertyTitle": "Luxury Beachfront Condo",
        "amount": "15000.00",
        "annualReturn": "1875.00"
      }
      // ... top 3
    ]
  }
}
```

---

### GET /api/investments/[id]

Obtiene detalles de una inversión específica.

**Autenticación:** ✅ Requerida (solo el propietario)

**Path Parameters:**
- `id` - ID de la inversión

**Request:**
```bash
curl http://localhost:3000/api/investments/clxx111aaa \
  -H "Cookie: next-auth.session-token=..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "clxx111aaa",
    "userId": "clxx456def",
    "propertyId": "clxx789ghi",
    "amount": "10000.00",
    "tokens": 10,
    "ownershipPercent": "1.1765",
    "status": "CONFIRMED",
    "paymentMethod": "STRIPE",
    "createdAt": "2025-10-24T12:00:00.000Z",
    "confirmedAt": "2025-10-24T12:05:00.000Z",
    "property": {
      "id": "clxx789ghi",
      "title": "Luxury Beachfront Condo",
      "description": "...",
      "totalPrice": "850000.00",
      "annualReturn": "12.50",
      "images": ["https://images.trvl-media.com/lodging/113000000/112700000/112699200/112699167/0162498f.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill
    },
    "payments": [
      {
        "id": "clxx222bbb",
        "amount": "10000.00",
        "currency": "USD",
        "method": "STRIPE",
        "status": "COMPLETED",
        "stripePaymentIntentId": "pi_...",
        "createdAt": "2025-10-24T12:03:00.000Z",
        "confirmedAt": "2025-10-24T12:05:00.000Z"
      }
    ],
    "contracts": [
      {
        "id": "clxx333ccc",
        "createdAt": "2025-10-24T12:05:30.000Z",
        "isSigned": true,
        "signedAt": "2025-10-24T12:06:00.000Z"
      }
    ],
    "projections": {
      "annualReturn": 1250.00,
      "monthlyReturn": 104.17,
      "fiveYearProjection": 17623.05
    }
  }
}
```

**403 Forbidden - Not owner:**
```json
{
  "success": false,
  "error": "You don't have permission to view this investment"
}
```

---

## Payments

### POST /api/payments/stripe/create-intent

Crea un Stripe Payment Intent para procesar pago.

**Autenticación:** ✅ Requerida

**Request Body:**
```json
{
  "investmentId": "clxx111aaa",
  "amount": 10000,
  "currency": "USD"
}
```

**Validación:**
- `investmentId`: Required, debe existir y pertenecer al usuario
- `amount`: Required, debe coincidir con investment.amount
- `currency`: Optional, default "USD"

**Request:**
```bash
curl -X POST http://localhost:3000/api/payments/stripe/create-intent \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "investmentId": "clxx111aaa",
    "amount": 10000,
    "currency": "USD"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "payment": {
      "id": "clxx222bbb",
      "investmentId": "clxx111aaa",
      "amount": "10000.00",
      "currency": "USD",
      "method": "STRIPE",
      "status": "PENDING",
      "stripePaymentIntentId": "pi_3ABC123...",
      "createdAt": "2025-10-24T12:03:00.000Z"
    },
    "clientSecret": "pi_3ABC123..._secret_XYZ..."
  },
  "message": "Payment intent created successfully"
}
```

**Uso del clientSecret en el frontend:**
```typescript
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// 1. Cargar Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// 2. En tu componente de pago
function PaymentForm({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;

    // 3. Confirmar pago
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
      }
    );

    if (error) {
      console.error(error.message);
    } else if (paymentIntent.status === 'succeeded') {
      console.log('Payment successful!');
      // El webhook de Stripe confirmará automáticamente la inversión
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay $10,000
      </button>
    </form>
  );
}
```

---

### POST /api/payments/stripe/webhook

Webhook de Stripe (llamado automáticamente por Stripe).

**Autenticación:** ❌ No requerida (validado con `stripe-signature` header)

**⚠️ Este endpoint es llamado por Stripe, no por tu frontend.**

**Headers:**
```http
stripe-signature: t=1234567890,v1=abc123...
```

**Request Body:** (Ejemplo de `payment_intent.succeeded`)
```json
{
  "id": "evt_1ABC123...",
  "object": "event",
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_3ABC123...",
      "amount": 1000000,
      "currency": "usd",
      "status": "succeeded",
      "metadata": {
        "investmentId": "clxx111aaa"
      }
    }
  }
}
```

**Eventos manejados:**
- `payment_intent.succeeded` - Pago exitoso → Confirma inversión
- `payment_intent.payment_failed` - Pago fallido → Marca pago como FAILED

**Response (200 OK):**
```json
{
  "received": true
}
```

**Configurar webhook en Stripe:**
1. Dashboard → Developers → Webhooks
2. Add endpoint: `https://tu-dominio.com/api/payments/stripe/webhook`
3. Seleccionar eventos: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copiar "Signing secret" (whsec_...) → `.env`

---

### POST /api/payments/crypto/create-request

Crea solicitud de pago con criptomonedas (SIMULADO para MVP).

**Autenticación:** ✅ Requerida

**Request Body:**
```json
{
  "investmentId": "clxx111aaa",
  "cryptocurrency": "ETH",
  "amount": 10000
}
```

**Supported cryptocurrencies:**
- `ETH` - Ethereum
- `USDC` - USD Coin
- `DAI` - Dai Stablecoin
- `BTC` - Bitcoin

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "payment": {
      "id": "clxx333ddd",
      "investmentId": "clxx111aaa",
      "amount": "10000.00",
      "method": "ETH",
      "status": "PENDING",
      "cryptoWalletAddress": "0x1234567890abcdef1234567890abcdef12345678",
      "cryptoNetwork": "ethereum",
      "createdAt": "2025-10-24T12:03:00.000Z"
    },
    "exchangeRate": {
      "ETH": 2500.00,
      "amountCrypto": "4.0000"
    },
    "qrCode": "data:image/png;base64,..."
  },
  "message": "Send 4.0000 ETH to the wallet address"
}
```

**⚠️ Nota:** En MVP, este es un sistema simulado. En producción, integrará con proveedores reales de pagos crypto.

---

### POST /api/payments/crypto/simulate

Simula confirmación de pago crypto (solo para DEMO).

**Autenticación:** ✅ Requerida

**⚠️ Este endpoint solo existe en desarrollo para testing.**

**Request Body:**
```json
{
  "paymentId": "clxx333ddd",
  "txHash": "0xabcd1234567890abcd1234567890abcd1234567890abcd1234567890abcd1234"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "payment": {
      "id": "clxx333ddd",
      "status": "COMPLETED",
      "cryptoTxHash": "0xabcd...",
      "confirmedAt": "2025-10-24T12:10:00.000Z"
    },
    "investment": {
      "id": "clxx111aaa",
      "status": "CONFIRMED"
    }
  },
  "message": "Crypto payment confirmed (simulated)"
}
```

---

## Contracts

### POST /api/contracts/generate

Genera un contrato de inversión.

**Autenticación:** ✅ Requerida

**Request Body:**
```json
{
  "investmentId": "clxx111aaa",
  "propertyId": "clxx789ghi",
  "templateId": "standard_investment_v1"
}
```

**Validación:**
- `investmentId`: Required, debe existir y pertenecer al usuario
- `propertyId`: Required, debe existir
- `templateId`: Optional, default "standard_investment_v1"

**Request:**
```bash
curl -X POST http://localhost:3000/api/contracts/generate \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "investmentId": "clxx111aaa",
    "propertyId": "clxx789ghi"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "clxx444eee",
    "propertyId": "clxx789ghi",
    "investmentId": "clxx111aaa",
    "userId": "clxx456def",
    "templateId": "standard_investment_v1",
    "htmlContent": "<html><!-- Full contract HTML --></html>",
    "contractHash": "sha256:abcd1234...",
    "signatureData": {
      "algorithm": "dilithium3",
      "publicKey": "0x...",
      "signature": "0x...",
      "timestamp": "2025-10-24T12:05:30.000Z"
    },
    "isSigned": true,
    "signedAt": "2025-10-24T12:05:30.000Z",
    "createdAt": "2025-10-24T12:05:30.000Z"
  },
  "message": "Contract generated and signed successfully"
}
```

**Secciones del contrato generado:**
1. Purchase and Sale
2. Ownership Rights
3. Returns and Distributions
4. Investment Period
5. Management and Fees
6. Blockchain Recording
7. Post-Quantum Signatures
8. Governing Law
9. Entire Agreement

---

### GET /api/contracts/[id]

Obtiene un contrato específico.

**Autenticación:** ✅ Requerida (solo el propietario)

**Path Parameters:**
- `id` - ID del contrato

**Request:**
```bash
curl http://localhost:3000/api/contracts/clxx444eee \
  -H "Cookie: next-auth.session-token=..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "clxx444eee",
    "propertyId": "clxx789ghi",
    "investmentId": "clxx111aaa",
    "userId": "clxx456def",
    "templateId": "standard_investment_v1",
    "htmlContent": "<html><!-- Full contract HTML --></html>",
    "contractHash": "sha256:abcd1234...",
    "ipfsHash": null,
    "signatureData": {
      "algorithm": "dilithium3",
      "publicKey": "0x...",
      "signature": "0x...",
      "timestamp": "2025-10-24T12:05:30.000Z"
    },
    "isSigned": true,
    "signedAt": "2025-10-24T12:05:30.000Z",
    "createdAt": "2025-10-24T12:05:30.000Z",
    "expiresAt": null,
    "property": {
      "id": "clxx789ghi",
      "title": "Luxury Beachfront Condo"
    },
    "investment": {
      "id": "clxx111aaa",
      "amount": "10000.00",
      "tokens": 10
    },
    "aiAudits": [
      {
        "id": "clxx555fff",
        "riskLevel": "MEDIUM",
        "complianceScore": 87,
        "createdAt": "2025-10-24T12:06:00.000Z"
      }
    ]
  }
}
```

**Visualizar contrato:**
```typescript
// Renderizar HTML del contrato
<div dangerouslySetInnerHTML={{ __html: contract.htmlContent }} />

// O descargar como archivo
const blob = new Blob([contract.htmlContent], { type: 'text/html' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `contract-${contract.id}.html`;
a.click();
```

---

## AI Auditor

### POST /api/ai-auditor/analyze

Analiza un contrato con IA (OpenAI GPT-4).

**Autenticación:** ✅ Requerida

**Request Body:**
```json
{
  "contractId": "clxx444eee",
  "analysisType": "full"
}
```

**Analysis Types:**
- `full` - Análisis completo (~30 seg, más detallado)
- `quick` - Análisis rápido (~10 seg, visión general)
- `compliance` - Enfocado en cumplimiento regulatorio

**Request:**
```bash
curl -X POST http://localhost:3000/api/ai-auditor/analyze \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=..." \
  -d '{
    "contractId": "clxx444eee",
    "analysisType": "full"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "clxx555fff",
    "contractId": "clxx444eee",
    "analysisType": "full",
    "aiProvider": "openai",
    "riskLevel": "MEDIUM",
    "complianceScore": 87,
    "summary": "This investment contract demonstrates strong legal structure with clear terms for fractional real estate ownership. The agreement includes comprehensive sections covering purchase terms, ownership rights, and return distributions. Key strengths include transparent fee disclosure and robust blockchain integration. Minor improvements suggested in dispute resolution mechanisms and additional regulatory disclosures.",
    "issues": [
      {
        "severity": "warning",
        "category": "legal",
        "description": "Dispute resolution clause could be more specific about arbitration procedures",
        "suggestedFix": "Add detailed arbitration process with specified venue and rules (e.g., AAA Commercial Arbitration Rules)"
      },
      {
        "severity": "info",
        "category": "regulatory",
        "description": "Consider adding SEC disclaimer for US investors",
        "suggestedFix": "Include statement: 'This offering has not been registered with the SEC...'"
      },
      {
        "severity": "warning",
        "category": "financial",
        "description": "Lack of force majeure clause for extraordinary circumstances",
        "suggestedFix": "Add clause addressing pandemic, natural disasters, or market collapse scenarios"
      }
    ],
    "recommendations": [
      {
        "priority": "high",
        "description": "Enhance investor protection clauses",
        "implementation": "Add section detailing investor rights in case of property management changes or financial distress"
      },
      {
        "priority": "medium",
        "description": "Clarify dividend distribution timeline",
        "implementation": "Specify exact dates for quarterly distributions (e.g., 15th of Jan, Apr, Jul, Oct)"
      },
      {
        "priority": "low",
        "description": "Include property insurance details",
        "implementation": "Add appendix with insurance coverage amounts and policy details"
      }
    ],
    "strengths": [
      "Clear ownership percentages and token allocation",
      "Transparent fee structure with no hidden costs",
      "Strong PQC signature implementation for document integrity",
      "Comprehensive blockchain recording provisions",
      "Well-defined exit mechanisms for investors"
    ],
    "createdAt": "2025-10-24T12:06:00.000Z"
  },
  "message": "Contract analysis completed"
}
```

**Risk Levels:**
- `LOW` - Bajo riesgo, contrato bien estructurado
- `MEDIUM` - Riesgo medio, mejoras recomendadas
- `HIGH` - Alto riesgo, cambios necesarios
- `CRITICAL` - Riesgo crítico, NO firmar

**Issue Severities:**
- `error` - Problema crítico que debe resolverse
- `warning` - Problema importante, recomendado resolver
- `info` - Sugerencia de mejora

**Compliance Score:**
- `90-100`: Excelente cumplimiento
- `80-89`: Buen cumplimiento, mejoras menores
- `70-79`: Cumplimiento aceptable, mejoras recomendadas
- `60-69`: Cumplimiento bajo, cambios necesarios
- `<60`: Cumplimiento insuficiente, revisión completa

---

### GET /api/ai-auditor/[auditId]

Obtiene resultados de un análisis previo.

**Autenticación:** ✅ Requerida (solo propietario del contrato)

**Path Parameters:**
- `auditId` - ID del análisis

**Request:**
```bash
curl http://localhost:3000/api/ai-auditor/clxx555fff \
  -H "Cookie: next-auth.session-token=..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "clxx555fff",
    "contractId": "clxx444eee",
    "analysisType": "full",
    "aiProvider": "openai",
    "riskLevel": "MEDIUM",
    "complianceScore": 87,
    "summary": "...",
    "issues": [...],
    "recommendations": [...],
    "strengths": [...],
    "createdAt": "2025-10-24T12:06:00.000Z",
    "contract": {
      "id": "clxx444eee",
      "propertyId": "clxx789ghi",
      "investmentId": "clxx111aaa"
    }
  }
}
```

---

## Documents

### POST /api/documents/upload

Sube un documento a IPFS/S3.

**Autenticación:** ✅ Requerida

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `file` - Archivo a subir
- `title` - Título del documento
- `type` - Tipo: `contract`, `title_deed`, `appraisal`, `other`

**Request (usando FormData):**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('title', 'Property Title Deed');
formData.append('type', 'title_deed');

const response = await fetch('/api/documents/upload', {
  method: 'POST',
  body: formData,
});
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "clxx666ggg",
    "title": "Property Title Deed",
    "type": "title_deed",
    "fileName": "title_deed_original.pdf",
    "fileSize": 2048576,
    "mimeType": "application/pdf",
    "ipfsHash": "QmX...",
    "url": "https://gateway.pinata.cloud/ipfs/QmX...",
    "userId": "clxx456def",
    "createdAt": "2025-10-24T12:00:00.000Z"
  }
}
```

---

### GET /api/documents/[id]

Obtiene metadatos de un documento.

**Autenticación:** ✅ Requerida (solo propietario)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "clxx666ggg",
    "title": "Property Title Deed",
    "type": "title_deed",
    "fileName": "title_deed_original.pdf",
    "fileSize": 2048576,
    "mimeType": "application/pdf",
    "ipfsHash": "QmX...",
    "url": "https://gateway.pinata.cloud/ipfs/QmX...",
    "createdAt": "2025-10-24T12:00:00.000Z"
  }
}
```

---

### GET /api/documents/[id]/download

Descarga un documento.

**Autenticación:** ✅ Requerida (solo propietario)

**Response:** Archivo binario con headers apropiados

```http
Content-Type: application/pdf
Content-Disposition: attachment; filename="title_deed_original.pdf"
```

---

## Demo

### POST /api/demo/event

Registra evento de demo (para analytics).

**Autenticación:** ❌ No requerida

**Request Body:**
```json
{
  "eventType": "wallet_created",
  "metadata": {
    "walletAddress": "0x...",
    "timestamp": "2025-10-24T12:00:00.000Z"
  }
}
```

---

### POST /api/demo/simulate-tx

Simula transacción blockchain (para demo).

**Autenticación:** ❌ No requerida

**Request Body:**
```json
{
  "from": "0x...",
  "to": "0x...",
  "value": "1000000000000000000",
  "data": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "txHash": "0xabcd...",
    "blockNumber": 12345,
    "status": "confirmed",
    "gasUsed": "21000"
  }
}
```

---

## Modelos de Datos

### User
```typescript
{
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  walletAddress?: string;
  kycVerified: boolean;
  kycLevel: 'none' | 'basic' | 'full';
  createdAt: Date;
  updatedAt: Date;
}
```

### Property
```typescript
{
  id: string;
  title: string;
  description: string;
  propertyType: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'MIXED_USE' | 'LAND';
  status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'FUNDING' | 'FUNDED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  address: string;
  city: string;
  country: string;
  totalPrice: Decimal;
  tokenPrice: Decimal;
  totalTokens: number;
  tokensSold: number;
  minimumInvestment: Decimal;
  annualReturn: Decimal;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Investment
```typescript
{
  id: string;
  userId: string;
  propertyId: string;
  amount: Decimal;
  tokens: number;
  ownershipPercent: Decimal;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REFUNDED';
  paymentMethod?: 'STRIPE' | 'ETH' | 'USDC' | 'DAI' | 'BTC';
  createdAt: Date;
  confirmedAt?: Date;
}
```

### Payment
```typescript
{
  id: string;
  userId: string;
  investmentId?: string;
  amount: Decimal;
  currency: string;
  method: 'STRIPE' | 'ETH' | 'USDC' | 'DAI' | 'BTC';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
  stripePaymentIntentId?: string;
  cryptoWalletAddress?: string;
  cryptoTxHash?: string;
  createdAt: Date;
  confirmedAt?: Date;
}
```

### Contract
```typescript
{
  id: string;
  propertyId: string;
  investmentId: string;
  userId: string;
  templateId?: string;
  htmlContent: string;
  contractHash?: string;
  ipfsHash?: string;
  signatureData?: {
    algorithm: string;
    publicKey: string;
    signature: string;
    timestamp: Date;
  };
  isSigned: boolean;
  signedAt?: Date;
  createdAt: Date;
  expiresAt?: Date;
}
```

### AIAudit
```typescript
{
  id: string;
  contractId: string;
  analysisType: 'full' | 'quick' | 'compliance';
  aiProvider: 'openai' | 'anthropic';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  complianceScore: number; // 0-100
  summary: string;
  issues: Array<{
    severity: 'error' | 'warning' | 'info';
    category: 'legal' | 'financial' | 'technical' | 'regulatory';
    description: string;
    suggestedFix: string;
  }>;
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    description: string;
    implementation: string;
  }>;
  strengths?: string[];
  createdAt: Date;
}
```

---

## Rate Limiting

**Estado actual:** No implementado en MVP

**Planeado para producción:**
- 100 requests por 15 minutos por IP
- 1000 requests por día por usuario autenticado
- Endpoints públicos: 20 req/min
- Endpoints de pago: 10 req/min

**Headers de rate limit (futuro):**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1698172800
```

---

## Manejo de Errores

### Estructura de Error Estándar

```json
{
  "success": false,
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": { } // opcional, para errores de validación
}
```

### Códigos de Error Comunes

| Código | HTTP Status | Descripción |
|--------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Usuario no autenticado |
| `FORBIDDEN` | 403 | Usuario no autorizado para este recurso |
| `NOT_FOUND` | 404 | Recurso no encontrado |
| `VALIDATION_ERROR` | 400 | Datos de entrada inválidos |
| `DUPLICATE_ENTRY` | 409 | Recurso ya existe |
| `INSUFFICIENT_FUNDS` | 400 | Fondos insuficientes |
| `PAYMENT_FAILED` | 400 | Pago falló |
| `RATE_LIMIT_EXCEEDED` | 429 | Límite de rate excedido |
| `INTERNAL_ERROR` | 500 | Error interno del servidor |

### Ejemplo de Error de Validación

```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "email": ["Invalid email format"],
    "amount": ["Amount must be at least 5000"]
  }
}
```

### Manejo en el Cliente

```typescript
async function apiCall(endpoint: string, options: RequestInit) {
  try {
    const response = await fetch(endpoint, options);
    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Request failed');
    }
    
    return data.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Uso
try {
  const properties = await apiCall('/api/properties', { method: 'GET' });
} catch (error) {
  // Mostrar error al usuario
  toast.error(error.message);
}
```

---

## Mejores Prácticas

### 1. Autenticación

**Verificar sesión en el cliente:**
```typescript
import { useSession } from 'next-auth/react';

function ProtectedComponent() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin');
    },
  });
  
  if (status === 'loading') return <Skeleton />;
  
  return <YourComponent />;
}
```

### 2. Manejo de Estados de Carga

```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

async function handleAction() {
  setLoading(true);
  setError(null);
  
  try {
    const result = await apiCall('/api/endpoint');
    // Handle success
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}
```

### 3. Retry Logic para Errores Temporales

```typescript
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response.json();
      
      if (response.status >= 500 && i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
        continue;
      }
      
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
    }
  }
}
```

### 4. Validación en el Cliente

```typescript
import { z } from 'zod';

const investmentSchema = z.object({
  propertyId: z.string().cuid(),
  amount: z.number().min(5000, 'Minimum investment is $5,000'),
  paymentMethod: z.enum(['STRIPE', 'ETH', 'USDC', 'DAI', 'BTC']),
});

// Validar antes de enviar
try {
  const validated = investmentSchema.parse(formData);
  await createInvestment(validated);
} catch (error) {
  if (error instanceof z.ZodError) {
    // Mostrar errores de validación
    error.errors.forEach(err => {
      console.error(`${err.path}: ${err.message}`);
    });
  }
}
```

### 5. Hooks Personalizados

```typescript
function useInvestments() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInvestments() {
      try {
        const response = await fetch('/api/investments');
        const data = await response.json();
        setInvestments(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchInvestments();
  }, []);

  return { investments, loading, error };
}

// Uso
function MyComponent() {
  const { investments, loading, error } = useInvestments();
  
  if (loading) return <Skeleton />;
  if (error) return <ErrorMessage message={error} />;
  
  return <InvestmentList investments={investments} />;
}
```

### 6. TypeScript Types

```typescript
// Definir tipos para responses
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface Property {
  id: string;
  title: string;
  // ... other fields
}

// Usar en fetch
async function getProperties(): Promise<Property[]> {
  const response = await fetch('/api/properties');
  const data: ApiResponse<{ data: Property[] }> = await response.json();
  
  if (!data.success) {
    throw new Error(data.error);
  }
  
  return data.data!.data;
}
```

---

## Conclusión

Esta API proporciona todas las funcionalidades necesarias para:

✅ **Autenticar usuarios** (email/password y Web3)
✅ **Explorar propiedades** inmobiliarias tokenizadas
✅ **Crear inversiones** fraccionadas
✅ **Procesar pagos** (Stripe y crypto)
✅ **Generar contratos** legales con PQC
✅ **Auditar contratos** con IA

**Estado:** ✅ Production-ready para MVP

**Próximos pasos:**
1. Integrar frontend con estos endpoints
2. Implementar rate limiting
3. Añadir más endpoints según necesidades

---

**Documentación generada:** Octubre 24, 2025  
**Versión API:** v1.0  
**Base URL:** `https://quantpaychain.com/api`

---

*Para guía de integración completa, ver [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)*
