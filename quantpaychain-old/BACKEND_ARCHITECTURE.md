# QuantPay Chain - Backend Architecture Blueprint

**Document Version:** 1.0  
**Date:** October 24, 2025  
**Status:** Design Phase  
**Project:** QuantPay Chain MVP - Post-Quantum Protocol for Digital Contracts & Multi-Currency Payments  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current Frontend Analysis](#2-current-frontend-analysis)
3. [Proposed Backend Architecture](#3-proposed-backend-architecture)
4. [Technology Stack](#4-technology-stack)
5. [Backend Folder Structure](#5-backend-folder-structure)
6. [Data Models & Database Schema](#6-data-models--database-schema)
7. [API Endpoints Specification](#7-api-endpoints-specification)
8. [Specific Modules](#8-specific-modules)
9. [MVP User Flow](#9-mvp-user-flow)
10. [Security & Authentication](#10-security--authentication)
11. [Implementation Roadmap](#11-implementation-roadmap)

---

## 1. Executive Summary

### 1.1 Project Vision

QuantPay Chain is a **post-quantum secure protocol** for institutional digital finance, focusing on:
- **Tokenization of real-world assets (RWA)**: Fractional ownership of real estate properties
- **Multi-currency payments**: Stripe (USD) + Blockchain (USDC/stablecoins) integration
- **Smart digital contracts**: Auto-generated, legally-binding documents
- **AI Auditor**: Automated contract analysis and compliance monitoring
- **Post-Quantum Cryptography**: Future-proof security with NIST-approved algorithms

### 1.2 Current State

**Frontend Status:**
- ✅ NextJS 14 application deployed on Vercel (quantpaychain.com)
- ✅ Landing page, authentication (email + Web3), dashboard structure
- ✅ UI/UX with shadcn/ui components, dark/light theme, i18n (EN/ES)
- ⚠️ Currently focused on document signing (DocuSign-like)
- ⚠️ Database (Prisma) disabled, using mock data

**Smart Contracts:**
- ✅ DocumentRegistry.sol, PermissionedToken.sol, Dividends.sol
- ✅ 220+ tests passing
- ❌ Not deployed to any testnet/mainnet

**Backend:**
- ❌ No backend implementation
- ❌ No real payment processing
- ❌ No RWA tokenization logic
- ❌ No AI integration

### 1.3 MVP Goals (60-Second User Flow)

**Critical Path:**
1. User browses property marketplace (5 seconds)
2. Selects property, chooses investment amount (10 seconds)
3. Payment with Stripe (USD) or MetaMask (USDC) (15 seconds)
4. Automatic contract generation (10 seconds)
5. PQC-signed digital contract + ownership NFT minted (15 seconds)
6. Dashboard showing investment status and returns (5 seconds)

**Total: 60 seconds from landing to ownership**

### 1.4 Backend Priorities

1. **Property Marketplace API**: CRUD for properties, fractional shares
2. **Payment Processing**: Stripe integration (sandbox) + blockchain (testnet USDC)
3. **Contract Generation**: Dynamic PDF/HTML contract templates
4. **PQC Module**: liboqs integration for quantum-resistant signatures
5. **AI Auditor**: Basic LLM integration for contract analysis
6. **Smart Contract Bridge**: Interaction with deployed Ethereum contracts

---

## 2. Current Frontend Analysis

### 2.1 Existing Structure

```
quantpaychain-mvp/frontend/app/
├── app/
│   ├── api/                    # API Routes (Next.js)
│   │   ├── auth/              # NextAuth handlers
│   │   ├── documents/         # Document upload/download (STUBS)
│   │   ├── demo/              # Demo simulation endpoints
│   │   ├── health/            # Health check
│   │   └── signup/            # User registration
│   ├── auth/                  # Auth pages (signin, signup)
│   ├── dashboard/             # User dashboard
│   │   └── _components/       # Dashboard components
│   ├── demo/                  # Interactive demo page
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing page
├── components/
│   ├── dashboard/             # Document upload, list, stats
│   └── ui/                    # shadcn/ui components (60+)
├── lib/
│   ├── auth-config.ts         # NextAuth configuration
│   ├── blockchain.ts          # Web3 interaction (STUB)
│   ├── db.ts                  # Prisma client (DISABLED)
│   ├── wagmi-config.ts        # Wagmi/RainbowKit setup
│   └── utils.ts               # Utilities
├── locales/                   # i18n translations (EN/ES)
├── prisma/
│   └── schema.prisma          # Database schema (DEFINED)
└── types/                     # TypeScript types
```

### 2.2 Current Features

#### Authentication
- **NextAuth.js**: Email/password + SIWE (Sign-In With Ethereum)
- **Mock data**: No database persistence
- **Session**: JWT-based, no database adapter

#### Dashboard
- **Document Upload**: Stub returning mock data
- **Document List**: Empty state or mock documents
- **Usage Stats**: Freemium model (3 docs free, 50 starter, 500 professional)
- **Wallet Connect**: RainbowKit integration (MetaMask, WalletConnect)

#### Landing Page (app/page.tsx)
- **Hero**: Post-quantum security messaging
- **Features**: 6 core features (PQC, contracts, multi-currency, RWA, ISO 20022, cross-chain)
- **Technical Highlights**: Security, performance, compliance
- **Enterprise Solutions**: Asset managers, banks, enterprises
- **Use Cases**: Real estate, trade finance, payments, identity
- **Testimonials**: Mock institutional quotes
- **Roadmap**: Q4 2025 - Q4 2026 phases
- **CTA**: "Request Demo" and "Try Interactive Demo"

#### Smart Contracts Integration
- **DocumentRegistry**: ABI defined, but no live deployment
- **Contract Functions**: registerDocument, signDocument, getDocument, getUserDocuments
- **Network Support**: Sepolia, Mainnet, Polygon (placeholder addresses)

### 2.3 Prisma Schema (Existing Models)

```prisma
- User: id, email, name, password, walletAddress, plan
- Account/Session: NextAuth models
- Document: id, title, fileName, ipfsHash, blockchainId, status (DRAFT/PENDING/SIGNED/...)
- Signature: id, documentId, signerId, status, transactionHash
- UsageLog: tracking user actions
- ApiKey: API key management
```

**Gap Analysis:**
- ❌ No Property model
- ❌ No Investment/Transaction model
- ❌ No Payment model (Stripe/crypto)
- ❌ No Contract template model
- ❌ No Dividend/Returns model

### 2.4 Key Integration Points

The backend must integrate with:

1. **Frontend Pages**:
   - `/dashboard`: Property portfolio, investment history
   - `/marketplace`: Browse properties (NEW PAGE NEEDED)
   - `/property/[id]`: Property details + invest (NEW PAGE NEEDED)
   - `/contracts`: View generated contracts (NEW PAGE NEEDED)

2. **Existing API Routes**:
   - `/api/auth/*`: Authentication (already working)
   - `/api/documents/*`: Repurpose for contracts
   - `/api/demo/*`: Keep for demo purposes

3. **New API Routes Needed**:
   - `/api/properties/*`: Property marketplace
   - `/api/investments/*`: Investment management
   - `/api/payments/*`: Payment processing
   - `/api/contracts/*`: Contract generation
   - `/api/pqc/*`: Post-quantum cryptography operations
   - `/api/ai/*`: AI auditor endpoints

4. **Web3 Integration**:
   - Smart contract deployment and interaction
   - NFT minting for ownership
   - Transaction monitoring

---

## 3. Proposed Backend Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                        │
│  Landing Page │ Marketplace │ Property Details │ Dashboard       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway (Next.js API Routes)           │
│  /api/properties  │  /api/investments  │  /api/payments         │
│  /api/contracts   │  /api/pqc          │  /api/ai               │
└────────────┬──────────────────────────────────────────────────┬─┘
             │                                                   │
             ▼                                                   ▼
┌────────────────────────────┐              ┌────────────────────────────┐
│    Business Logic Layer    │              │   External Integrations    │
├────────────────────────────┤              ├────────────────────────────┤
│ • Property Service         │              │ • Stripe (Payments)        │
│ • Investment Service       │              │ • Pinata (IPFS)            │
│ • Payment Service          │              │ • OpenAI/Anthropic (AI)    │
│ • Contract Service         │              │ • Alchemy (Blockchain RPC) │
│ • PQC Service              │              │ • Chainalysis (AML)        │
│ • AI Auditor Service       │              │ • SendGrid (Email)         │
│ • Blockchain Bridge        │              │ • AWS S3 (Storage)         │
└────────────┬───────────────┘              └────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Data Access Layer (Prisma ORM)               │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Database (PostgreSQL)                         │
│  Users │ Properties │ Investments │ Contracts │ Transactions    │
└─────────────────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Smart Contracts (Ethereum)                    │
│  PropertyToken.sol │ InvestmentManager.sol │ PQC Verifier      │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Component Diagram

```
┌───────────────────────────────────────────────────────────────────────┐
│                           Frontend Layer                              │
├───────────────────────────────────────────────────────────────────────┤
│  React Components → API Client (fetch/axios) → State Management       │
└───────────────┬───────────────────────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────────────────┐
│                          API Layer (Backend)                          │
├───────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │
│  │ Properties  │  │ Investments │  │  Payments   │  │  Contracts │  │
│  │   Routes    │  │    Routes   │  │   Routes    │  │   Routes   │  │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬─────┘  │
│         │                │                │                │          │
│         └────────────────┴────────────────┴────────────────┘          │
│                                │                                       │
└────────────────────────────────┼───────────────────────────────────────┘
                                 │
                                 ▼
┌───────────────────────────────────────────────────────────────────────┐
│                        Services Layer                                 │
├───────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌──────────────────┐    ┌──────────────────┐    ┌─────────────────┐ │
│  │ PropertyService  │    │ PaymentService   │    │ ContractService │ │
│  ├──────────────────┤    ├──────────────────┤    ├─────────────────┤ │
│  │ • CRUD           │    │ • Stripe API     │    │ • Template Gen  │ │
│  │ • Listing Logic  │    │ • Crypto Payment │    │ • PDF Creation  │ │
│  │ • Filtering      │    │ • Refunds        │    │ • IPFS Upload   │ │
│  └──────────────────┘    └──────────────────┘    └─────────────────┘ │
│                                                                        │
│  ┌──────────────────┐    ┌──────────────────┐    ┌─────────────────┐ │
│  │InvestmentService │    │   PQCService     │    │  AIAuditor      │ │
│  ├──────────────────┤    ├──────────────────┤    ├─────────────────┤ │
│  │ • Create         │    │ • liboqs wrapper │    │ • LLM API       │ │
│  │ • Update Status  │    │ • Signature Gen  │    │ • Contract Parse│ │
│  │ • Calculate ROI  │    │ • Verification   │    │ • Risk Analysis │ │
│  └──────────────────┘    └──────────────────┘    └─────────────────┘ │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │            BlockchainBridge Service                              │ │
│  ├──────────────────────────────────────────────────────────────────┤ │
│  │ • Smart Contract Interaction (ethers.js/viem)                    │ │
│  │ • Transaction Monitoring                                         │ │
│  │ • Event Listening                                                │ │
│  │ • NFT Minting                                                    │ │
│  └──────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌───────────────────────────────────────────────────────────────────────┐
│                      Data Layer (Prisma + PostgreSQL)                 │
├───────────────────────────────────────────────────────────────────────┤
│  Models: User, Property, Investment, Payment, Contract, Transaction   │
└───────────────────────────────────────────────────────────────────────┘
```

### 3.3 Data Flow Diagram (Investment Flow)

```
User → Frontend → API → Service Layer → Database/Blockchain
  │                                           │
  └─────────────────┬─────────────────────────┘
                    ▼
            ┌────────────────┐
            │ 1. Browse Props│
            └───────┬────────┘
                    │
                    ▼
            ┌────────────────┐
            │ 2. Select Prop │
            └───────┬────────┘
                    │
                    ▼
            ┌────────────────────┐
            │ 3. Choose Amount   │
            │ (Fractional Shares)│
            └───────┬────────────┘
                    │
                    ▼
            ┌────────────────────┐
            │ 4. Payment Method  │
            │ (Stripe / MetaMask)│
            └───────┬────────────┘
                    │
          ┌─────────┴──────────┐
          │                    │
          ▼                    ▼
  ┌────────────────┐  ┌────────────────┐
  │ Stripe Payment │  │ Crypto Payment │
  │ (USD)          │  │ (USDC)         │
  └───────┬────────┘  └───────┬────────┘
          │                    │
          └─────────┬──────────┘
                    │
                    ▼
            ┌────────────────────┐
            │ 5. Payment Success │
            │ → Create Investment│
            └───────┬────────────┘
                    │
                    ▼
            ┌────────────────────┐
            │ 6. Generate Contract│
            │ (AI + Template)    │
            └───────┬────────────┘
                    │
                    ▼
            ┌────────────────────┐
            │ 7. PQC Signature   │
            │ (liboqs)           │
            └───────┬────────────┘
                    │
                    ▼
            ┌────────────────────┐
            │ 8. Mint NFT        │
            │ (Smart Contract)   │
            └───────┬────────────┘
                    │
                    ▼
            ┌────────────────────┐
            │ 9. AI Audit        │
            │ (Contract Review)  │
            └───────┬────────────┘
                    │
                    ▼
            ┌────────────────────┐
            │ 10. Dashboard Update│
            │ (Investment Active)│
            └────────────────────┘
```

---

## 4. Technology Stack

### 4.1 Core Backend Stack

```javascript
{
  "runtime": "Node.js 22.x",
  "framework": "Next.js 14 API Routes + Express.js (optional microservices)",
  "language": "TypeScript 5.x",
  "orm": "Prisma 5.x",
  "database": "PostgreSQL 16.x",
  "validation": "Zod 3.x",
  "testing": "Jest + Supertest"
}
```

**Rationale:**
- **Node.js 22.x**: Already used in frontend, LTS support, excellent ecosystem
- **Next.js API Routes**: Simplifies deployment, built-in API handling, edge functions
- **TypeScript**: Type safety, better DX, catches errors at compile time
- **Prisma**: Type-safe ORM, excellent DX, migrations, works with PostgreSQL
- **PostgreSQL**: ACID compliance, JSON support, robust for financial data
- **Zod**: Schema validation, integrates with Prisma, type inference

### 4.2 Payment Processing

```javascript
{
  "fiat": "Stripe SDK (stripe npm package)",
  "crypto": {
    "stablecoins": "USDC, USDT (ERC-20)",
    "networks": "Ethereum (Sepolia testnet), Polygon",
    "provider": "Alchemy SDK / Ethers.js 6.x / Viem",
    "wallets": "MetaMask, WalletConnect (RainbowKit)"
  },
  "conversion": "CoinGecko API (for price feeds)"
}
```

**Implementation:**
- **Stripe**: Sandbox mode for MVP, webhook for payment confirmations
- **Crypto**: Direct smart contract calls for USDC transfers
- **Atomic swaps**: For multi-currency scenarios (future)

### 4.3 Storage & IPFS

```javascript
{
  "ipfs": "Pinata Cloud (pinata npm package)",
  "documents": "AWS S3 (backup) or IPFS only",
  "database": "PostgreSQL (metadata)",
  "caching": "Redis (optional for MVP, recommended for production)"
}
```

**Strategy:**
- **Contracts**: Store generated PDFs on IPFS via Pinata
- **Metadata**: Database stores IPFS hash + document metadata
- **Backup**: Optional S3 for critical documents

### 4.4 Post-Quantum Cryptography (PQC)

```javascript
{
  "library": "liboqs (Open Quantum Safe)",
  "algorithms": {
    "signatures": "Dilithium3 (NIST FIPS 204)",
    "backup": "SPHINCS+ (hash-based)"
  },
  "integration": "Node.js native addon or WASM",
  "wrapper": "Custom TypeScript wrapper for easy API"
}
```

**Implementation:**
- **liboqs**: C library with Node.js bindings
- **Dilithium3**: Primary signature algorithm (AES-192 security)
- **Use cases**: Sign contracts, verify user signatures, audit trails

**MVP Simplification:**
- Use **classical ECDSA** initially, PQC as "seal" (visual badge)
- Full PQC implementation in Phase 2

### 4.5 AI Auditor

```javascript
{
  "llm": "OpenAI GPT-4 or Anthropic Claude",
  "sdk": "@anthropic-ai/sdk or openai npm package",
  "prompt_engineering": "Custom prompts for contract analysis",
  "output": "JSON structured response (clauses, risks, compliance)"
}
```

**Functionality:**
- **Contract Parsing**: Extract clauses from generated contract
- **Risk Analysis**: Identify potential legal issues
- **Compliance Check**: Basic regulatory compliance (not legal advice)
- **Summary**: User-friendly explanation of contract terms

**MVP Implementation:**
- Simple prompt: "Analyze this investment contract and list key clauses"
- Response: Bullet points of clauses and brief risk assessment

### 4.6 Blockchain Integration

```javascript
{
  "smart_contracts": "Solidity 0.8.20",
  "deployment": "Hardhat 2.x",
  "interaction": "Ethers.js 6.x or Viem 2.x",
  "networks": {
    "testnet": "Sepolia (Ethereum), Mumbai (Polygon)",
    "mainnet": "Ethereum L1 (expensive) or Polygon/Arbitrum L2"
  },
  "rpc_provider": "Alchemy or Infura",
  "indexing": "The Graph (optional) or direct event logs"
}
```

**Smart Contracts Needed:**
1. **PropertyToken.sol**: ERC-721 or ERC-1155 for fractional ownership NFTs
2. **InvestmentManager.sol**: Manages investments, payments, dividends
3. **DocumentRegistry.sol**: (Already exists) Repurpose for contracts
4. **PQCVerifier.sol**: On-chain verification of PQC signatures (advanced)

**MVP Simplification:**
- Deploy **PropertyToken** and **InvestmentManager** to Sepolia
- Use existing **DocumentRegistry** for contract hashes
- Skip on-chain PQC verification (too complex for MVP)

### 4.7 Development & DevOps

```javascript
{
  "version_control": "Git (GitHub)",
  "ci_cd": "GitHub Actions (already configured)",
  "deployment": {
    "frontend": "Vercel (already deployed)",
    "backend": "Vercel Serverless Functions or Railway/Render",
    "database": "Supabase, Neon, or Railway PostgreSQL"
  },
  "monitoring": "Sentry (errors), Vercel Analytics (performance)",
  "logging": "Winston or Pino",
  "environment": ".env files + Vercel Environment Variables"
}
```

---

## 5. Backend Folder Structure

```
quantpaychain-mvpro/
├── quantpaychain-mvp/
│   ├── backend/                          # NEW BACKEND DIRECTORY
│   │   ├── src/
│   │   │   ├── services/                 # Business Logic Layer
│   │   │   │   ├── PropertyService.ts
│   │   │   │   ├── InvestmentService.ts
│   │   │   │   ├── PaymentService.ts
│   │   │   │   ├── ContractService.ts
│   │   │   │   ├── PQCService.ts
│   │   │   │   ├── AIAuditorService.ts
│   │   │   │   └── BlockchainBridge.ts
│   │   │   │
│   │   │   ├── lib/                      # Utilities & Helpers
│   │   │   │   ├── prisma.ts             # Prisma client instance
│   │   │   │   ├── stripe.ts             # Stripe client
│   │   │   │   ├── pinata.ts             # IPFS client
│   │   │   │   ├── openai.ts             # AI client
│   │   │   │   ├── blockchain.ts         # Web3 utilities
│   │   │   │   ├── pqc-wrapper.ts        # liboqs wrapper
│   │   │   │   ├── validators.ts         # Zod schemas
│   │   │   │   └── logger.ts             # Logging utility
│   │   │   │
│   │   │   ├── types/                    # TypeScript types
│   │   │   │   ├── property.ts
│   │   │   │   ├── investment.ts
│   │   │   │   ├── payment.ts
│   │   │   │   ├── contract.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── templates/                # Contract Templates
│   │   │   │   ├── investment-contract.hbs  # Handlebars template
│   │   │   │   ├── property-agreement.hbs
│   │   │   │   └── styles.css            # PDF styling
│   │   │   │
│   │   │   └── config/                   # Configuration
│   │   │       ├── constants.ts
│   │   │       ├── networks.ts           # Blockchain networks
│   │   │       └── abis/                 # Smart contract ABIs
│   │   │           ├── PropertyToken.json
│   │   │           ├── InvestmentManager.json
│   │   │           └── DocumentRegistry.json
│   │   │
│   │   ├── tests/                        # Backend Tests
│   │   │   ├── unit/
│   │   │   │   ├── services/
│   │   │   │   └── lib/
│   │   │   ├── integration/
│   │   │   └── e2e/
│   │   │
│   │   ├── scripts/                      # Utility Scripts
│   │   │   ├── seed-properties.ts        # Seed demo properties
│   │   │   ├── deploy-contracts.ts       # Deploy smart contracts
│   │   │   └── test-pqc.ts               # Test PQC integration
│   │   │
│   │   ├── package.json                  # Backend dependencies
│   │   ├── tsconfig.json                 # TypeScript config
│   │   └── README.md                     # Backend documentation
│   │
│   ├── frontend/app/                     # EXISTING FRONTEND
│   │   ├── app/
│   │   │   ├── api/                      # Next.js API Routes (ENHANCED)
│   │   │   │   ├── properties/           # NEW
│   │   │   │   │   ├── route.ts          # GET /api/properties (list)
│   │   │   │   │   └── [id]/
│   │   │   │   │       ├── route.ts      # GET /api/properties/:id
│   │   │   │   │       └── invest/
│   │   │   │   │           └── route.ts  # POST /api/properties/:id/invest
│   │   │   │   │
│   │   │   │   ├── investments/          # NEW
│   │   │   │   │   ├── route.ts          # GET /api/investments
│   │   │   │   │   └── [id]/
│   │   │   │   │       ├── route.ts      # GET /api/investments/:id
│   │   │   │   │       └── status/
│   │   │   │   │           └── route.ts  # PATCH /api/investments/:id/status
│   │   │   │   │
│   │   │   │   ├── payments/             # NEW
│   │   │   │   │   ├── stripe/
│   │   │   │   │   │   ├── intent/       # POST /api/payments/stripe/intent
│   │   │   │   │   │   │   └── route.ts
│   │   │   │   │   │   └── webhook/      # POST /api/payments/stripe/webhook
│   │   │   │   │   │       └── route.ts
│   │   │   │   │   └── crypto/
│   │   │   │   │       └── route.ts      # POST /api/payments/crypto
│   │   │   │   │
│   │   │   │   ├── contracts/            # NEW
│   │   │   │   │   ├── generate/
│   │   │   │   │   │   └── route.ts      # POST /api/contracts/generate
│   │   │   │   │   ├── [id]/
│   │   │   │   │   │   ├── route.ts      # GET /api/contracts/:id
│   │   │   │   │   │   ├── sign/
│   │   │   │   │   │   │   └── route.ts  # POST /api/contracts/:id/sign
│   │   │   │   │   │   └── download/
│   │   │   │   │   │       └── route.ts  # GET /api/contracts/:id/download
│   │   │   │   │   └── audit/
│   │   │   │   │       └── route.ts      # POST /api/contracts/audit
│   │   │   │   │
│   │   │   │   ├── pqc/                  # NEW
│   │   │   │   │   ├── sign/
│   │   │   │   │   │   └── route.ts      # POST /api/pqc/sign
│   │   │   │   │   └── verify/
│   │   │   │   │       └── route.ts      # POST /api/pqc/verify
│   │   │   │   │
│   │   │   │   ├── ai/                   # NEW
│   │   │   │   │   └── audit/
│   │   │   │   │       └── route.ts      # POST /api/ai/audit
│   │   │   │   │
│   │   │   │   ├── auth/                 # EXISTING (enhance)
│   │   │   │   ├── documents/            # EXISTING (repurpose)
│   │   │   │   ├── demo/                 # EXISTING (keep)
│   │   │   │   └── health/               # EXISTING
│   │   │   │
│   │   │   ├── marketplace/              # NEW PAGE
│   │   │   │   └── page.tsx              # Property marketplace
│   │   │   │
│   │   │   ├── property/                 # NEW PAGE
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx          # Property details + invest
│   │   │   │
│   │   │   ├── investments/              # NEW PAGE
│   │   │   │   └── page.tsx              # User investments dashboard
│   │   │   │
│   │   │   ├── contracts/                # NEW PAGE
│   │   │   │   ├── page.tsx              # Contract list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx          # Contract viewer
│   │   │   │
│   │   │   └── (existing pages: dashboard, demo, auth, etc.)
│   │   │
│   │   └── (components, lib, prisma - EXISTING, enhance as needed)
│   │
│   ├── contracts/                        # EXISTING SMART CONTRACTS
│   │   └── contracts/
│   │       ├── DocumentRegistry.sol      # EXISTING
│   │       ├── PermissionedToken.sol     # EXISTING
│   │       ├── Dividends.sol             # EXISTING
│   │       ├── PropertyToken.sol         # NEW (ERC-721/1155)
│   │       └── InvestmentManager.sol     # NEW
│   │
│   └── docs/                             # EXISTING DOCUMENTATION
│
└── BACKEND_ARCHITECTURE.md               # THIS DOCUMENT
```

### 5.1 Key Design Decisions

1. **Monorepo Structure**: Keep frontend and backend in same repo for easier development
2. **Service Layer Pattern**: Business logic separated from API routes
3. **API Routes in Frontend**: Use Next.js API routes for simplicity, avoid separate backend server
4. **Shared Prisma**: Frontend and backend share same Prisma schema
5. **TypeScript Everywhere**: Type safety across the stack

### 5.2 Alternative: Separate Backend Server

If Next.js API routes become limiting, backend can be extracted to Express.js:

```
backend/
├── src/
│   ├── routes/           # Express routes
│   ├── controllers/      # Route handlers
│   ├── services/         # Business logic
│   ├── middleware/       # Auth, validation, etc.
│   └── server.ts         # Express app
├── package.json
└── tsconfig.json
```

**Recommendation**: Start with Next.js API routes, migrate if needed.

---

## 6. Data Models & Database Schema

### 6.1 Enhanced Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============= EXISTING MODELS (Enhanced) =============

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  firstName     String?
  lastName      String?
  password      String?
  emailVerified DateTime?
  image         String?
  
  // Wallet & Blockchain
  walletAddress String?   @unique
  
  // Subscription & Limits
  plan          String    @default("free") // free, starter, professional
  
  // KYC & Compliance
  kycStatus     KYCStatus @default(PENDING)
  kycVerifiedAt DateTime?
  isAccredited  Boolean   @default(false) // Accredited investor status
  
  // Timestamps
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  accounts      Account[]
  sessions      Session[]
  properties    Property[]        @relation("PropertyOwner")
  investments   Investment[]
  payments      Payment[]
  contracts     Contract[]
  signatures    Signature[]
  usageLogs     UsageLog[]
  apiKeys       ApiKey[]

  @@index([email])
  @@index([walletAddress])
}

enum KYCStatus {
  PENDING
  VERIFIED
  REJECTED
  EXPIRED
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ============= NEW MODELS FOR RWA TOKENIZATION =============

model Property {
  id                String         @id @default(cuid())
  
  // Basic Info
  title             String
  description       String         @db.Text
  address           String
  city              String
  state             String?
  country           String
  zipCode           String?
  
  // Property Details
  propertyType      PropertyType   // RESIDENTIAL, COMMERCIAL, etc.
  totalValue        Decimal        @db.Decimal(18, 2) // Total property valuation
  totalShares       Int            // Total fractional shares (e.g., 1000)
  sharePrice        Decimal        @db.Decimal(18, 2) // Price per share
  availableShares   Int            // Remaining shares available
  
  // Financial
  expectedROI       Decimal?       @db.Decimal(5, 2) // Annual ROI percentage
  rentalYield       Decimal?       @db.Decimal(5, 2) // Annual rental yield
  minimumInvestment Decimal        @db.Decimal(18, 2) // Minimum investment amount
  
  // Media
  images            String[]       // Array of image URLs
  documents         String[]       // Legal documents, prospectus
  virtualTourUrl    String?
  
  // Blockchain
  tokenContractAddress String?     @unique // ERC-721/1155 contract
  ipfsMetadataHash     String?     // IPFS hash for property metadata
  blockchainId         String?     @unique
  
  // Status
  status            PropertyStatus @default(DRAFT)
  featured          Boolean        @default(false)
  
  // Timestamps
  listingDate       DateTime?
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt

  // Relations
  owner             User           @relation("PropertyOwner", fields: [ownerId], references: [id])
  ownerId           String
  investments       Investment[]
  dividends         Dividend[]

  @@index([status])
  @@index([propertyType])
  @@index([city, country])
  @@index([createdAt])
}

enum PropertyType {
  RESIDENTIAL
  COMMERCIAL
  INDUSTRIAL
  MIXED_USE
  LAND
}

enum PropertyStatus {
  DRAFT
  PENDING_APPROVAL
  ACTIVE
  FULLY_FUNDED
  PAUSED
  CLOSED
}

model Investment {
  id                String            @id @default(cuid())
  
  // Investment Details
  propertyId        String
  userId            String
  shares            Int               // Number of shares purchased
  investmentAmount  Decimal           @db.Decimal(18, 2) // USD equivalent
  sharePrice        Decimal           @db.Decimal(18, 2) // Price at purchase
  
  // Payment
  paymentMethod     PaymentMethod
  paymentId         String?           // Reference to Payment model
  currency          String            // USD, USDC, ETH, etc.
  
  // Blockchain
  nftTokenId        String?           // NFT representing ownership
  transactionHash   String?           // Blockchain tx hash
  
  // Contract
  contractId        String?           // Generated contract
  contractSigned    Boolean           @default(false)
  contractSignedAt  DateTime?
  
  // Status & Returns
  status            InvestmentStatus  @default(PENDING)
  totalReturns      Decimal           @default(0) @db.Decimal(18, 2)
  
  // Timestamps
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt

  // Relations
  property          Property          @relation(fields: [propertyId], references: [id])
  user              User              @relation(fields: [userId], references: [id])
  payment           Payment?          @relation(fields: [paymentId], references: [id])
  contract          Contract?         @relation(fields: [contractId], references: [id])
  dividends         Dividend[]

  @@index([propertyId])
  @@index([userId])
  @@index([status])
  @@index([createdAt])
}

enum PaymentMethod {
  STRIPE_CARD
  STRIPE_BANK
  CRYPTO_USDC
  CRYPTO_USDT
  CRYPTO_ETH
  BANK_WIRE
}

enum InvestmentStatus {
  PENDING           // Payment initiated
  PROCESSING        // Payment processing
  COMPLETED         // Investment active
  FAILED            // Payment failed
  REFUNDED          // Investment refunded
  EXITED            // User sold shares
}

model Payment {
  id                String        @id @default(cuid())
  
  // Payment Details
  userId            String
  amount            Decimal       @db.Decimal(18, 2)
  currency          String        // USD, USDC, ETH
  method            PaymentMethod
  
  // Stripe
  stripePaymentIntentId String?   @unique
  stripeStatus          String?   // succeeded, failed, etc.
  
  // Crypto
  transactionHash       String?   @unique
  fromAddress           String?
  toAddress             String?
  blockNumber           Int?
  
  // Status
  status            PaymentStatus @default(PENDING)
  
  // Metadata
  metadata          Json?         // Additional payment info
  
  // Timestamps
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
  completedAt       DateTime?

  // Relations
  user              User          @relation(fields: [userId], references: [id])
  investments       Investment[]

  @@index([userId])
  @@index([status])
  @@index([stripePaymentIntentId])
  @@index([transactionHash])
}

enum PaymentStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  REFUNDED
  CANCELLED
}

model Contract {
  id                String         @id @default(cuid())
  
  // Contract Details
  title             String
  type              ContractType
  version           String         @default("1.0")
  
  // Content
  content           String         @db.Text // HTML/Markdown content
  pdfUrl            String?        // PDF download URL
  ipfsHash          String?        // IPFS storage
  
  // Parties
  creatorId         String
  partiesJson       Json           // Array of parties (name, address, email, walletAddress)
  
  // PQC Signature
  pqcSignature      String?        @db.Text // Dilithium signature
  pqcPublicKey      String?        @db.Text
  pqcAlgorithm      String?        // DILITHIUM3, SPHINCS+
  
  // AI Audit
  aiAuditResult     Json?          // AI analysis result
  aiAuditedAt       DateTime?
  
  // Status
  status            ContractStatus @default(DRAFT)
  
  // Timestamps
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  signedAt          DateTime?
  expiresAt         DateTime?

  // Relations
  creator           User           @relation(fields: [creatorId], references: [id])
  investments       Investment[]
  signatures        Signature[]

  @@index([creatorId])
  @@index([status])
  @@index([type])
}

enum ContractType {
  INVESTMENT_AGREEMENT
  PROPERTY_TRANSFER
  DIVIDEND_DISTRIBUTION
  SHAREHOLDER_AGREEMENT
  GENERAL
}

enum ContractStatus {
  DRAFT
  PENDING_SIGNATURE
  SIGNED
  ACTIVE
  EXPIRED
  REVOKED
}

model Signature {
  id                String            @id @default(cuid())
  
  // Signature Details
  contractId        String
  userId            String?           // Null if external signer
  signerName        String
  signerEmail       String?
  signerAddress     String?           // Wallet address
  
  // Signature Data
  signatureType     SignatureType
  signatureData     String            @db.Text // ECDSA, PQC, or biometric data
  ipfsHash          String?
  transactionHash   String?           // Blockchain tx if on-chain
  
  // Status
  status            SignatureStatus   @default(PENDING)
  
  // Timestamps
  createdAt         DateTime          @default(now())
  signedAt          DateTime?

  // Relations
  contract          Contract          @relation(fields: [contractId], references: [id], onDelete: Cascade)
  user              User?             @relation(fields: [userId], references: [id])

  @@index([contractId])
  @@index([userId])
  @@index([status])
}

enum SignatureType {
  ECDSA
  DILITHIUM
  SPHINCS_PLUS
  BIOMETRIC
  EMAIL_VERIFICATION
}

enum SignatureStatus {
  PENDING
  SIGNED
  REJECTED
  EXPIRED
}

model Dividend {
  id                String   @id @default(cuid())
  
  // Dividend Details
  propertyId        String
  investmentId      String?  // If specific to one investment
  amount            Decimal  @db.Decimal(18, 2)
  currency          String   @default("USD")
  
  // Distribution
  distributionDate  DateTime
  transactionHash   String?  // Blockchain tx for distribution
  
  // Status
  status            DividendStatus @default(PENDING)
  
  // Timestamps
  createdAt         DateTime @default(now())
  paidAt            DateTime?

  // Relations
  property          Property @relation(fields: [propertyId], references: [id])
  investment        Investment? @relation(fields: [investmentId], references: [id])

  @@index([propertyId])
  @@index([investmentId])
  @@index([status])
}

enum DividendStatus {
  PENDING
  PROCESSING
  PAID
  FAILED
}

// ============= UTILITY MODELS =============

model UsageLog {
  id        String   @id @default(cuid())
  userId    String
  action    String   // 'property_created', 'investment_made', 'contract_signed', etc.
  metadata  Json?
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([createdAt])
}

model ApiKey {
  id        String   @id @default(cuid())
  userId    String
  name      String
  key       String   @unique
  isActive  Boolean  @default(true)
  lastUsed  DateTime?
  createdAt DateTime @default(now())
  expiresAt DateTime?

  @@index([userId])
  @@index([key])
}

model AuditLog {
  id        String   @id @default(cuid())
  action    String   // 'payment_received', 'contract_generated', etc.
  entity    String   // 'Investment', 'Contract', etc.
  entityId  String
  userId    String?
  metadata  Json?
  createdAt DateTime @default(now())

  @@index([entity, entityId])
  @@index([userId])
  @@index([createdAt])
}
```

### 6.2 Data Model Relationships

```
User
 ├─ has many Properties (as owner)
 ├─ has many Investments
 ├─ has many Payments
 ├─ has many Contracts (as creator)
 └─ has many Signatures

Property
 ├─ belongs to User (owner)
 ├─ has many Investments
 └─ has many Dividends

Investment
 ├─ belongs to Property
 ├─ belongs to User
 ├─ has one Payment
 ├─ has one Contract
 └─ has many Dividends

Payment
 ├─ belongs to User
 └─ has many Investments

Contract
 ├─ belongs to User (creator)
 ├─ has many Signatures
 └─ has many Investments

Dividend
 ├─ belongs to Property
 └─ belongs to Investment (optional)
```

### 6.3 Database Indexes

**Performance-Critical Queries:**
1. List active properties: `WHERE status = 'ACTIVE' ORDER BY createdAt DESC`
2. User investments: `WHERE userId = ? ORDER BY createdAt DESC`
3. Property investments: `WHERE propertyId = ?`
4. Payment lookup: `WHERE stripePaymentIntentId = ?` or `WHERE transactionHash = ?`

**Indexes Created:**
- User: email, walletAddress
- Property: status, propertyType, (city, country), createdAt
- Investment: propertyId, userId, status, createdAt
- Payment: userId, status, stripePaymentIntentId, transactionHash
- Contract: creatorId, status, type
- Signature: contractId, userId, status

---

## 7. API Endpoints Specification

### 7.1 Properties API

#### **GET /api/properties**
List all active properties with filtering and pagination.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20, max: 100)
- `type` (PropertyType, optional)
- `city` (string, optional)
- `country` (string, optional)
- `minPrice` (number, optional)
- `maxPrice` (number, optional)
- `status` (PropertyStatus, default: ACTIVE)
- `featured` (boolean, optional)

**Response (200):**
```json
{
  "data": [
    {
      "id": "prop_abc123",
      "title": "Luxury Apartment Downtown",
      "description": "Modern 3BR apartment...",
      "address": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "country": "USA",
      "propertyType": "RESIDENTIAL",
      "totalValue": 500000,
      "totalShares": 1000,
      "sharePrice": 500,
      "availableShares": 750,
      "expectedROI": 8.5,
      "rentalYield": 6.2,
      "minimumInvestment": 500,
      "images": ["https://media.istockphoto.com/id/2155879454/photo/this-is-an-exterior-photo-of-a-home-for-sale-in-beverly-hills-ca.jpg?s=612x612&w=0&k=20&c=uSKacMQvmaYX5Pf5Br7pUfErYQbNt_UWXRTjfwrdSDQ=", ...],
      "status": "ACTIVE",
      "featured": true,
      "listingDate": "2025-10-20T10:00:00Z",
      "createdAt": "2025-10-15T08:00:00Z"
    },
    ...
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

#### **GET /api/properties/:id**
Get detailed information about a specific property.

**Response (200):**
```json
{
  "id": "prop_abc123",
  "title": "Luxury Apartment Downtown",
  "description": "Full description...",
  "address": "123 Main St",
  "city": "San Francisco",
  "state": "CA",
  "country": "USA",
  "zipCode": "94102",
  "propertyType": "RESIDENTIAL",
  "totalValue": 500000,
  "totalShares": 1000,
  "sharePrice": 500,
  "availableShares": 750,
  "expectedROI": 8.5,
  "rentalYield": 6.2,
  "minimumInvestment": 500,
  "images": ["..."],
  "documents": ["https://ipfs.io/ipfs/QmProspectus..."],
  "virtualTourUrl": "https://tour.example.com",
  "tokenContractAddress": "0x742d35Cc6634C0532925a3b8D29B5A33B3f7B0A5",
  "ipfsMetadataHash": "QmMetadata...",
  "blockchainId": "0x1234...",
  "status": "ACTIVE",
  "featured": true,
  "listingDate": "2025-10-20T10:00:00Z",
  "createdAt": "2025-10-15T08:00:00Z",
  "updatedAt": "2025-10-22T14:30:00Z",
  "owner": {
    "id": "user_xyz789",
    "name": "QuantPay Properties LLC",
    "email": "properties@quantpay.com"
  },
  "investments": {
    "total": 250,
    "totalShares": 250,
    "totalAmount": 125000
  }
}
```

#### **POST /api/properties/:id/invest**
Create a new investment in a property.

**Authentication:** Required (Bearer token)

**Request Body:**
```json
{
  "shares": 10,
  "paymentMethod": "STRIPE_CARD",
  "currency": "USD",
  "stripePaymentMethodId": "pm_1234..." // If Stripe
}
```

**Response (201):**
```json
{
  "investment": {
    "id": "inv_def456",
    "propertyId": "prop_abc123",
    "userId": "user_xyz789",
    "shares": 10,
    "investmentAmount": 5000,
    "sharePrice": 500,
    "paymentMethod": "STRIPE_CARD",
    "currency": "USD",
    "status": "PENDING",
    "createdAt": "2025-10-24T12:00:00Z"
  },
  "payment": {
    "id": "pay_ghi789",
    "stripePaymentIntentId": "pi_1234...",
    "clientSecret": "pi_1234..._secret_5678",
    "amount": 5000,
    "currency": "USD",
    "status": "PROCESSING"
  },
  "nextStep": "CONFIRM_PAYMENT" // or "GENERATE_CONTRACT" if payment completed
}
```

**Error Responses:**
- 400: Invalid shares amount, insufficient available shares
- 401: Unauthorized
- 404: Property not found
- 409: Property not active or insufficient shares available

---

### 7.2 Investments API

#### **GET /api/investments**
List user's investments.

**Authentication:** Required

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `status` (InvestmentStatus, optional)

**Response (200):**
```json
{
  "data": [
    {
      "id": "inv_def456",
      "property": {
        "id": "prop_abc123",
        "title": "Luxury Apartment Downtown",
        "images": ["..."],
        "city": "San Francisco",
        "country": "USA"
      },
      "shares": 10,
      "investmentAmount": 5000,
      "sharePrice": 500,
      "totalReturns": 420.50,
      "roi": 8.41,
      "status": "COMPLETED",
      "contractSigned": true,
      "createdAt": "2025-10-24T12:00:00Z",
      "payment": {
        "method": "STRIPE_CARD",
        "currency": "USD",
        "status": "COMPLETED",
        "completedAt": "2025-10-24T12:02:30Z"
      }
    },
    ...
  ],
  "summary": {
    "totalInvestments": 5,
    "totalAmount": 25000,
    "totalReturns": 2100,
    "averageROI": 8.4
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

#### **GET /api/investments/:id**
Get detailed information about a specific investment.

**Authentication:** Required (must own investment)

**Response (200):**
```json
{
  "id": "inv_def456",
  "property": {
    "id": "prop_abc123",
    "title": "Luxury Apartment Downtown",
    "description": "...",
    "images": ["..."],
    "address": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "country": "USA"
  },
  "shares": 10,
  "investmentAmount": 5000,
  "sharePrice": 500,
  "totalReturns": 420.50,
  "roi": 8.41,
  "paymentMethod": "STRIPE_CARD",
  "currency": "USD",
  "status": "COMPLETED",
  "nftTokenId": "1234",
  "transactionHash": "0xabc...",
  "contract": {
    "id": "con_jkl012",
    "title": "Investment Agreement - Luxury Apartment",
    "pdfUrl": "https://ipfs.io/ipfs/QmContract...",
    "status": "SIGNED",
    "signedAt": "2025-10-24T12:30:00Z"
  },
  "contractSigned": true,
  "contractSignedAt": "2025-10-24T12:30:00Z",
  "createdAt": "2025-10-24T12:00:00Z",
  "payment": {
    "id": "pay_ghi789",
    "amount": 5000,
    "currency": "USD",
    "method": "STRIPE_CARD",
    "status": "COMPLETED",
    "completedAt": "2025-10-24T12:02:30Z"
  },
  "dividends": [
    {
      "id": "div_mno345",
      "amount": 420.50,
      "currency": "USD",
      "distributionDate": "2025-11-01T00:00:00Z",
      "status": "PAID",
      "paidAt": "2025-11-01T10:00:00Z"
    }
  ]
}
```

---

### 7.3 Payments API

#### **POST /api/payments/stripe/intent**
Create a Stripe Payment Intent for property investment.

**Authentication:** Required

**Request Body:**
```json
{
  "amount": 5000,
  "currency": "USD",
  "propertyId": "prop_abc123",
  "shares": 10
}
```

**Response (200):**
```json
{
  "paymentIntentId": "pi_1234...",
  "clientSecret": "pi_1234..._secret_5678",
  "amount": 5000,
  "currency": "USD"
}
```

#### **POST /api/payments/stripe/webhook**
Webhook for Stripe payment events.

**Authentication:** Stripe signature verification

**Request Body:** Stripe event object

**Response (200):**
```json
{
  "received": true
}
```

**Handled Events:**
- `payment_intent.succeeded`: Update payment status, create investment, trigger contract generation
- `payment_intent.payment_failed`: Update payment status to FAILED
- `charge.refunded`: Update payment status to REFUNDED

#### **POST /api/payments/crypto**
Process cryptocurrency payment (USDC/USDT).

**Authentication:** Required

**Request Body:**
```json
{
  "propertyId": "prop_abc123",
  "shares": 10,
  "transactionHash": "0xabc123...",
  "fromAddress": "0x1234...",
  "amount": 5000,
  "currency": "USDC"
}
```

**Response (200):**
```json
{
  "payment": {
    "id": "pay_ghi789",
    "transactionHash": "0xabc123...",
    "amount": 5000,
    "currency": "USDC",
    "status": "PROCESSING"
  },
  "investment": {
    "id": "inv_def456",
    "status": "PENDING",
    "createdAt": "2025-10-24T12:00:00Z"
  }
}
```

**Backend Process:**
1. Verify transaction on blockchain (ethers.js)
2. Confirm recipient address and amount
3. Create Payment record
4. Create Investment record
5. Trigger contract generation

---

### 7.4 Contracts API

#### **POST /api/contracts/generate**
Generate a digital contract for an investment.

**Authentication:** Required

**Request Body:**
```json
{
  "investmentId": "inv_def456",
  "templateType": "INVESTMENT_AGREEMENT"
}
```

**Response (201):**
```json
{
  "contract": {
    "id": "con_jkl012",
    "title": "Investment Agreement - Luxury Apartment",
    "type": "INVESTMENT_AGREEMENT",
    "version": "1.0",
    "pdfUrl": "https://ipfs.io/ipfs/QmContract...",
    "ipfsHash": "QmContract...",
    "status": "PENDING_SIGNATURE",
    "createdAt": "2025-10-24T12:15:00Z",
    "parties": [
      {
        "name": "John Doe",
        "email": "john@example.com",
        "role": "Investor"
      },
      {
        "name": "QuantPay Properties LLC",
        "email": "properties@quantpay.com",
        "role": "Property Manager"
      }
    ],
    "aiAudit": {
      "status": "completed",
      "clauses": [
        "Investment amount: $5,000 USD",
        "Shares purchased: 10 shares",
        "Expected annual ROI: 8.5%",
        "Dividend distribution: Quarterly"
      ],
      "risks": [
        "Market volatility may affect returns",
        "Property value may fluctuate"
      ],
      "compliance": "Contract complies with SEC Reg D Rule 506(c) for accredited investors"
    }
  }
}
```

#### **GET /api/contracts/:id**
Get contract details.

**Authentication:** Required (must be party to contract)

**Response (200):**
```json
{
  "id": "con_jkl012",
  "title": "Investment Agreement - Luxury Apartment",
  "type": "INVESTMENT_AGREEMENT",
  "version": "1.0",
  "content": "<html>...contract HTML...</html>",
  "pdfUrl": "https://ipfs.io/ipfs/QmContract...",
  "ipfsHash": "QmContract...",
  "status": "SIGNED",
  "createdAt": "2025-10-24T12:15:00Z",
  "signedAt": "2025-10-24T12:30:00Z",
  "expiresAt": null,
  "parties": [...],
  "pqcSignature": "MIIFxjCCA66gAwIBAgIUXYZ...", // Base64 Dilithium signature
  "pqcAlgorithm": "DILITHIUM3",
  "aiAudit": {...},
  "signatures": [
    {
      "id": "sig_pqr678",
      "signerName": "John Doe",
      "signerEmail": "john@example.com",
      "signatureType": "DILITHIUM",
      "status": "SIGNED",
      "signedAt": "2025-10-24T12:30:00Z"
    }
  ]
}
```

#### **POST /api/contracts/:id/sign**
Sign a contract with PQC signature.

**Authentication:** Required

**Request Body:**
```json
{
  "signatureType": "DILITHIUM",
  "message": "I agree to the terms of this investment contract"
}
```

**Response (200):**
```json
{
  "signature": {
    "id": "sig_pqr678",
    "contractId": "con_jkl012",
    "signatureType": "DILITHIUM",
    "signatureData": "MIIFxjCCA66gAwIBAgIUXYZ...",
    "status": "SIGNED",
    "signedAt": "2025-10-24T12:30:00Z"
  },
  "contract": {
    "id": "con_jkl012",
    "status": "SIGNED",
    "signedAt": "2025-10-24T12:30:00Z"
  }
}
```

**Backend Process:**
1. Generate PQC signature using liboqs (Dilithium3)
2. Create Signature record
3. Update Contract status to SIGNED
4. Update Investment contractSigned to true
5. Upload signed contract to IPFS
6. Emit blockchain event (optional)

#### **GET /api/contracts/:id/download**
Download contract PDF.

**Authentication:** Required (must be party to contract)

**Response:** PDF file stream

---

### 7.5 PQC API

#### **POST /api/pqc/sign**
Generate a post-quantum signature for arbitrary data.

**Authentication:** Required

**Request Body:**
```json
{
  "message": "Contract content to sign",
  "algorithm": "DILITHIUM3" // or "SPHINCS_PLUS"
}
```

**Response (200):**
```json
{
  "signature": "MIIFxjCCA66gAwIBAgIUXYZ...",
  "publicKey": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...",
  "algorithm": "DILITHIUM3",
  "timestamp": "2025-10-24T12:30:00Z"
}
```

#### **POST /api/pqc/verify**
Verify a post-quantum signature.

**Request Body:**
```json
{
  "message": "Contract content to verify",
  "signature": "MIIFxjCCA66gAwIBAgIUXYZ...",
  "publicKey": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...",
  "algorithm": "DILITHIUM3"
}
```

**Response (200):**
```json
{
  "valid": true,
  "algorithm": "DILITHIUM3",
  "verifiedAt": "2025-10-24T12:35:00Z"
}
```

---

### 7.6 AI Auditor API

#### **POST /api/ai/audit**
Analyze a contract using AI.

**Authentication:** Required

**Request Body:**
```json
{
  "contractId": "con_jkl012"
}
```

**Response (200):**
```json
{
  "contractId": "con_jkl012",
  "auditResult": {
    "summary": "This is a standard investment agreement with clear terms.",
    "clauses": [
      {
        "clause": "Investment Amount",
        "content": "$5,000 USD for 10 shares",
        "risk": "LOW"
      },
      {
        "clause": "Expected Returns",
        "content": "8.5% annual ROI with quarterly dividend distributions",
        "risk": "MEDIUM",
        "note": "Returns are estimates and not guaranteed"
      },
      {
        "clause": "Transfer Restrictions",
        "content": "Shares are non-transferable for 12 months",
        "risk": "MEDIUM"
      },
      {
        "clause": "Exit Strategy",
        "content": "Buy-back option after 5 years",
        "risk": "LOW"
      }
    ],
    "risks": [
      {
        "type": "Market Risk",
        "severity": "MEDIUM",
        "description": "Property values may fluctuate based on market conditions"
      },
      {
        "type": "Liquidity Risk",
        "severity": "HIGH",
        "description": "Shares cannot be sold for 12 months (lock-up period)"
      }
    ],
    "compliance": {
      "status": "COMPLIANT",
      "framework": "SEC Reg D Rule 506(c)",
      "notes": "Contract meets requirements for accredited investor offerings"
    },
    "recommendations": [
      "Consider adding force majeure clause",
      "Clarify dispute resolution process"
    ]
  },
  "auditedAt": "2025-10-24T12:20:00Z"
}
```

---

### 7.7 Authentication & User API

(Existing endpoints enhanced)

#### **POST /api/auth/[...nextauth]**
NextAuth.js authentication handler (already implemented).

#### **POST /api/signup**
User registration (enhanced).

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "walletAddress": "0x1234...", // optional
  "isAccredited": false
}
```

**Response (201):**
```json
{
  "user": {
    "id": "user_xyz789",
    "email": "john@example.com",
    "name": "John Doe",
    "walletAddress": "0x1234...",
    "plan": "free",
    "kycStatus": "PENDING",
    "isAccredited": false
  }
}
```

#### **GET /api/users/me**
Get current user profile.

**Authentication:** Required

**Response (200):**
```json
{
  "id": "user_xyz789",
  "email": "john@example.com",
  "name": "John Doe",
  "firstName": "John",
  "lastName": "Doe",
  "walletAddress": "0x1234...",
  "plan": "free",
  "kycStatus": "VERIFIED",
  "kycVerifiedAt": "2025-10-20T14:00:00Z",
  "isAccredited": true,
  "createdAt": "2025-10-15T10:00:00Z",
  "investments": {
    "total": 5,
    "totalAmount": 25000
  }
}
```

#### **PATCH /api/users/me**
Update user profile.

**Authentication:** Required

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "walletAddress": "0x5678..."
}
```

**Response (200):**
```json
{
  "user": {...}
}
```

---

## 8. Specific Modules

### 8.1 Property Marketplace Module

**File:** `backend/src/services/PropertyService.ts`

**Responsibilities:**
- CRUD operations for properties
- Listing management (active, paused, closed)
- Filtering and search logic
- Share availability tracking
- Featured properties

**Key Methods:**
```typescript
class PropertyService {
  async listProperties(filters: PropertyFilters): Promise<PaginatedProperties>
  async getPropertyById(id: string): Promise<Property>
  async createProperty(data: CreatePropertyDTO): Promise<Property>
  async updateProperty(id: string, data: UpdatePropertyDTO): Promise<Property>
  async deleteProperty(id: string): Promise<void>
  async updateAvailableShares(id: string, sharesSold: number): Promise<Property>
  async getFeaturedProperties(limit: number): Promise<Property[]>
}
```

**Implementation Highlights:**
- Prisma queries with filtering and pagination
- Transaction support for share updates
- Image upload to IPFS (via Pinata)
- Smart contract interaction for on-chain property registration

---

### 8.2 Investment Management Module

**File:** `backend/src/services/InvestmentService.ts`

**Responsibilities:**
- Create investments after payment confirmation
- Update investment status
- Calculate returns and ROI
- Manage investment lifecycle

**Key Methods:**
```typescript
class InvestmentService {
  async createInvestment(data: CreateInvestmentDTO): Promise<Investment>
  async getInvestmentById(id: string): Promise<Investment>
  async listUserInvestments(userId: string, filters: InvestmentFilters): Promise<PaginatedInvestments>
  async updateInvestmentStatus(id: string, status: InvestmentStatus): Promise<Investment>
  async calculateROI(investmentId: string): Promise<number>
  async distributeReturns(investmentId: string, amount: number): Promise<Dividend>
}
```

**Flow:**
1. Payment confirmed → create Investment (status: PENDING)
2. Generate contract → update Investment (add contractId)
3. Contract signed → update Investment (contractSigned: true, status: COMPLETED)
4. Mint NFT → update Investment (add nftTokenId, transactionHash)
5. Periodic dividends → create Dividend records

---

### 8.3 Multi-Currency Payment Processing

**File:** `backend/src/services/PaymentService.ts`

**Responsibilities:**
- Stripe integration (card, bank transfer)
- Crypto payment processing (USDC, USDT, ETH)
- Payment verification
- Refund handling

**Key Methods:**
```typescript
class PaymentService {
  // Stripe
  async createStripeIntent(data: StripeIntentDTO): Promise<StripePaymentIntent>
  async handleStripeWebhook(event: Stripe.Event): Promise<void>
  
  // Crypto
  async processCryptoPayment(data: CryptoPaymentDTO): Promise<Payment>
  async verifyBlockchainTransaction(txHash: string, expectedAmount: number): Promise<boolean>
  
  // Common
  async getPaymentById(id: string): Promise<Payment>
  async refundPayment(paymentId: string): Promise<Payment>
}
```

**Stripe Integration:**
```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

async createStripeIntent(data: StripeIntentDTO): Promise<StripePaymentIntent> {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: data.amount * 100, // Convert to cents
    currency: data.currency.toLowerCase(),
    metadata: {
      propertyId: data.propertyId,
      userId: data.userId,
      shares: data.shares,
    },
  });

  // Create Payment record in database
  const payment = await prisma.payment.create({
    data: {
      userId: data.userId,
      amount: data.amount,
      currency: data.currency,
      method: 'STRIPE_CARD',
      stripePaymentIntentId: paymentIntent.id,
      stripeStatus: paymentIntent.status,
      status: 'PENDING',
    },
  });

  return {
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret!,
    amount: data.amount,
    currency: data.currency,
    paymentId: payment.id,
  };
}

async handleStripeWebhook(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await this.handlePaymentSuccess(paymentIntent);
      break;
    case 'payment_intent.payment_failed':
      await this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
      break;
    // ... other events
  }
}

private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  // 1. Update Payment status
  const payment = await prisma.payment.update({
    where: { stripePaymentIntentId: paymentIntent.id },
    data: {
      status: 'COMPLETED',
      stripeStatus: paymentIntent.status,
      completedAt: new Date(),
    },
  });

  // 2. Create Investment
  const metadata = paymentIntent.metadata;
  const investment = await prisma.investment.create({
    data: {
      propertyId: metadata.propertyId,
      userId: metadata.userId,
      shares: parseInt(metadata.shares),
      investmentAmount: payment.amount,
      sharePrice: payment.amount / parseInt(metadata.shares),
      paymentMethod: 'STRIPE_CARD',
      paymentId: payment.id,
      currency: payment.currency,
      status: 'PROCESSING',
    },
  });

  // 3. Update Property available shares
  await prisma.property.update({
    where: { id: metadata.propertyId },
    data: {
      availableShares: {
        decrement: parseInt(metadata.shares),
      },
    },
  });

  // 4. Trigger contract generation
  await contractService.generateContract({
    investmentId: investment.id,
    templateType: 'INVESTMENT_AGREEMENT',
  });
}
```

**Crypto Payment:**
```typescript
import { ethers } from 'ethers';

async processCryptoPayment(data: CryptoPaymentDTO): Promise<Payment> {
  // 1. Verify transaction on blockchain
  const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_RPC_URL);
  const tx = await provider.getTransaction(data.transactionHash);
  
  if (!tx) {
    throw new Error('Transaction not found');
  }

  // 2. Verify recipient and amount (assuming USDC ERC-20)
  const expectedRecipient = process.env.PAYMENT_WALLET_ADDRESS;
  const expectedAmount = ethers.parseUnits(data.amount.toString(), 6); // USDC has 6 decimals

  if (tx.to?.toLowerCase() !== expectedRecipient.toLowerCase()) {
    throw new Error('Invalid recipient address');
  }

  // Decode transfer function data to get amount
  const usdcInterface = new ethers.Interface([
    'function transfer(address to, uint256 amount) returns (bool)',
  ]);
  const decoded = usdcInterface.parseTransaction({ data: tx.data });
  
  if (decoded?.args[1] < expectedAmount) {
    throw new Error('Insufficient payment amount');
  }

  // 3. Wait for confirmations
  await tx.wait(3); // Wait for 3 confirmations

  // 4. Create Payment record
  const payment = await prisma.payment.create({
    data: {
      userId: data.userId,
      amount: data.amount,
      currency: data.currency,
      method: 'CRYPTO_USDC',
      transactionHash: data.transactionHash,
      fromAddress: data.fromAddress,
      toAddress: expectedRecipient,
      blockNumber: tx.blockNumber,
      status: 'COMPLETED',
      completedAt: new Date(),
    },
  });

  // 5. Create Investment and trigger contract generation (similar to Stripe flow)
  // ...

  return payment;
}
```

---

### 8.4 Smart Digital Contract Generator

**File:** `backend/src/services/ContractService.ts`

**Responsibilities:**
- Generate contracts from templates
- PDF creation
- IPFS upload
- PQC signature integration
- AI audit trigger

**Key Methods:**
```typescript
class ContractService {
  async generateContract(data: GenerateContractDTO): Promise<Contract>
  async renderContractHTML(investment: Investment, template: string): Promise<string>
  async generatePDF(html: string): Promise<Buffer>
  async uploadToIPFS(pdf: Buffer): Promise<string>
  async signContractWithPQC(contractId: string, userId: string): Promise<Signature>
  async getContractById(id: string): Promise<Contract>
}
```

**Implementation:**
```typescript
import Handlebars from 'handlebars';
import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';
import { join } from 'path';

async generateContract(data: GenerateContractDTO): Promise<Contract> {
  // 1. Fetch investment details
  const investment = await prisma.investment.findUnique({
    where: { id: data.investmentId },
    include: {
      property: true,
      user: true,
      payment: true,
    },
  });

  if (!investment) {
    throw new Error('Investment not found');
  }

  // 2. Render HTML from template
  const templatePath = join(__dirname, '../templates/investment-contract.hbs');
  const template = readFileSync(templatePath, 'utf-8');
  const compiledTemplate = Handlebars.compile(template);
  
  const html = compiledTemplate({
    investor: {
      name: investment.user.name,
      email: investment.user.email,
      walletAddress: investment.user.walletAddress,
    },
    property: {
      title: investment.property.title,
      address: investment.property.address,
      city: investment.property.city,
      state: investment.property.state,
      country: investment.property.country,
    },
    investment: {
      shares: investment.shares,
      amount: investment.investmentAmount,
      sharePrice: investment.sharePrice,
      currency: investment.currency,
      date: investment.createdAt.toLocaleDateString(),
    },
    terms: {
      expectedROI: investment.property.expectedROI,
      rentalYield: investment.property.rentalYield,
      dividendFrequency: 'Quarterly',
      lockupPeriod: '12 months',
    },
    contractDate: new Date().toLocaleDateString(),
    contractNumber: `QPC-${investment.id.slice(0, 8).toUpperCase()}`,
  });

  // 3. Generate PDF
  const pdf = await this.generatePDF(html);

  // 4. Upload to IPFS
  const ipfsHash = await this.uploadToIPFS(pdf);

  // 5. Create Contract record
  const contract = await prisma.contract.create({
    data: {
      title: `Investment Agreement - ${investment.property.title}`,
      type: 'INVESTMENT_AGREEMENT',
      content: html,
      pdfUrl: `https://ipfs.io/ipfs/${ipfsHash}`,
      ipfsHash,
      creatorId: investment.userId,
      partiesJson: [
        {
          name: investment.user.name,
          email: investment.user.email,
          role: 'Investor',
          walletAddress: investment.user.walletAddress,
        },
        {
          name: 'QuantPay Properties LLC',
          email: 'properties@quantpay.com',
          role: 'Property Manager',
        },
      ],
      status: 'PENDING_SIGNATURE',
    },
  });

  // 6. Update investment with contract ID
  await prisma.investment.update({
    where: { id: data.investmentId },
    data: { contractId: contract.id },
  });

  // 7. Trigger AI audit (async)
  this.triggerAIAudit(contract.id).catch(console.error);

  return contract;
}

async generatePDF(html: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20mm',
      right: '15mm',
      bottom: '20mm',
      left: '15mm',
    },
  });
  
  await browser.close();
  return Buffer.from(pdf);
}

async uploadToIPFS(pdf: Buffer): Promise<string> {
  const pinata = new PinataClient({
    pinataApiKey: process.env.PINATA_API_KEY!,
    pinataSecretApiKey: process.env.PINATA_SECRET!,
  });

  const stream = Readable.from(pdf);
  const result = await pinata.pinFileToIPFS(stream, {
    pinataMetadata: {
      name: `contract-${Date.now()}.pdf`,
    },
  });

  return result.IpfsHash;
}
```

---

### 8.5 Post-Quantum Cryptography (PQC) Module

**File:** `backend/src/services/PQCService.ts`

**Responsibilities:**
- Dilithium signature generation and verification
- SPHINCS+ backup signatures
- Key management
- liboqs wrapper

**Key Methods:**
```typescript
class PQCService {
  async generateKeyPair(algorithm: PQCAlgorithm): Promise<KeyPair>
  async sign(message: string, privateKey: string, algorithm: PQCAlgorithm): Promise<string>
  async verify(message: string, signature: string, publicKey: string, algorithm: PQCAlgorithm): Promise<boolean>
  async signContract(contractId: string, userId: string): Promise<Signature>
}
```

**MVP Implementation Strategy:**

**Option A: Classical ECDSA + PQC Badge (Fast MVP)**
- Use standard ECDSA signatures (ethers.js)
- Add "PQC Protected" visual badge/seal
- Promise of future PQC upgrade
- **Advantage**: Fast implementation (1-2 days)
- **Disadvantage**: Not actually post-quantum secure

**Option B: Full liboqs Integration (Real PQC)**
- Integrate Open Quantum Safe library
- Use Dilithium3 signatures
- Real quantum resistance
- **Advantage**: Genuine PQC security, marketing differentiator
- **Disadvantage**: Complex integration (1-2 weeks), larger signature sizes

**Recommended: Hybrid Approach**
- MVP: Option A (classical + badge)
- Phase 2: Option B (real PQC)

**liboqs Wrapper (for Phase 2):**
```typescript
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFileSync, readFileSync, unlinkSync } from 'fs';
import { join } from 'path';

const execAsync = promisify(exec);

class PQCService {
  private liboqsPath = process.env.LIBOQS_PATH || '/usr/local/bin';

  async generateKeyPair(algorithm: PQCAlgorithm = 'DILITHIUM3'): Promise<KeyPair> {
    // Generate keypair using liboqs CLI or native binding
    const keyDir = join('/tmp', `pqc-${Date.now()}`);
    
    // Example using liboqs-python wrapper (needs Python binding)
    const { stdout } = await execAsync(
      `python3 -c "import oqs; sig = oqs.Signature('Dilithium3'); public_key = sig.generate_keypair(); print(public_key.hex())"`
    );
    
    const publicKey = stdout.trim();
    // Private key should be stored securely, not returned to client
    
    return {
      publicKey,
      algorithm: 'DILITHIUM3',
    };
  }

  async sign(message: string, privateKey: string, algorithm: PQCAlgorithm = 'DILITHIUM3'): Promise<string> {
    // Hash message first
    const messageHash = crypto.createHash('sha256').update(message).digest('hex');
    
    // Sign using liboqs (pseudo-code, actual implementation depends on bindings)
    const signature = await this.liboqsSign(messageHash, privateKey, algorithm);
    
    return signature;
  }

  async verify(message: string, signature: string, publicKey: string, algorithm: PQCAlgorithm = 'DILITHIUM3'): Promise<boolean> {
    const messageHash = crypto.createHash('sha256').update(message).digest('hex');
    
    const isValid = await this.liboqsVerify(messageHash, signature, publicKey, algorithm);
    
    return isValid;
  }

  async signContract(contractId: string, userId: string): Promise<Signature> {
    // 1. Get contract content
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
    });

    if (!contract) {
      throw new Error('Contract not found');
    }

    // 2. Get or generate user's PQC key pair
    // (In production, keys should be stored in secure vault like AWS KMS)
    const keyPair = await this.getUserKeyPair(userId);

    // 3. Generate signature
    const signature = await this.sign(
      contract.content,
      keyPair.privateKey,
      'DILITHIUM3'
    );

    // 4. Create Signature record
    const sig = await prisma.signature.create({
      data: {
        contractId,
        userId,
        signerName: user.name!,
        signerEmail: user.email,
        signerAddress: user.walletAddress,
        signatureType: 'DILITHIUM',
        signatureData: signature,
        status: 'SIGNED',
        signedAt: new Date(),
      },
    });

    // 5. Update contract status
    await prisma.contract.update({
      where: { id: contractId },
      data: {
        status: 'SIGNED',
        signedAt: new Date(),
        pqcSignature: signature,
        pqcPublicKey: keyPair.publicKey,
        pqcAlgorithm: 'DILITHIUM3',
      },
    });

    return sig;
  }

  private async liboqsSign(messageHash: string, privateKey: string, algorithm: string): Promise<string> {
    // Actual implementation using liboqs bindings
    // This is pseudo-code - real implementation depends on chosen binding method
    throw new Error('Not implemented - requires liboqs integration');
  }

  private async liboqsVerify(messageHash: string, signature: string, publicKey: string, algorithm: string): Promise<boolean> {
    throw new Error('Not implemented - requires liboqs integration');
  }

  private async getUserKeyPair(userId: string): Promise<KeyPair> {
    // Retrieve from secure storage (AWS KMS, HashiCorp Vault, etc.)
    // For demo: generate on-the-fly (NOT SECURE for production)
    return this.generateKeyPair('DILITHIUM3');
  }
}
```

---

### 8.6 AI Auditor Module

**File:** `backend/src/services/AIAuditorService.ts`

**Responsibilities:**
- Contract text parsing
- Clause extraction
- Risk analysis
- Compliance checking
- User-friendly summaries

**Key Methods:**
```typescript
class AIAuditorService {
  async auditContract(contractId: string): Promise<AIAuditResult>
  async analyzeText(text: string): Promise<AIAnalysis>
  async extractClauses(text: string): Promise<Clause[]>
  async assessRisks(clauses: Clause[]): Promise<Risk[]>
}
```

**Implementation:**
```typescript
import Anthropic from '@anthropic-ai/sdk';

