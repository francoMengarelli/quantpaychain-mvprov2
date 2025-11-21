# QuantPayChain - Plataforma de Tokenización RWA Multicadena 🚀

<div align="center">

![QuantPayChain](https://img.shields.io/badge/QuantPayChain-MVP_Ready-brightgreen?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

**Tokeniza activos del mundo real en múltiples blockchains con IA y pagos reales**

[Demo](https://quantum-markets.preview.emergentagent.com) • [Documentación](#-documentación) • [API](#-api-endpoints)

</div>

---

## 📋 Tabla de Contenidos

- [Características](#-características-principales)
- [Arquitectura](#-arquitectura)
- [Inicio Rápido](#-inicio-rápido)
- [Base de Datos](#-estructura-de-la-base-de-datos)
- [API](#-api-endpoints)
- [Frontend](#-páginas-del-frontend)
- [Tecnologías](#-tecnologías)
- [Flujo de Usuario](#-flujo-de-usuario)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)

## 🌟 Características Principales

### 🔗 **Multicadena**
Soporte nativo para 6 blockchains principales:
- **Ethereum** (⟠) - Gas: ~$2.50
- **Polygon** (◆) - Gas: ~$0.01  
- **BNB Chain** (◉) - Gas: ~$0.10
- **Solana** (◎) - Gas: ~$0.0002
- **Avalanche** (▲) - Gas: ~$0.50
- **Arbitrum** (◭) - Gas: ~$0.10

Selector de blockchain estilo "método de pago" para máxima usabilidad.

### 🏢 **4 Tipos de Activos RWA**
| Tipo | Descripción | Casos de Uso |
|------|-------------|--------------|
| 🏠 Bienes Raíces | Propiedades, edificios | Inversión inmobiliaria fraccionada |
| 🥇 Commodities | Oro, plata, agrícolas | Respaldo de valor tangible |
| 📄 Facturas | Cuentas por cobrar | Liquidez empresarial |
| 📦 Otros | Activos personalizados | Arte, coleccionables |

### 💳 **Sistema de Pagos Real**
- **Stripe Integration** vía emergentintegrations
- Checkout seguro con webhooks
- Polling automático de status
- Soporte para tarjetas y crypto (USDC)

### 🤖 **IA y Análisis**
- **GPT-4o** para análisis de viabilidad de activos
- Scoring automático de inversión (1-10)
- Evaluación de riesgos
- Recomendaciones de tokenización
- **Reportes ISO 20022** generados con IA

### 🔐 **Autenticación de Alto Nivel**
- **Emergent Google OAuth** - Login social seguro
- Sesiones de 7 días con cookies httpOnly
- Sistema de protección de rutas
- Preparado para JWT + 2FA

## 🏗️ Arquitectura

```
quantpaychain/
├── backend/                    # FastAPI + MongoDB
│   ├── server.py              # 400+ líneas de endpoints
│   ├── .env                   # Configuración (LLM, Stripe)
│   └── requirements.txt       # Dependencies
│
├── frontend/                   # React + TailwindCSS + Shadcn
│   ├── src/
│   │   ├── pages/             # 8 páginas completas
│   │   │   ├── LandingPage.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Marketplace.js
│   │   │   ├── TokenDetail.js
│   │   │   ├── CreateAsset.js
│   │   │   ├── Portfolio.js
│   │   │   ├── Reports.js
│   │   │   ├── PaymentSuccess.js
│   │   │   └── AuthCallback.js
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── ProtectedRoute.js
│   │   │   └── ui/            # Shadcn components
│   │   └── context/
│   │       └── AuthContext.js
│   ├── package.json
│   └── .env
│
├── auth_testing.md            # Guía de testing
└── README.md                  # Este archivo
```

### Stack Tecnológico

**Backend**: FastAPI + Motor (async MongoDB) + emergentintegrations  
**Frontend**: React 19 + React Router + Axios + Shadcn/UI + TailwindCSS  
**Database**: MongoDB (6 colecciones principales)  
**Auth**: Emergent OAuth (Google)  
**Payments**: Stripe Checkout  
**AI**: OpenAI GPT-4o (via Emergent LLM Key)

## 🚀 Inicio Rápido

### Prerequisitos
- Python 3.11+
- Node.js 18+ / Yarn
- MongoDB running on localhost:27017
- Cuenta Emergent (para OAuth y LLM key)

### 1. Backend Setup

```bash
cd backend

# Instalar emergentintegrations
pip install emergentintegrations --extra-index-url https://d33sy5i8bnduwe.cloudfront.net/simple/

# Instalar dependencias
pip install -r requirements.txt
```

**Configurar .env:**
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=quantpaychain_db
CORS_ORIGINS=*
EMERGENT_LLM_KEY=sk-emergent-xxxxx  # Tu key Emergent
STRIPE_API_KEY=sk_test_emergent     # Test key incluida
```

### 2. Frontend Setup

```bash
cd frontend

# Instalar dependencias
yarn install
```

**Configurar .env:**
```env
REACT_APP_BACKEND_URL=https://quantum-markets.preview.emergentagent.com
WDS_SOCKET_PORT=443
REACT_APP_ENABLE_VISUAL_EDITS=false
ENABLE_HEALTH_CHECK=false
```

### 3. Iniciar Servicios

En plataforma Emergent (automático via supervisor):
```bash
sudo supervisorctl restart backend frontend
sudo supervisorctl status
```

Local development:
```bash
# Backend
cd backend && uvicorn server:app --reload --port 8001

# Frontend
cd frontend && yarn start
```

### 4. Crear Datos de Prueba

```bash
mongosh --eval "
use('quantpaychain_db');

var userId = 'demo-user-' + Date.now();
var sessionToken = 'demo_session_' + Date.now();

db.users.insertOne({
  id: userId,
  email: 'demo@quantpaychain.com',
  name: 'Demo User',
  picture: 'https://via.placeholder.com/150',
  role: 'user',
  created_at: new Date()
});

db.user_sessions.insertOne({
  user_id: userId,
  session_token: sessionToken,
  expires_at: new Date(Date.now() + 7*24*60*60*1000),
  created_at: new Date()
});

var assetId = 'asset-' + Date.now();
db.rwa_assets.insertOne({
  id: assetId,
  name: 'Edificio Comercial Manhattan',
  asset_type: 'real_estate',
  description: 'Edificio premium en el centro de Manhattan, 10 pisos.',
  value_usd: 5000000,
  owner_id: userId,
  status: 'tokenized',
  blockchain_network: 'ethereum',
  metadata: {},
  created_at: new Date().toISOString()
});

var tokenId = 'token-' + Date.now();
db.tokens.insertOne({
  id: tokenId,
  asset_id: assetId,
  token_symbol: 'MCB-NYC',
  total_supply: 100000,
  available_supply: 75000,
  price_per_token: 50.0,
  blockchain_network: 'ethereum',
  contract_address: '0xabcd1234567890abcdef1234567890abcdef1234',
  created_at: new Date().toISOString()
});

print('✅ Test data created!');
print('Session Token: ' + sessionToken);
print('Use this token to test authenticated endpoints');
"
```

## 📊 Estructura de la Base de Datos

### Colección: `users`
```javascript
{
  id: "user-123",                    // UUID
  email: "user@example.com",
  name: "John Doe",
  picture: "https://...",            // Avatar URL
  role: "user",                      // user | admin
  created_at: ISODate("2025-...")
}
```

### Colección: `user_sessions`
```javascript
{
  user_id: "user-123",
  session_token: "session_xyz",      // 7 días de validez
  expires_at: ISODate("2025-..."),
  created_at: ISODate("2025-...")
}
```

### Colección: `rwa_assets`
```javascript
{
  id: "asset-456",
  name: "Edificio Manhattan",
  asset_type: "real_estate",         // real_estate | commodity | invoice | other
  description: "...",
  value_usd: 5000000.0,
  owner_id: "user-123",
  status: "tokenized",               // active | tokenized | inactive
  metadata: {},                      // Campos personalizados
  blockchain_network: "ethereum",    // null si no tokenizado
  created_at: ISODate("2025-...")
}
```

### Colección: `tokens`
```javascript
{
  id: "token-789",
  asset_id: "asset-456",
  token_symbol: "MCB-NYC",
  total_supply: 100000,
  available_supply: 75000,
  price_per_token: 50.0,
  blockchain_network: "ethereum",
  contract_address: "0xabcd...",    // Simulado (UUID hex)
  created_at: ISODate("2025-...")
}
```

### Colección: `transactions`
```javascript
{
  id: "tx-101",
  transaction_type: "buy",           // buy | sell
  buyer_id: "user-123",
  seller_id: null,                   // null para compras del marketplace
  token_id: "token-789",
  quantity: 100,
  total_amount: 5000.0,
  status: "completed",               // pending | completed | failed
  payment_session_id: "cs_stripe",
  blockchain_tx_hash: "0x1234...",  // Simulado
  created_at: ISODate("2025-...")
}
```

### Colección: `payment_transactions`
```javascript
{
  id: "payment-202",
  session_id: "cs_stripe_xyz",
  user_id: "user-123",
  amount: 5000.0,
  currency: "usd",
  status: "completed",               // initiated | completed | failed
  payment_status: "paid",            // pending | paid
  metadata: {
    token_id: "token-789",
    quantity: 100
  },
  created_at: ISODate("2025-...")
}
```

## 🔌 API Endpoints

Base URL: `https://tu-app.com/api`

### Authentication

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/auth/session` | Crear sesión desde OAuth callback | Header: X-Session-ID |
| GET | `/auth/me` | Obtener usuario actual | Bearer/Cookie |
| POST | `/auth/logout` | Cerrar sesión | Bearer/Cookie |

### RWA Assets

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/assets` | Crear nuevo activo RWA | ✅ Required |
| GET | `/assets` | Listar activos (filtros: type, blockchain) | ❌ Public |
| GET | `/assets/{id}` | Detalle de activo | ❌ Public |

### Tokens

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/tokens` | Tokenizar activo | ✅ Required |
| GET | `/tokens` | Listar tokens disponibles (filtro: blockchain) | ❌ Public |
| GET | `/tokens/{id}` | Detalle de token | ❌ Public |

### Blockchains

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/blockchains` | Listar redes disponibles | ❌ Public |

### Payments

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/payments/checkout` | Crear sesión de pago Stripe | ✅ Required |
| GET | `/payments/status/{session_id}` | Verificar estado del pago | ✅ Required |
| POST | `/webhook/stripe` | Webhook de Stripe | ⚠️ Stripe |

### Transactions

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/transactions` | Historial de transacciones del usuario | ✅ Required |

### AI & Reports

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/ai/analyze-asset` | Analizar activo con GPT-4o | ✅ Required |
| POST | `/reports/generate` | Generar reporte ISO 20022 | ✅ Required |
| GET | `/reports` | Listar reportes del usuario | ✅ Required |

### Dashboard

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/dashboard/stats` | Estadísticas del usuario | ✅ Required |

**Ejemplo de uso:**
```bash
# Auth required
curl -X GET "https://app.com/api/auth/me" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"

# Public endpoint
curl -X GET "https://app.com/api/blockchains"
```

## 🎨 Páginas del Frontend

### Públicas
- **`/`** - Landing page con hero, features, stats y CTA
- **`/auth/callback`** - Procesa callback de Emergent OAuth

### Protegidas (requieren autenticación)
- **`/dashboard`** - Panel principal con estadísticas y acciones rápidas
- **`/marketplace`** - Explora tokens con filtros multicadena
- **`/token/:id`** - Detalle del token + compra con selector de blockchain
- **`/create-asset`** - Formulario para crear RWA con análisis IA opcional
- **`/portfolio`** - Gestión de activos propios y transacciones
- **`/reports`** - Generación y descarga de reportes ISO 20022
- **`/payment-success`** - Confirmación post-pago con polling

### Componentes Principales
- **Navbar** - Navegación con dropdown de usuario
- **ProtectedRoute** - HOC para rutas autenticadas
- **AuthContext** - Provider global de autenticación

## 🔧 Tecnologías

### Backend
- **FastAPI** 0.110 - Framework web moderno
- **Motor** 3.3 - Driver MongoDB asíncrono
- **emergentintegrations** - LLM (GPT-4o) + Stripe
- **Pydantic** 2.6 - Validación de esquemas
- **httpx** - Cliente HTTP async

### Frontend
- **React** 19 - Library UI
- **React Router** 7.5 - Navegación
- **Axios** 1.8 - Cliente HTTP
- **Shadcn/UI** - Sistema de componentes
- **TailwindCSS** 3.4 - Framework CSS utility-first
- **Lucide React** - Iconos modernos
- **Sonner** - Sistema de toasts

### Database
- **MongoDB** - NoSQL database
- 6 colecciones principales
- Índices en `id`, `session_token`, `email`

### Integraciones Externas
- **Emergent OAuth** - Autenticación Google
- **OpenAI GPT-4o** - Análisis IA (via Emergent LLM Key)
- **Stripe** - Procesamiento de pagos

## 🎮 Flujo de Usuario

### 1️⃣ Registro y Autenticación
```
Landing Page
    ↓ Click "Comenzar Ahora"
Google OAuth (Emergent)
    ↓ Autorizar
Callback Processing
    ↓ Crear sesión
Dashboard (Autenticado)
```

### 2️⃣ Crear y Tokenizar Activo
```
Dashboard → "Crear Activo"
    ↓ Llenar formulario
[Opcional] Análisis con IA
    ↓ Revisar scoring
Guardar Activo
    ↓ Portfolio
"Tokenizar" Activo
    ↓ Configurar token
Token Creado → Marketplace
```

### 3️⃣ Comprar Token
```
Marketplace
    ↓ Browse tokens
Token Detail
    ↓ Seleccionar cantidad
Elegir Blockchain (multicadena)
    ↓ "Comprar Ahora"
Stripe Checkout
    ↓ Pagar
Polling de Status
    ↓ Confirmado
Payment Success
    ↓
Portfolio actualizado
```

### 4️⃣ Generar Reporte ISO 20022
```
Dashboard → "Ver Reportes"
    ↓ Tipo de reporte
"Generar con IA"
    ↓ GPT-4o procesa
Reporte generado
    ↓ Descargar
Archivo .txt con reporte
```

## 🧪 Testing

### Testing Manual con Datos de Prueba

1. **Crear usuario y sesión:**
```bash
# Ver script en "Inicio Rápido" sección 4
```

2. **Probar endpoints:**
```bash
TOKEN="tu_session_token"

# Auth
curl -H "Authorization: Bearer $TOKEN" \
  https://app.com/api/auth/me

# Dashboard
curl -H "Authorization: Bearer $TOKEN" \
  https://app.com/api/dashboard/stats

# Tokens
curl https://app.com/api/tokens
```

3. **Testing frontend:**
- Usar Chrome DevTools → Application → Cookies
- Agregar cookie: `session_token = tu_token`
- Navegar a dashboard

### Automated Testing

Ver guía completa en `/app/auth_testing.md`

Key points:
- Backend: Endpoints retornan JSON válido
- Frontend: Protected routes redirects correctamente
- Auth: Session cookies funcionan
- Payments: Stripe test mode configurado

## 🚢 Deployment

### Emergent Platform (Recomendado)

**Pre-configurado para deployment en Emergent con:**
- ✅ Supervisor para gestión de procesos
- ✅ NGINX reverse proxy
- ✅ Hot reload en desarrollo
- ✅ Logs centralizados

**Desplegar:**
1. Push código a repositorio Git
2. Conectar repo en Emergent dashboard
3. Variables de entorno auto-configuradas
4. Deploy automático

### Variables de Entorno Críticas

⚠️ **NO MODIFICAR:**
- `MONGO_URL` - Pre-configurado para MongoDB local
- `REACT_APP_BACKEND_URL` - Pre-configurado por Emergent
- `CORS_ORIGINS` - Pre-configurado

✅ **CONFIGURAR:**
- `EMERGENT_LLM_KEY` - Obtener de Emergent dashboard
- `STRIPE_API_KEY` - Usar `sk_test_emergent` para testing

### Verificar Deployment

```bash
# Check services
sudo supervisorctl status

# View logs
tail -f /var/log/supervisor/backend.err.log
tail -f /var/log/supervisor/frontend.err.log

# Test backend
curl http://localhost:8001/api/blockchains

# Test frontend
curl http://localhost:3000
```

## 🗺️ Roadmap

### ✅ v1.0 - MVP (Actual)
- [x] Sistema de autenticación OAuth
- [x] CRUD completo de activos RWA
- [x] Tokenización multicadena (simulada)
- [x] Marketplace con filtros
- [x] Sistema de pagos Stripe
- [x] Análisis IA con GPT-4o
- [x] Reportes ISO 20022
- [x] Dashboard y portfolio

### 🚧 v2.0 - Blockchain Real (Q1 2026)
- [ ] Integración web3.js/ethers.js
- [ ] Smart contracts ERC-20/ERC-721
- [ ] Deploy en testnets (Sepolia, Mumbai)
- [ ] Wallet connect (MetaMask, WalletConnect)
- [ ] Transacciones on-chain reales
- [ ] Gas estimation preciso

### 🔮 v3.0 - Enterprise (Q2 2026)
- [ ] KYC/AML compliance (Jumio, Onfido)
- [ ] Auditoría de smart contracts
- [ ] Sistema de staking/rewards
- [ ] Marketplace secundario P2P
- [ ] API pública para partners
- [ ] Mobile app (React Native)

### 💡 v4.0 - DAO & DeFi (Q3 2026)
- [ ] Governance token
- [ ] Voting mechanism
- [ ] Yield farming
- [ ] Liquidity pools
- [ ] Cross-chain bridges
- [ ] NFT integration

## 🤝 Contribuir

¡Contribuciones bienvenidas! Por favor:

1. **Fork** el repositorio
2. **Crear branch** de feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** cambios (`git commit -m 'Add AmazingFeature'`)
4. **Push** a la branch (`git push origin feature/AmazingFeature`)
5. **Abrir Pull Request**

### Guidelines
- Seguir estilo de código existente
- Agregar tests para nuevas features
- Actualizar documentación
- Commits descriptivos en español

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte y Contacto

- **Email**: support@quantpaychain.com
- **Documentación**: https://docs.quantpaychain.com
- **Discord**: https://discord.gg/quantpaychain
- **Twitter**: [@QuantPayChain](https://twitter.com/quantpaychain)

## 🙏 Agradecimientos

- **Emergent AI** - Plataforma de desarrollo y hosting
- **OpenAI** - Análisis IA con GPT-4o
- **Stripe** - Procesamiento de pagos
- **Shadcn** - Sistema de componentes UI

---

<div align="center">

**Construido con 💙 por el equipo QuantPayChain**

**Powered by** [Emergent AI](https://emergent.sh) 🤖

[⬆ Volver arriba](#quantpaychain---plataforma-de-tokenización-rwa-multicadena-)

</div>
