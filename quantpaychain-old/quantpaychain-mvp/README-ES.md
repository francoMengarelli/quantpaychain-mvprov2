
# 🔗 QuantPay Chain MVP - Alternativa Web3 a DocuSign

[![Deploy to Vercel](https://placehold.co/1200x600/e2e8f0/1e293b?text=A__Deploy_to_Vercel__button_image__typically_a_rec)
[![License: MIT](https://placehold.co/1200x600/e2e8f0/1e293b?text=A_yellow_MIT_License_badge_from_shields_io_with_th)
[![TypeScript](https://placehold.co/1200x600/e2e8f0/1e293b?text=A_badge_style_image_showing__TypeScript_5_2__with_)
[![Next.js](https://placehold.co/1200x600/e2e8f0/1e293b?text=A_badge_style_image_showing__Next_js_14_2__with_a_)

[🇪🇸 Español](./README-ES.md) | [🇺🇸 English](./README.md)

Una plataforma descentralizada de firma de documentos impulsada por tecnología blockchain, almacenamiento IPFS y contratos inteligentes. Transforma tu flujo de trabajo de documentos con firmas digitales inmutables y criptográficamente seguras.

## 🚀 Demo en Vivo

- **URL de Producción**: [www.quantpaychain.com](https://www.quantpaychain.com)
- **Credenciales Demo**: demo@quantpaychain.com / demo123
- **Integración Wallet**: MetaMask + WalletConnect compatibles

## ✨ Características Clave

### 🔐 Funcionalidad Principal
- **DocuSign Web3**: Subir documentos → Almacenamiento IPFS → Registro blockchain con timestamps inmutables
- **Flujos Multi-Firma**: Soporte para múltiples firmantes con lógica condicional
- **Autenticación Wallet**: Integración MetaMask con SIWE (Sign-In with Ethereum)
- **Seguimiento en Tiempo Real**: Monitorear estado de documentos y firmas al instante

### 💰 Monetización
- **Modelo Freemium**: 3 documentos gratuitos/mes, luego actualización
- **Plan Básico**: $99/mes para 50 documentos + características avanzadas
- **Plan Profesional**: $499/mes para 500 documentos + características empresariales

### 🌐 Soporte Multi-Idioma
- Interfaces en **Inglés** y **Español**
- Cambio dinámico de idioma
- Contenido y documentación internacionalizados

## 🏗️ Arquitectura

```
quantpay-chain-mvp/
├── frontend/app/           # Aplicación Next.js 14
│   ├── app/               # App Router (páginas y rutas API)
│   ├── components/        # Componentes UI reutilizables
│   ├── lib/              # Utilidades y configuraciones
│   └── prisma/           # Schema de base de datos y migraciones
├── contracts/            # Contratos Inteligentes Solidity
│   ├── contracts/        # DocumentRegistry.sol
│   ├── scripts/          # Scripts de deploy y pruebas
│   └── test/            # Pruebas de contratos
├── docs/                # Documentación
│   ├── whitepaper.md    # Whitepaper técnico
│   └── api/            # Documentación API
└── .github/            # Workflows CI/CD
```

### Stack Tecnológico

#### Frontend
- **Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: TailwindCSS + shadcn/ui
- **Estado**: Zustand + React Query
- **Autenticación**: NextAuth.js + SIWE
- **Blockchain**: Wagmi + RainbowKit + ethers.js
- **Internacionalización**: react-i18next

#### Backend
- **Base de Datos**: PostgreSQL + Prisma ORM
- **Almacenamiento**: IPFS vía Pinata
- **Autenticación**: JWT + Firmas Web3
- **APIs**: Endpoints REST

#### Blockchain
- **Contratos**: Solidity con OpenZeppelin
- **Redes**: Sepolia (testnet) + Ethereum/Polygon (mainnet)
- **Desarrollo**: Hardhat
- **Almacenamiento**: IPFS para documentos

## 🚀 Inicio Rápido

### Prerrequisitos

```bash
Node.js >= 18
PostgreSQL >= 13
Git
MetaMask o wallet Web3 compatible
```

### 1. Clonar e Instalar

```bash
git clone https://github.com/your-username/quantpay-chain-mvp.git
cd quantpay-chain-mvp/frontend/app
yarn install
```

### 2. Configuración de Entorno

Crear archivo `.env`:

```env
# Base de datos
DATABASE_URL="postgresql://user:password@localhost:5432/quantpay"

# Autenticación
NEXTAUTH_SECRET="tu-clave-secreta-super-segura"
NEXTAUTH_URL="http://localhost:3000"

# Almacenamiento de archivos (IPFS)
PINATA_JWT="tu-token-jwt-pinata"
NEXT_PUBLIC_PINATA_API_KEY="tu-clave-api-pinata"
NEXT_PUBLIC_PINATA_SECRET="tu-secreto-pinata"

# Web3
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID="tu-id-proyecto-walletconnect"

# Opcional: AWS S3 (almacenamiento alternativo)
AWS_BUCKET_NAME="tu-bucket-s3"
AWS_REGION="us-west-2"
AWS_ACCESS_KEY_ID="tu-clave-acceso"
AWS_SECRET_ACCESS_KEY="tu-clave-secreta"
```

### 3. Configuración de Base de Datos

```bash
# Generar cliente Prisma
npx prisma generate

# Aplicar schema de base de datos
npx prisma db push

# Poblar con datos demo
yarn prisma db seed
```

### 4. Contratos Inteligentes (Opcional)

```bash
cd ../../contracts
npm install

# Desplegar en testnet Sepolia
npx hardhat deploy --network sepolia

# Ejecutar pruebas
npx hardhat test
```

### 5. Ejecutar Servidor de Desarrollo

```bash
cd ../frontend/app
yarn dev
```

Visitar [http://localhost:3000](http://localhost:3000)

## 🌍 Despliegue en Producción

### Desplegar en Vercel (Recomendado)

1. **Enviar a GitHub**
   ```bash
   git add .
   git commit -m "Despliegue inicial"
   git push origin main
   ```

2. **Importar a Vercel**
   - Ir a [vercel.com](https://vercel.com)
   - Click "New Project" → Import from GitHub
   - Seleccionar tu repositorio
   - Establecer directorio raíz en `frontend/app`

3. **Variables de Entorno**
   Añadir todas las variables de entorno del `.env` al dashboard de Vercel

4. **Dominio Personalizado**
   - En dashboard Vercel → Settings → Domains
   - Añadir `www.quantpaychain.com`
   - Configurar DNS con tu proveedor de dominio:
     ```
     CNAME www tu-despliegue-vercel.vercel.app
     ```

## 💳 Modelo de Negocio

### Niveles Freemium

| Plan | Precio | Documentos/Mes | Características |
|------|--------|----------------|----------------|
| **Gratuito** | $0 | 3 | Verificación básica, Almacenamiento IPFS, Soporte email |
| **Básico** | $99 | 50 | Verificación avanzada, Plantillas personalizadas, Soporte prioritario, Acceso API |
| **Profesional** | $499 | 500 | Marca blanca, Análisis avanzado, Soporte 24/7, Integraciones personalizadas |

### Flujos de Ingresos
1. **Suscripciones SaaS**: Ingresos recurrentes mensuales
2. **Comisiones por Transacción**: 0.5-1% en procesamiento de documentos (empresarial)
3. **Licencias API**: Acceso API empresarial
4. **Servicios Profesionales**: Integraciones personalizadas y consultoría

## 🔧 Desarrollo

### Scripts Disponibles

```bash
# Desarrollo
yarn dev                 # Iniciar servidor dev
yarn build              # Build producción
yarn start              # Iniciar servidor producción
yarn lint               # Ejecutar ESLint
yarn type-check         # Validación TypeScript

# Base de datos
npx prisma studio       # GUI de base de datos
npx prisma db push      # Aplicar cambios de schema
npx prisma db seed      # Poblar base de datos
npx prisma generate     # Generar cliente

# Contratos
cd contracts/
npx hardhat compile     # Compilar contratos
npx hardhat test        # Ejecutar pruebas
npx hardhat deploy      # Desplegar en red
```

### Endpoints API

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `POST /api/auth/siwe` | POST | Autenticación Web3 |
| `POST /api/signup` | POST | Crear cuenta de usuario |
| `POST /api/documents/upload` | POST | Subir documento a IPFS + blockchain |
| `GET /api/documents/[id]` | GET | Obtener detalles de documento |
| `GET /api/documents/[id]/download` | GET | Descargar archivo de documento |
| `PUT /api/documents/[id]/sign` | PUT | Firmar documento |

## 🔒 Seguridad

### Medidas de Seguridad Implementadas

- **Seguridad de Contrato Inteligente**: Estándares OpenZeppelin
- **Autenticación Web3**: Protocolo SIWE
- **Cifrado de Datos**: Cifrado end-to-end para datos sensibles
- **Validación de Entrada**: Sanitización integral de entradas
- **Limitación de Tasa**: Protección de endpoints API
- **Protección CORS**: Filtrado de solicitudes cross-origin

## 📈 Monitoreo y Análisis

### Métricas Rastreadas

- Registros de usuarios y conversiones de planes
- Tasas de éxito de subida/firma de documentos
- Utilización de almacenamiento IPFS
- Costos de interacción blockchain
- Ingresos por usuario (RPU)
- Ingresos recurrentes mensuales (MRR)

## 🤝 Contribuir

1. Fork del repositorio
2. Crear rama de característica: `git checkout -b feature/caracteristica-increible`
3. Commit cambios: `git commit -m 'Añadir característica increíble'`
4. Push a rama: `git push origin feature/caracteristica-increible`
5. Abrir Pull Request

## 📋 Roadmap

### Fase 1: MVP (Actual)
- [x] Funcionalidad DocuSign Web3
- [x] Monetización freemium
- [x] Soporte multi-idioma
- [x] Dashboard básico

### Fase 2: Características Avanzadas (Q1 2025)
- [ ] App móvil (React Native)
- [ ] Dashboard de análisis avanzado
- [ ] Integraciones webhook
- [ ] Marketplace de plantillas

### Fase 3: Empresarial (Q2 2025)
- [ ] SDK API para desarrolladores
- [ ] Soluciones marca blanca
- [ ] Compliance avanzado (SOC2, HIPAA)
- [ ] SSO empresarial

### Fase 4: Multi-Chain (Q3 2025)
- [ ] Integración Polygon
- [ ] Soporte Arbitrum
- [ ] Verificación de documentos cross-chain
- [ ] Optimización Layer 2

## 🆘 Soporte y Comunidad

- **Email**: support@quantpaychain.com
- **Discord**: [Unirse a la Comunidad](https://discord.gg/quantpay)
- **Documentación**: [docs.quantpaychain.com](https://docs.quantpaychain.com)
- **Twitter**: [@QuantPayChain](https://twitter.com/quantpaychain)

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

---

**Construido con ❤️ para la comunidad Web3**

*Revolucionando las firmas digitales con tecnología blockchain*