class AIAuditorService {
  private anthropic: Anthropic;

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    });
  }

  async auditContract(contractId: string): Promise<AIAuditResult> {
    // 1. Fetch contract
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        investments: {
          include: {
            property: true,
            user: true,
          },
        },
      },
    });

    if (!contract) {
      throw new Error('Contract not found');
    }

    // 2. Strip HTML tags to get plain text
    const plainText = this.htmlToText(contract.content);

    // 3. Call AI API with structured prompt
    const message = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: this.buildAuditPrompt(plainText, contract),
        },
      ],
    });

    // 4. Parse AI response
    const aiResponse = message.content[0].text;
    const auditResult = this.parseAIResponse(aiResponse);

    // 5. Save audit result to database
    await prisma.contract.update({
      where: { id: contractId },
      data: {
        aiAuditResult: auditResult,
        aiAuditedAt: new Date(),
      },
    });

    return auditResult;
  }

  private buildAuditPrompt(contractText: string, contract: Contract): string {
    return `
You are a legal and financial analyst specializing in real estate investment contracts. 
Analyze the following investment agreement and provide a structured analysis.

CONTRACT TEXT:
${contractText}

Please provide a JSON response with the following structure:
{
  "summary": "Brief 2-3 sentence summary of the contract",
  "clauses": [
    {
      "clause": "Clause name",
      "content": "Brief description of what this clause says",
      "risk": "LOW | MEDIUM | HIGH",
      "note": "Any additional notes (optional)"
    }
  ],
  "risks": [
    {
      "type": "Risk category",
      "severity": "LOW | MEDIUM | HIGH",
      "description": "Explanation of the risk"
    }
  ],
  "compliance": {
    "status": "COMPLIANT | NON_COMPLIANT | REQUIRES_REVIEW",
    "framework": "Relevant regulatory framework (e.g., SEC Reg D)",
    "notes": "Compliance notes"
  },
  "recommendations": ["List of recommendations for improvement"]
}

Focus on:
1. Key financial terms (investment amount, expected returns, fees)
2. Investor rights and obligations
3. Property details and ownership structure
4. Risks (market, liquidity, regulatory)
5. Exit strategies and redemption terms
6. Dispute resolution
7. Regulatory compliance (SEC, accredited investor requirements)

Be thorough but concise. Highlight any red flags or missing critical terms.
`;
  }

  private parseAIResponse(aiResponse: string): AIAuditResult {
    try {
      // Extract JSON from response (AI might include markdown code blocks)
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return parsed as AIAuditResult;
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      // Fallback: return basic analysis
      return {
        summary: 'AI analysis could not be parsed',
        clauses: [],
        risks: [],
        compliance: {
          status: 'REQUIRES_REVIEW',
          framework: 'Unknown',
          notes: 'Manual review required',
        },
        recommendations: [],
      };
    }
  }

  private htmlToText(html: string): string {
    // Simple HTML stripping (use cheerio or similar in production)
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
```

---

### 8.7 Blockchain Bridge Module

**File:** `backend/src/services/BlockchainBridge.ts`

**Responsibilities:**
- Smart contract deployment and interaction
- NFT minting for ownership tokens
- Transaction monitoring
- Event listening
- Gas estimation

**Key Methods:**
```typescript
class BlockchainBridge {
  async mintOwnershipNFT(investmentId: string): Promise<string>
  async registerProperty(propertyId: string): Promise<string>
  async verifyTransaction(txHash: string): Promise<boolean>
  async listenForEvents(contractAddress: string, eventName: string): void
  async getTransactionReceipt(txHash: string): Promise<TransactionReceipt>
}
```

**Implementation:**
```typescript
import { ethers } from 'ethers';
import PropertyTokenABI from '../config/abis/PropertyToken.json';
import InvestmentManagerABI from '../config/abis/InvestmentManager.json';

class BlockchainBridge {
  private provider: ethers.Provider;
  private signer: ethers.Wallet;
  private propertyTokenContract: ethers.Contract;
  private investmentManagerContract: ethers.Contract;

  constructor() {
    // Initialize provider (Alchemy, Infura, etc.)
    this.provider = new ethers.JsonRpcProvider(
      process.env.ALCHEMY_RPC_URL || 'https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY'
    );

    // Initialize signer (backend wallet for contract interactions)
    this.signer = new ethers.Wallet(
      process.env.BACKEND_PRIVATE_KEY!,
      this.provider
    );

    // Initialize contracts
    this.propertyTokenContract = new ethers.Contract(
      process.env.PROPERTY_TOKEN_CONTRACT_ADDRESS!,
      PropertyTokenABI,
      this.signer
    );

    this.investmentManagerContract = new ethers.Contract(
      process.env.INVESTMENT_MANAGER_CONTRACT_ADDRESS!,
      InvestmentManagerABI,
      this.signer
    );
  }

  async mintOwnershipNFT(investmentId: string): Promise<string> {
    // 1. Fetch investment details
    const investment = await prisma.investment.findUnique({
      where: { id: investmentId },
      include: {
        property: true,
        user: true,
      },
    });

    if (!investment) {
      throw new Error('Investment not found');
    }

    // 2. Prepare NFT metadata
    const metadata = {
      name: `${investment.property.title} - ${investment.shares} Shares`,
      description: `Ownership of ${investment.shares} fractional shares in ${investment.property.title}`,
      image: investment.property.images[0],
      attributes: [
        { trait_type: 'Property', value: investment.property.title },
        { trait_type: 'Shares', value: investment.shares.toString() },
        { trait_type: 'Investment Amount', value: investment.investmentAmount.toString() },
        { trait_type: 'City', value: investment.property.city },
        { trait_type: 'Country', value: investment.property.country },
      ],
    };

    // 3. Upload metadata to IPFS
    const ipfsHash = await this.uploadMetadataToIPFS(metadata);

    // 4. Mint NFT
    const tx = await this.propertyTokenContract.mint(
      investment.user.walletAddress || investment.user.email, // Recipient
      ipfsHash, // Token URI
      {
        gasLimit: 300000,
      }
    );

    // 5. Wait for transaction confirmation
    const receipt = await tx.wait();

    // 6. Get token ID from event
    const mintEvent = receipt.logs.find(
      (log: any) => log.fragment?.name === 'Transfer'
    );
    const tokenId = mintEvent?.args[2].toString(); // ERC-721 Transfer event: (from, to, tokenId)

    // 7. Update investment record
    await prisma.investment.update({
      where: { id: investmentId },
      data: {
        nftTokenId: tokenId,
        transactionHash: receipt.hash,
        status: 'COMPLETED',
      },
    });

    // 8. Emit event (optional, for real-time updates)
    eventEmitter.emit('nft-minted', {
      investmentId,
      tokenId,
      transactionHash: receipt.hash,
    });

    return tokenId;
  }

  async registerProperty(propertyId: string): Promise<string> {
    // 1. Fetch property
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new Error('Property not found');
    }

    // 2. Deploy or register property on InvestmentManager contract
    const tx = await this.investmentManagerContract.registerProperty(
      propertyId,
      property.totalShares,
      ethers.parseUnits(property.sharePrice.toString(), 6), // Assuming USDC (6 decimals)
      {
        gasLimit: 200000,
      }
    );

    const receipt = await tx.wait();

    // 3. Update property record
    await prisma.property.update({
      where: { id: propertyId },
      data: {
        blockchainId: receipt.hash,
        tokenContractAddress: process.env.PROPERTY_TOKEN_CONTRACT_ADDRESS,
      },
    });

    return receipt.hash;
  }

  async verifyTransaction(txHash: string): Promise<boolean> {
    try {
      const tx = await this.provider.getTransaction(txHash);
      if (!tx) return false;

      const receipt = await tx.wait(1); // Wait for at least 1 confirmation
      return receipt.status === 1; // 1 = success, 0 = failure
    } catch (error) {
      console.error('Transaction verification failed:', error);
      return false;
    }
  }

  async listenForEvents(contractAddress: string, eventName: string): void {
    const contract = new ethers.Contract(
      contractAddress,
      PropertyTokenABI,
      this.provider
    );

    contract.on(eventName, (...args) => {
      console.log(`Event ${eventName} emitted:`, args);
      // Handle event (e.g., update database, send notification)
    });
  }

  async getTransactionReceipt(txHash: string): Promise<ethers.TransactionReceipt | null> {
    return await this.provider.getTransactionReceipt(txHash);
  }

  private async uploadMetadataToIPFS(metadata: any): Promise<string> {
    // Upload JSON metadata to IPFS via Pinata
    const pinata = new PinataClient({
      pinataApiKey: process.env.PINATA_API_KEY!,
      pinataSecretApiKey: process.env.PINATA_SECRET!,
    });

    const result = await pinata.pinJSONToIPFS(metadata, {
      pinataMetadata: {
        name: `nft-metadata-${Date.now()}`,
      },
    });

    return `ipfs://${result.IpfsHash}`;
  }
}
```

---

## 9. MVP User Flow

### 9.1 Complete 60-Second Investment Flow

**Diagram:**
```
┌─────────────────────────────────────────────────────────────────┐
│ Step 1: Landing Page (5 seconds)                                │
├─────────────────────────────────────────────────────────────────┤
│ • User visits quantpaychain.com                                 │
│ • Sees featured properties on hero section                      │
│ • Clicks "Browse Properties" or property card                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 2: Property Marketplace (5 seconds)                        │
├─────────────────────────────────────────────────────────────────┤
│ • Grid of property cards with key details                       │
│ • Filter by type, location, price, ROI                          │
│ • User clicks on specific property                              │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 3: Property Details (10 seconds)                           │
├─────────────────────────────────────────────────────────────────┤
│ • Full property information:                                    │
│   - Images, virtual tour                                        │
│   - Financial metrics (ROI, rental yield)                       │
│   - Location, amenities                                         │
│   - Share price, available shares                               │
│ • "Invest Now" button prominent                                 │
│ • User enters investment amount (e.g., $5000 = 10 shares)       │
│ • Clicks "Invest Now"                                           │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 4: Authentication (if not logged in) (10 seconds)          │
├─────────────────────────────────────────────────────────────────┤
│ • Quick sign-up/sign-in modal                                   │
│ • Options:                                                      │
│   - Email + password (fast signup)                              │
│   - MetaMask (Web3 wallet)                                      │
│ • KYC check (basic, fast for MVP)                               │
│ • Redirect back to investment                                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 5: Payment Method Selection (5 seconds)                    │
├─────────────────────────────────────────────────────────────────┤
│ • Choose payment method:                                        │
│   - 💳 Stripe (Card/Bank) - USD                                 │
│   - 🦊 MetaMask (USDC) - Crypto                                 │
│ • Display amount, fees, total                                   │
│ • User selects Stripe (for this example)                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 6: Payment Processing (15 seconds)                         │
├─────────────────────────────────────────────────────────────────┤
│ • Stripe Checkout embedded or redirected                        │
│ • User enters card details                                      │
│ • Payment processed (sandbox mode: instant)                     │
│ • Webhook triggered on backend                                  │
│ • Investment created in database                                │
│ • "Payment Successful" confirmation                             │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 7: Contract Generation (10 seconds)                        │
├─────────────────────────────────────────────────────────────────┤
│ • Backend triggers contract generation:                         │
│   1. Fetch investment + property data                           │
│   2. Render HTML from Handlebars template                       │
│   3. Generate PDF with Puppeteer                                │
│   4. Upload to IPFS via Pinata                                  │
│   5. Create Contract record in DB                               │
│ • User sees loading indicator: "Generating your contract..."    │
│ • AI Auditor analyzes contract (async, 5 seconds)               │
│ • Contract ready for review                                     │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 8: Contract Review & Signature (10 seconds)                │
├─────────────────────────────────────────────────────────────────┤
│ • Contract displayed in modal/page:                             │
│   - PDF viewer with terms                                       │
│   - AI Audit summary on side:                                   │
│     * Key clauses highlighted                                   │
│     * Risk assessment                                           │
│     * Compliance status                                         │
│ • User reviews (quick scan, AI summary helps)                   │
│ • "Sign with PQC" button                                        │
│ • User clicks → PQC signature generated (Dilithium)             │
│ • Signature saved to contract                                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 9: NFT Minting & Blockchain Recording (5 seconds)          │
├─────────────────────────────────────────────────────────────────┤
│ • Backend mints ownership NFT:                                  │
│   1. Upload NFT metadata to IPFS                                │
│   2. Call PropertyToken.mint() on smart contract               │
│   3. Wait for transaction confirmation (testnet: fast)          │
│   4. Update Investment with nftTokenId and txHash               │
│ • User sees: "Minting your ownership NFT..."                    │
│ • Success: "NFT minted! Token ID: #1234"                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 10: Dashboard Confirmation (5 seconds)                     │
├─────────────────────────────────────────────────────────────────┤
│ • Redirect to user dashboard                                    │
│ • Congratulations screen:                                       │
│   - "You're now an owner of Luxury Apartment Downtown!"         │
│   - Investment summary card:                                    │
│     * Property image                                            │
│     * Shares owned: 10                                          │
│     * Investment amount: $5,000                                 │
│     * Expected annual return: $425 (8.5% ROI)                   │
│     * Next dividend: Nov 1, 2025                                │
│   - Links:                                                      │
│     * View Contract (PDF)                                       │
│     * View NFT (blockchain explorer)                            │
│     * Share Investment (social)                                 │
│ • PQC badge visible: "🔐 Post-Quantum Secured"                  │
│ • AI Audit summary accessible                                   │
└─────────────────────────────────────────────────────────────────┘

