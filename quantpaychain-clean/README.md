# QuantPay Chain - RWA Tokenization Platform

> Next.js + FastAPI + Supabase | Multi-chain RWA marketplace with ISO 20022 compliance

## 🎯 Overview

QuantPay Chain is an institutional-grade platform for tokenizing Real World Assets (RWAs).

**Key Features**:
- Multi-chain support (Ethereum, Polygon, Avalanche)
- ISO 20022 financial messaging compliance
- Post-quantum cryptography (planned)
- Web3 wallet integration (RainbowKit + Wagmi)

## 🚀 Quick Start

```bash
# Install dependencies
yarn install

# Start development
yarn dev

# Build for production
yarn build
```

## 📦 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: FastAPI (planned), Supabase
- **Web3**: RainbowKit, Wagmi v2, Viem
- **Deployment**: Vercel

## 🔧 Environment Variables

Create `apps/web/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

## 📚 Documentation

- [Architecture](./ARQUITECTURA_MASTER.md)
- [Migration Plan](./PLAN_MIGRACION_CORE.md)

## 📄 License

Proprietary - All rights reserved