TOTAL TIME: ~60 SECONDS ✅
```

### 9.2 Alternative Flow: Crypto Payment

**Steps 6-7 (Crypto Path):**
```
Step 6: Crypto Payment (MetaMask)
├── User selects "Pay with USDC"
├── Backend creates payment record (status: PENDING)
├── User approves USDC transfer in MetaMask
│   ├── Transaction sent to blockchain
│   └── Transaction hash returned
├── User submits tx hash to backend
└── Backend verifies transaction:
    ├── Fetch tx from blockchain
    ├── Verify recipient, amount, confirmations
    ├── Update payment (status: COMPLETED)
    └── Create investment
```

**Time:** ~20 seconds (slightly longer due to blockchain confirmation)

### 9.3 Error Handling Flows

**Payment Failure:**
```
Payment Failed
├── Display error message: "Payment failed. Please try again."
├── Options:
│   ├── Retry with same method
│   ├── Try different payment method
│   └── Contact support
└── Investment remains in PENDING status (can be resumed)
```

**Insufficient Shares:**
```
Insufficient Shares Available
├── Display: "Only X shares available (you requested Y)"
├── Options:
│   ├── Adjust investment amount to available shares
│   └── View similar properties
└── Prevent investment creation
```

**Contract Generation Failure:**
```
Contract Generation Error
├── Investment created successfully, but contract pending
├── Notify user: "Your investment is secured, contract generation in progress"
├── Retry contract generation in background
└── Email user when contract is ready
```

---

## 10. Security & Authentication

### 10.1 Authentication Strategy

**NextAuth.js Configuration:**
- **Email/Password**: bcrypt hashing, email verification
- **SIWE (Web3)**: Sign-In With Ethereum using ethers.js
- **Session**: JWT-based (default), migrate to database sessions in Phase 2
- **Multi-Factor**: Optional 2FA with TOTP (future)

**Implementation:**
```typescript
// lib/auth-config.ts (enhanced)
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Email and Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials!.email },
        });

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        const isValid = await bcrypt.compare(credentials!.password, user.password);
        if (!isValid) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          walletAddress: user.walletAddress,
        };
      }
    }),
    CredentialsProvider({
      id: 'ethereum',
      name: 'Ethereum',
      credentials: {
        message: { label: 'Message', type: 'text' },
        signature: { label: 'Signature', type: 'text' }
      },
      async authorize(credentials) {
        const siweMessage = new SiweMessage(credentials!.message);
        const fields = await siweMessage.verify({ signature: credentials!.signature });

        if (!fields.success) {
          throw new Error('Invalid signature');
        }

        const walletAddress = siweMessage.address;

        // Find or create user
        let user = await prisma.user.findUnique({
          where: { walletAddress },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: `${walletAddress}@wallet.local`,
              name: `User ${walletAddress.slice(0, 6)}`,
              walletAddress,
            },
          });
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          walletAddress: user.walletAddress,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.walletAddress = user.walletAddress;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.walletAddress = token.walletAddress as string;
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};
```

### 10.2 API Route Protection

**Middleware:**
```typescript
// middleware/auth.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { NextRequest, NextResponse } from 'next/server';

export async function requireAuth(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  return session;
}

// Usage in API routes:
// app/api/investments/route.ts
export async function GET(req: NextRequest) {
  const sessionOrError = await requireAuth(req);
  if (sessionOrError instanceof NextResponse) {
    return sessionOrError; // Error response
  }
  const session = sessionOrError;
  
  // ... proceed with authenticated request
}
```

### 10.3 Input Validation

**Zod Schemas:**
```typescript
// lib/validators.ts
import { z } from 'zod';

export const InvestmentSchema = z.object({
  propertyId: z.string().cuid(),
  shares: z.number().int().positive().min(1),
  paymentMethod: z.enum(['STRIPE_CARD', 'STRIPE_BANK', 'CRYPTO_USDC']),
  currency: z.enum(['USD', 'USDC']),
  stripePaymentMethodId: z.string().optional(),
  transactionHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/).optional(),
});

export const PropertyFilterSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  type: z.enum(['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'MIXED_USE', 'LAND']).optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  status: z.enum(['DRAFT', 'PENDING_APPROVAL', 'ACTIVE', 'FULLY_FUNDED', 'PAUSED', 'CLOSED']).default('ACTIVE'),
});

// Usage:
export async function POST(req: NextRequest) {
  const body = await req.json();
  const validation = InvestmentSchema.safeParse(body);
  
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: validation.error.errors },
      { status: 400 }
    );
  }
  
  const data = validation.data;
  // ... proceed with validated data
}
```

### 10.4 Rate Limiting

**Implementation (using Upstash Redis):**
```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const apiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 h'), // 100 requests per hour
});

export const paymentRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 payments per hour
});

// Usage:
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'anonymous';
  const { success } = await apiRateLimit.limit(ip);
  
  if (!success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }
  
  // ... proceed
}
```

### 10.5 Data Encryption

**Sensitive Data:**
- Passwords: bcrypt (already implemented)
- API Keys: Encrypted at rest in database
- PQC Private Keys: AWS KMS or HashiCorp Vault
- Payment Data: Never stored, use Stripe tokens

**Database Encryption:**
```typescript
// lib/encryption.ts
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!; // 32-byte key
const ALGORITHM = 'aes-256-gcm';

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decrypt(encryptedData: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedData.split(':');
  
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

// Usage: Encrypt sensitive fields before storing
const encryptedKey = encrypt(apiKey);
await prisma.apiKey.create({
  data: {
    key: encryptedKey,
    // ...
  },
});
```

### 10.6 CORS & Security Headers

**Next.js Configuration:**
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_APP_URL || '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, PATCH, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};
```

### 10.7 Audit Logging

**Implementation:**
```typescript
// lib/audit-logger.ts
export async function logAuditEvent(
  action: string,
  entity: string,
  entityId: string,
  userId: string | null,
  metadata?: any
) {
  await prisma.auditLog.create({
    data: {
      action,
      entity,
      entityId,
      userId,
      metadata,
    },
  });
}

// Usage:
await logAuditEvent(
  'investment_created',
  'Investment',
  investment.id,
  userId,
  { propertyId, shares, amount }
);

await logAuditEvent(
  'contract_signed',
  'Contract',
  contract.id,
  userId,
  { signatureType: 'DILITHIUM' }
);
```

---

## 11. Implementation Roadmap

### 11.1 Phase 1: Foundation (Week 1-2)

**Goal:** Set up backend infrastructure and core services

**Tasks:**
1. **Backend Setup**
   - [ ] Create `backend/` directory structure
   - [ ] Initialize `package.json` with dependencies
   - [ ] Configure TypeScript (`tsconfig.json`)
   - [ ] Set up Prisma schema (copy from frontend, enhance)
   - [ ] Create initial migration

2. **Database Setup**
   - [ ] Set up PostgreSQL database (Supabase/Neon/Railway)
   - [ ] Run Prisma migrations
   - [ ] Seed demo properties (script)
   - [ ] Test database connection

3. **Core Services**
   - [ ] Implement `PropertyService` (CRUD)
   - [ ] Implement `InvestmentService` (basic)
   - [ ] Implement `PaymentService` (Stripe intent only)
   - [ ] Set up Stripe webhook endpoint

4. **API Routes**
   - [ ] `/api/properties` (GET, GET/:id)
   - [ ] `/api/properties/:id/invest` (POST)
   - [ ] `/api/payments/stripe/intent` (POST)
   - [ ] `/api/payments/stripe/webhook` (POST)

5. **Testing**
   - [ ] Unit tests for services
   - [ ] Integration tests for API routes
   - [ ] Manual testing with Stripe sandbox

**Deliverables:**
- Backend folder structure created
- Database connected and seeded
- Property listing and investment creation working
- Stripe payment flow functional (sandbox)

---

### 11.2 Phase 2: Smart Contracts & Blockchain (Week 3)

**Goal:** Deploy smart contracts and integrate blockchain

**Tasks:**
1. **Smart Contract Development**
   - [ ] Create `PropertyToken.sol` (ERC-721 or ERC-1155)
   - [ ] Create `InvestmentManager.sol`
   - [ ] Write tests for contracts (Hardhat)
   - [ ] Deploy to Sepolia testnet
   - [ ] Verify on Etherscan

2. **Blockchain Integration**
   - [ ] Implement `BlockchainBridge` service
   - [ ] NFT minting logic
   - [ ] Property registration on-chain
   - [ ] Transaction monitoring

3. **Frontend Updates**
   - [ ] Display NFT token ID on dashboard
   - [ ] Link to Etherscan for transactions
   - [ ] Wallet connection for crypto payments

4. **Crypto Payments**
   - [ ] `/api/payments/crypto` endpoint
   - [ ] USDC transfer verification
   - [ ] Update investment with tx hash

**Deliverables:**
- Smart contracts deployed to Sepolia
- NFT minting working end-to-end
- Crypto payment option functional

---

### 11.3 Phase 3: Contract Generation & AI (Week 4)

**Goal:** Automated contract generation and AI auditor

**Tasks:**
1. **Contract Generation**
   - [ ] Create Handlebars templates
   - [ ] Implement `ContractService`
   - [ ] PDF generation with Puppeteer
   - [ ] IPFS upload via Pinata
   - [ ] `/api/contracts/generate` endpoint

2. **AI Auditor**
   - [ ] Implement `AIAuditorService`
   - [ ] Anthropic Claude integration
   - [ ] Prompt engineering for contract analysis
   - [ ] `/api/ai/audit` endpoint
   - [ ] Display AI results on frontend

3. **Contract Signing**
   - [ ] `/api/contracts/:id/sign` endpoint
   - [ ] Classical ECDSA signature (MVP)
   - [ ] Update contract status to SIGNED
   - [ ] Link contract to investment

4. **Frontend Pages**
   - [ ] Contract viewer page (`/contracts/:id`)
   - [ ] AI audit summary display
   - [ ] PDF download link

**Deliverables:**
- Automated contract generation working
- AI auditor analyzing contracts
- Contract signing flow complete

---

### 11.4 Phase 4: PQC Integration (Optional - Week 5)

**Goal:** Real post-quantum cryptography implementation

**Tasks:**
1. **liboqs Setup**
   - [ ] Install liboqs library
   - [ ] Create Node.js bindings (or use WASM)
   - [ ] Test Dilithium3 signatures

2. **PQC Service**
   - [ ] Implement `PQCService` with liboqs
   - [ ] Key generation and management
   - [ ] Signature and verification functions
   - [ ] `
/api/pqc/sign` and `/api/pqc/verify` endpoints

3. **Contract Signing Update**
   - [ ] Replace ECDSA with Dilithium signatures
   - [ ] Update signature storage in database
   - [ ] Display PQC badge on signed contracts

4. **Testing**
   - [ ] Test signature generation speed
   - [ ] Verify signature validation
   - [ ] Benchmark performance vs ECDSA

**Deliverables:**
- Real PQC signatures (Dilithium3)
- PQC badge meaningful (not just visual)
- Performance acceptable (<500ms per signature)

**Note:** This phase is OPTIONAL for MVP. Can be deferred to Phase 2 of project if timeline is tight. Use classical ECDSA + visual PQC badge for MVP demo.

---

### 11.5 Phase 5: Frontend Integration & Polish (Week 6)

**Goal:** Complete frontend pages and UX improvements

**Tasks:**
1. **New Pages**
   - [ ] Marketplace page (`/marketplace`)
   - [ ] Property details page (`/property/:id`)
   - [ ] Investments page (`/investments`)
   - [ ] Contract list page (`/contracts`)

2. **Dashboard Enhancements**
   - [ ] Portfolio overview cards
   - [ ] Investment performance charts
   - [ ] Recent dividends list
   - [ ] Quick actions (view contract, etc.)

3. **UX Improvements**
   - [ ] Loading states for all async actions
   - [ ] Error handling and user-friendly messages
   - [ ] Success animations (confetti on investment)
   - [ ] Mobile responsiveness

4. **Demo Mode**
   - [ ] Keep `/demo` page for quick demo
   - [ ] Add "Try Demo" vs "Real Investment" modes
   - [ ] Populate with demo properties

5. **Documentation**
   - [ ] User guide / FAQ
   - [ ] API documentation (Swagger/OpenAPI)
   - [ ] Developer docs for integration

**Deliverables:**
- Full user flow functional from landing to dashboard
- Professional UX with smooth transitions
- Demo mode for showcasing without real payments

---

### 11.6 Phase 6: Testing & Deployment (Week 7)

**Goal:** Comprehensive testing and production deployment

**Tasks:**
1. **Testing**
   - [ ] End-to-end tests (Playwright/Cypress)
   - [ ] API integration tests (Supertest)
   - [ ] Smart contract tests (Hardhat)
   - [ ] Load testing (Artillery/k6)
   - [ ] Security audit (manual + automated tools)

2. **Bug Fixes**
   - [ ] Fix all critical bugs
   - [ ] Address edge cases
   - [ ] Optimize performance bottlenecks

3. **Production Setup**
   - [ ] Set up production database (PostgreSQL)
   - [ ] Configure environment variables (Vercel)
   - [ ] Deploy smart contracts to mainnet (or keep testnet)
   - [ ] Set up monitoring (Sentry, Datadog)

4. **Final Polish**
   - [ ] Review all copy and translations
   - [ ] Optimize images and assets
   - [ ] Set up analytics (Google Analytics, PostHog)
   - [ ] Create launch checklist

**Deliverables:**
- MVP fully tested and bug-free
- Deployed to production (quantpaychain.com)
- Monitoring and analytics in place

---

### 11.7 Post-MVP: Future Enhancements

**Phase 2 (Month 2-3):**
- Real PQC integration (if not done in Phase 4)
- Mainnet deployment of smart contracts
- Enhanced AI auditor (more detailed analysis)
- Secondary market for shares (peer-to-peer trading)
- Mobile app (React Native)
- Advanced analytics and reporting
- Dividend distribution automation
- Multi-language support (beyond EN/ES)

**Phase 3 (Month 4-6):**
- Institutional dashboard (for property managers)
- White-label solution for partners
- Advanced compliance (KYC/AML providers, accredited investor verification)
- Integration with more payment methods (bank wires, crypto exchanges)
- Staking and yield farming for governance token
- DAO governance for protocol decisions
- Cross-chain bridges (Polygon, Avalanche, etc.)

---

## 12. Key Decisions & Trade-offs

### 12.1 MVP Simplifications

**Decisions Made for Speed:**

1. **PQC Implementation**
   - **Decision**: Use classical ECDSA + visual PQC badge for MVP
   - **Rationale**: liboqs integration complex (1-2 weeks), not critical for demo
   - **Trade-off**: Marketing claims should be "PQC-ready" not "PQC-secured"
   - **Future**: Full Dilithium integration in Phase 2

2. **Smart Contract Scope**
   - **Decision**: Deploy to Sepolia testnet only for MVP
   - **Rationale**: Mainnet gas fees expensive, testnet sufficient for demo
   - **Trade-off**: Investors can't use real money (demo only)
   - **Future**: Mainnet launch after security audits

3. **AI Auditor Depth**
   - **Decision**: Basic contract analysis (clause extraction + simple risk assessment)
   - **Rationale**: Full legal analysis requires domain-specific training
   - **Trade-off**: AI output is informational, not legally binding advice
   - **Future**: Partner with legal tech companies for deeper analysis

4. **Payment Methods**
   - **Decision**: Stripe (card) + MetaMask (USDC) only
   - **Rationale**: Cover both fiat and crypto, sufficient for MVP
   - **Trade-off**: No bank wires, other cryptos, or SEPA payments
   - **Future**: Add more payment methods based on user demand

5. **Database**
   - **Decision**: PostgreSQL (managed service like Supabase/Neon)
   - **Rationale**: Relational data, ACID transactions, Prisma support
   - **Trade-off**: Not as scalable as NoSQL for extremely high throughput
   - **Future**: Add Redis caching, consider read replicas

6. **Frontend Framework**
   - **Decision**: Keep Next.js 14 (already implemented)
   - **Rationale**: Excellent for SSR, API routes, SEO
   - **Trade-off**: Serverless functions have cold starts, execution limits
   - **Future**: Consider separate backend server if API routes become limiting

### 12.2 Technical Debt Items

**Items to Address Post-MVP:**

1. **Authentication**
   - Current: JWT sessions (no database persistence)
   - Future: Database sessions for better security and session management

2. **Error Handling**
   - Current: Basic error responses
   - Future: Standardized error codes, detailed logging, user-friendly messages

3. **Testing Coverage**
   - Current: Smart contract tests only
   - Future: 80%+ test coverage for backend services

4. **Rate Limiting**
   - Current: No rate limiting
   - Future: Redis-based rate limiting on all API routes

5. **Monitoring**
   - Current: None
   - Future: Sentry (errors), Datadog (metrics), PagerDuty (alerts)

6. **Documentation**
   - Current: This architecture doc
   - Future: API docs (Swagger), user guides, developer docs

7. **Caching**
   - Current: No caching layer
   - Future: Redis for property listings, user data

8. **Database Optimization**
   - Current: Basic indexes
   - Future: Query optimization, connection pooling, read replicas

---

## 13. Environment Variables

### 13.1 Required Environment Variables

**`.env` file for backend:**

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/quantpaychain"

# NextAuth
NEXTAUTH_URL="https://quantpaychain.com"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"

# Stripe (Sandbox for MVP)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Blockchain (Sepolia Testnet)
ALCHEMY_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY"
BACKEND_PRIVATE_KEY="0x..." # Backend wallet for contract interactions
PAYMENT_WALLET_ADDRESS="0x..." # Address to receive crypto payments

# Smart Contracts (Sepolia)
PROPERTY_TOKEN_CONTRACT_ADDRESS="0x..."
INVESTMENT_MANAGER_CONTRACT_ADDRESS="0x..."
DOCUMENT_REGISTRY_CONTRACT_ADDRESS="0x..."

# IPFS (Pinata)
PINATA_API_KEY="your_api_key"
PINATA_SECRET="your_secret"
PINATA_JWT="your_jwt_token"

# AI (Anthropic Claude)
ANTHROPIC_API_KEY="sk-ant-..."

# PQC (if implementing Phase 4)
LIBOQS_PATH="/usr/local/bin"

# Encryption
ENCRYPTION_KEY="32_byte_hex_key_here"

# Monitoring (optional for MVP)
SENTRY_DSN="https://..."
SENTRY_AUTH_TOKEN="..."

# AWS (optional, if using S3 backup)
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_BUCKET_NAME="quantpaychain-docs"
AWS_REGION="us-east-1"

# Email (optional for MVP)
SENDGRID_API_KEY="..."
SENDGRID_FROM_EMAIL="no-reply@quantpaychain.com"

# Rate Limiting (if using Upstash)
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# Public Variables (Next.js, prefix with NEXT_PUBLIC_)
NEXT_PUBLIC_APP_URL="https://quantpaychain.com"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID="..."
NEXT_PUBLIC_ALCHEMY_API_KEY="..."
```

### 13.2 Vercel Environment Variables

**Setup in Vercel Dashboard:**
1. Go to Project Settings → Environment Variables
2. Add all variables from `.env`
3. Set environment for each:
   - **Production**: Live deployment
   - **Preview**: Pull request previews
   - **Development**: Local development
4. Sensitive variables: Mark as "Encrypted"
5. Public variables: Available in browser (NEXT_PUBLIC_*)

---

## 14. Deployment Checklist

### 14.1 Pre-Deployment

- [ ] All environment variables configured in Vercel
- [ ] Database migrations run (`npx prisma migrate deploy`)
- [ ] Demo properties seeded in database
- [ ] Smart contracts deployed to Sepolia
- [ ] Stripe webhook endpoint registered
- [ ] IPFS (Pinata) account set up and tested
- [ ] Anthropic API key valid and has credits
- [ ] Domain DNS configured (quantpaychain.com)
- [ ] SSL certificate active (Vercel handles this automatically)

### 14.2 Testing Checklist

- [ ] User registration works (email + password)
- [ ] User login works (email + Web3)
- [ ] Property listing displays correctly
- [ ] Property details page shows all info
- [ ] Investment flow: property → payment → contract → dashboard
- [ ] Stripe payment (sandbox) processes correctly
- [ ] Stripe webhook updates investment status
- [ ] Contract generation completes successfully
- [ ] Contract PDF downloadable
- [ ] AI audit results display correctly
- [ ] Contract signing works
- [ ] NFT minting completes (check Etherscan)
- [ ] Dashboard shows investment details
- [ ] Mobile responsive design works
- [ ] All links functional (no 404s)
- [ ] Error handling works (payment failure, etc.)

### 14.3 Post-Deployment

- [ ] Smoke tests on production URL
- [ ] Monitor Vercel logs for errors
- [ ] Check Sentry for any exceptions (if configured)
- [ ] Test payment flow with real Stripe test cards
- [ ] Verify blockchain transactions on Etherscan
- [ ] Set up Google Analytics / PostHog
- [ ] Create backup of production database
- [ ] Document deployment process
- [ ] Prepare rollback plan (if needed)

---

## 15. Success Metrics

### 15.1 MVP Goals

**Technical Metrics:**
- ✅ 60-second investment flow (landing → dashboard)
- ✅ 99.9% uptime (Vercel SLA)
- ✅ <2 second page load times
- ✅ Zero critical bugs in production
- ✅ All smart contract tests passing

**Business Metrics:**
- 🎯 10 demo investments completed
- 🎯 5 properties listed
- 🎯 Positive feedback from 10 demo users
- 🎯 Zero payment failures (Stripe sandbox)
- 🎯 100% contract generation success rate

**User Experience:**
- 🎯 Clear and intuitive UI
- 🎯 Mobile responsive
- 🎯 Accessibility (WCAG AA)
- 🎯 Fast loading and interactions
- 🎯 Helpful error messages

### 15.2 Post-MVP Targets (Month 2-3)

- 📈 100+ registered users
- 📈 50+ completed investments
- 📈 $100,000+ total investment volume (testnet)
- 📈 20+ properties listed
- 📈 95% user satisfaction (NPS score)
- 📈 50+ NFTs minted
- 📈 10+ partner integrations

---

## 16. Risk Mitigation

### 16.1 Technical Risks

**Risk: Smart Contract Bugs**
- **Mitigation**: Thorough testing, security audits, testnet-only for MVP
- **Contingency**: Bug bounty program, ability to pause contracts

**Risk: Payment Processing Failures**
- **Mitigation**: Stripe sandbox testing, webhook verification, retry logic
- **Contingency**: Manual payment reconciliation, customer support

**Risk: IPFS Downtime**
- **Mitigation**: Use reliable provider (Pinata), backup to S3
- **Contingency**: Fallback to S3 if IPFS unavailable

**Risk: AI API Limits/Costs**
- **Mitigation**: Rate limiting, caching results, monthly budget alerts
- **Contingency**: Fallback to basic contract parsing without AI

**Risk: Database Performance**
- **Mitigation**: Proper indexing, query optimization, managed service SLA
- **Contingency**: Read replicas, connection pooling

### 16.2 Business Risks

**Risk: Regulatory Compliance Issues**
- **Mitigation**: Legal review, conservative approach (accredited investors only)
- **Contingency**: Pivot to B2B white-label, regulatory sandbox applications

**Risk: Low User Adoption**
- **Mitigation**: Focus on UX, demo mode for easy testing, marketing efforts
- **Contingency**: Iterate based on feedback, pivot features

**Risk: Competition**
- **Mitigation**: First-mover advantage in PQC space, superior UX
- **Contingency**: Differentiate on specific verticals (real estate focus)

### 16.3 Security Risks

**Risk: Private Key Compromise**
- **Mitigation**: Hardware wallets, multi-sig, regular key rotation
- **Contingency**: Emergency pause functionality, insurance coverage

**Risk: SQL Injection / XSS**
- **Mitigation**: Prisma ORM (parameterized queries), input validation (Zod)
- **Contingency**: WAF (Cloudflare), regular security audits

**Risk: DDoS Attack**
- **Mitigation**: Vercel edge network, rate limiting, Cloudflare
- **Contingency**: Scale up resources, IP blocking

---

## 17. Support & Maintenance

### 17.1 Monitoring

**Tools:**
- **Vercel Analytics**: Performance monitoring
- **Sentry**: Error tracking and alerting
- **Uptime Robot**: Endpoint uptime checks
- **Etherscan**: Blockchain transaction monitoring

**Alerts:**
- Payment failures (immediate)
- Contract generation errors (15 min)
- API errors >5% (5 min)
- Database connection issues (immediate)

### 17.2 Backup Strategy

**Database:**
- Automatic daily backups (Supabase/Neon)
- Weekly manual backups to S3
- Point-in-time recovery (7 days)

**Smart Contracts:**
- Immutable on blockchain (no backup needed)
- Keep deployment scripts and ABIs in git

**Documents:**
- IPFS (permanent, decentralized)
- Optional S3 backup for critical documents

### 17.3 Incident Response

**Process:**
1. **Detection**: Monitoring alerts or user reports
2. **Assessment**: Determine severity and impact
3. **Notification**: Alert team, inform users if needed
4. **Mitigation**: Apply fix or workaround
5. **Resolution**: Deploy fix to production
6. **Post-Mortem**: Document incident, improve processes

**Severity Levels:**
- **Critical**: Site down, payment failures
- **High**: Major feature broken, data loss risk
- **Medium**: Minor feature broken, performance degradation
- **Low**: Cosmetic issues, minor bugs

---

## 18. Conclusion

### 18.1 Summary

This architecture document provides a **comprehensive blueprint** for implementing the QuantPay Chain backend, enabling the vision of a post-quantum secure, multi-currency payment platform for fractional real estate investment.

**Key Highlights:**
- **Modular Architecture**: Services layer for business logic, clear separation of concerns
- **Modern Stack**: Node.js + TypeScript + Prisma + PostgreSQL
- **Payment Flexibility**: Stripe (USD) + Crypto (USDC/USDT)
- **Smart Contracts**: ERC-721 NFTs for ownership, testnet deployment for MVP
- **AI Integration**: Automated contract analysis and risk assessment
- **PQC Ready**: Classical signatures for MVP, full PQC in Phase 2
- **60-Second Flow**: Optimized for rapid user onboarding and investment

### 18.2 MVP vs Full Vision

**MVP Scope (6-7 Weeks):**
✅ Property marketplace with filtering  
✅ Stripe payment integration (sandbox)  
✅ Crypto payments (USDC on testnet)  
✅ Automated contract generation (PDF + IPFS)  
✅ AI auditor (basic clause extraction)  
✅ Classical ECDSA signatures + PQC badge  
✅ NFT minting on Sepolia testnet  
✅ User dashboard with portfolio view  

**Post-MVP Enhancements:**
🔮 Real PQC signatures (Dilithium3)  
🔮 Mainnet deployment of contracts  
🔮 Advanced AI auditor (legal compliance checks)  
🔮 Secondary market for share trading  
🔮 Dividend distribution automation  
🔮 Mobile app (React Native)  
🔮 Institutional dashboard  
🔮 White-label solution for partners  

### 18.3 Next Steps

**Immediate Actions:**
1. Review this document with the team
2. Clarify any ambiguities or requirements
3. Set up development environment
4. Begin Phase 1 implementation (backend foundation)
5. Iterate on architecture based on technical discoveries

**Developer Assignments:**
- **Backend Lead**: Core services, API routes
- **Smart Contract Dev**: PropertyToken, InvestmentManager contracts
- **Frontend Dev**: New pages, dashboard enhancements
- **DevOps**: Database setup, deployment pipeline

**Timeline:**
- **Week 1-2**: Foundation (database, core services)
- **Week 3**: Smart contracts deployment
- **Week 4**: Contract generation + AI
- **Week 5**: (Optional) PQC integration
- **Week 6**: Frontend integration + polish
- **Week 7**: Testing + deployment

**Target Launch Date:** December 1, 2025 (6 weeks from now)

### 18.4 Open Questions

**To Resolve Before Implementation:**
1. **PQC MVP Decision**: Include real Dilithium signatures (Week 5) or defer to Phase 2?
2. **Smart Contract Security**: Budget for third-party audit before mainnet launch?
3. **AI Provider**: Anthropic Claude vs OpenAI GPT-4? (Cost vs performance)
4. **Database Provider**: Supabase vs Neon vs Railway? (Free tier, scaling, pricing)
5. **Legal Review**: Need lawyer review of contract templates before MVP?
6. **KYC/AML**: Implement basic KYC for MVP or skip for testnet demo?

**Recommendations:**
- ✅ Defer real PQC to Phase 2 (save 1 week)
- ✅ Use Anthropic Claude (better reasoning, cost-effective)
- ✅ Use Supabase (generous free tier, good DX)
- ✅ Lawyer review optional for testnet demo (add disclaimer)
- ✅ Skip KYC for MVP (testnet only, no real money)

### 18.5 Contact & Collaboration

**Documentation:**
- Architecture: `BACKEND_ARCHITECTURE.md` (this document)
- Frontend Status: `PROJECT_STATUS.md`
- Whitepaper: `WHITEPAPER_EN.md`

**GitHub Repository:**
- URL: https://github.com/francoMengarelli/quantpaychain-mvpro
- Branch Strategy: `main` (production), `develop` (staging), feature branches

**Communication:**
- Daily standups: Progress updates, blockers
- Weekly reviews: Demo progress, adjust timeline
- Documentation: Update architecture doc as needed

---

## 19. Appendix

### A. Glossary

- **PQC**: Post-Quantum Cryptography
- **RWA**: Real-World Assets
- **MVP**: Minimum Viable Product
- **KYC**: Know Your Customer
- **AML**: Anti-Money Laundering
- **USDC**: USD Coin (stablecoin)
- **ERC-721**: Ethereum NFT standard
- **IPFS**: InterPlanetary File System
- **liboqs**: Open Quantum Safe library
- **Dilithium**: NIST-approved PQC signature algorithm

### B. References

**Technical Documentation:**
- NIST Post-Quantum Cryptography: https://csrc.nist.gov/projects/post-quantum-cryptography
- liboqs Documentation: https://github.com/open-quantum-safe/liboqs
- Prisma Docs: https://www.prisma.io/docs
- Stripe API: https://stripe.com/docs/api
- Ethers.js: https://docs.ethers.org/v6/
- Anthropic Claude: https://docs.anthropic.com/

**Smart Contract Standards:**
- ERC-721: https://eips.ethereum.org/EIPS/eip-721
- ERC-1155: https://eips.ethereum.org/EIPS/eip-1155
- OpenZeppelin: https://docs.openzeppelin.com/contracts/

**Security:**
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Smart Contract Security Best Practices: https://consensys.github.io/smart-contract-best-practices/

### C. Code Examples Repository

**Example Services:**
- `PropertyService.ts`: Complete CRUD implementation
- `PaymentService.ts`: Stripe + crypto payment handling
- `ContractService.ts`: PDF generation + IPFS upload
- `AIAuditorService.ts`: Claude API integration
- `BlockchainBridge.ts`: Smart contract interaction

**Example API Routes:**
- `/api/properties/route.ts`: Property listing
- `/api/investments/route.ts`: Investment creation
- `/api/payments/stripe/webhook/route.ts`: Stripe webhook
- `/api/contracts/generate/route.ts`: Contract generation

**Example Smart Contracts:**
- `PropertyToken.sol`: ERC-721 NFT for ownership
- `InvestmentManager.sol`: Investment tracking

**Example Tests:**
- `PropertyService.test.ts`: Unit tests
- `investment-flow.e2e.test.ts`: End-to-end tests
- `PropertyToken.test.ts`: Smart contract tests

All examples are **pseudo-code** in this document. Actual implementation will be in the codebase.

---

## 20. Document Revision History

| Version | Date       | Author  | Changes                                  |
|---------|------------|---------|------------------------------------------|
| 1.0     | Oct 24, 2025 | AI Assistant | Initial architecture document created   |
| -       | -          | -       | Future revisions will be logged here     |

---

**End of Document**

This architecture blueprint is ready for implementation. It provides:
✅ Complete backend structure  
✅ Detailed API specifications  
✅ Database schema with all models  
✅ Service layer design  
✅ Smart contract integration plan  
✅ Payment processing (Stripe + crypto)  
✅ Contract generation workflow  
✅ AI auditor implementation  
✅ PQC roadmap (MVP + future)  
✅ Security considerations  
✅ 6-week implementation plan  

**Next Step:** Review with team, clarify questions, begin Phase 1 implementation. Let's build the future of quantum-secure real estate investment! 🚀
