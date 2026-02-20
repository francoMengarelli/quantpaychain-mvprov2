
# 🔗 QuantPay Chain MVP - Web3 DocuSign Alternative

[![Deploy to Vercel](https://placehold.co/1200x600/e2e8f0/1e293b?text=A__Deploy_to_Vercel__button_image__typically_a_rec)
[![License: MIT](https://placehold.co/1200x600/e2e8f0/1e293b?text=A_yellow_MIT_License_badge_with_the_text__License_)
[![TypeScript](https://placehold.co/1200x600/e2e8f0/1e293b?text=A_badge_style_image_showing__TypeScript_5_2__with_)
[![Next.js](https://placehold.co/1200x600/e2e8f0/1e293b?text=A_badge_style_image_showing__Next_js_14_2__with_a_)

[🇪🇸 Español](./README-ES.md) | [🇺🇸 English](./README.md)

A decentralized document signing platform powered by blockchain technology, IPFS storage, and smart contracts. Transform your document workflow with immutable, cryptographically secure digital signatures.

## 🚀 Live Demo

- **Production URL**: [www.quantpaychain.com](https://www.quantpaychain.com)
- **Demo Credentials**: demo@quantpaychain.com / demo123
- **Wallet Integration**: MetaMask + WalletConnect supported

## ✨ Key Features

### 🔐 Core Functionality
- **DocuSign Web3**: Upload documents → IPFS storage → Blockchain registration with immutable timestamps
- **Multi-Signature Workflows**: Support for multiple signers with conditional logic
- **Wallet Authentication**: MetaMask integration with SIWE (Sign-In with Ethereum)
- **Real-time Tracking**: Monitor document status and signatures instantly

### 💰 Monetization
- **Freemium Model**: 3 free documents/month, then upgrade
- **Starter Plan**: $99/month for 50 documents + advanced features
- **Professional Plan**: $499/month for 500 documents + enterprise features

### 🌐 Multi-Language Support
- **English** and **Spanish** interfaces
- Dynamic language switching
- Internationalized content and documentation

## 🏗️ Architecture

```
quantpay-chain-mvp/
├── frontend/app/           # Next.js 14 Application
│   ├── app/               # App Router (pages & API routes)
│   ├── components/        # Reusable UI components
│   ├── lib/              # Utilities & configurations
│   └── prisma/           # Database schema & migrations
├── contracts/            # Solidity Smart Contracts
│   ├── contracts/        # DocumentRegistry.sol
│   ├── scripts/          # Deploy & test scripts
│   └── test/            # Contract tests
├── docs/                # Documentation
│   ├── whitepaper.md    # Technical whitepaper
│   └── api/            # API documentation
└── .github/            # CI/CD workflows
```

### Tech Stack

#### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **State**: Zustand + React Query
- **Authentication**: NextAuth.js + SIWE
- **Blockchain**: Wagmi + RainbowKit + ethers.js
- **Internationalization**: react-i18next

#### Backend
- **Database**: PostgreSQL + Prisma ORM
- **File Storage**: IPFS via Pinata
- **Authentication**: JWT + Web3 signatures
- **APIs**: REST endpoints

#### Blockchain
- **Contracts**: Solidity with OpenZeppelin
- **Networks**: Sepolia (testnet) + Ethereum/Polygon (mainnet)
- **Development**: Hardhat
- **Storage**: IPFS for documents

## 🚀 Quick Start

### Prerequisites

```bash
Node.js >= 18
PostgreSQL >= 13
Git
MetaMask or compatible Web3 wallet
```

### 1. Clone & Install

```bash
git clone https://github.com/your-username/quantpay-chain-mvp.git
cd quantpay-chain-mvp/frontend/app
yarn install
```

### 2. Environment Setup

Create `.env` file:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/quantpay"

# Authentication
NEXTAUTH_SECRET="your-super-secure-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# File Storage (IPFS)
PINATA_JWT="your-pinata-jwt-token"
NEXT_PUBLIC_PINATA_API_KEY="your-pinata-api-key"
NEXT_PUBLIC_PINATA_SECRET="your-pinata-secret"

# Web3
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID="your-walletconnect-project-id"

# Optional: AWS S3 (alternative storage)
AWS_BUCKET_NAME="your-s3-bucket"
AWS_REGION="us-west-2"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Apply database schema
npx prisma db push

# Seed with demo data
yarn prisma db seed
```

### 4. Smart Contracts (Optional)

```bash
cd ../../contracts
npm install

# Deploy to Sepolia testnet
npx hardhat deploy --network sepolia

# Run tests
npx hardhat test
```

### 5. Run Development Server

```bash
cd ../frontend/app
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🌍 Production Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project" → Import from GitHub
   - Select your repository
   - Set root directory to `frontend/app`

3. **Environment Variables**
   Add all environment variables from `.env` to Vercel dashboard

4. **Custom Domain**
   - In Vercel dashboard → Settings → Domains
   - Add `www.quantpaychain.com`
   - Configure DNS with your domain provider:
     ```
     CNAME www your-vercel-deployment.vercel.app
     ```

### Alternative: Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY frontend/app/package*.json ./
RUN npm install
COPY frontend/app .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t quantpay-chain .
docker run -p 3000:3000 quantpay-chain
```

## 💳 Business Model

### Freemium Tiers

| Plan | Price | Documents/Month | Features |
|------|-------|----------------|----------|
| **Free** | $0 | 3 | Basic verification, IPFS storage, Email support |
| **Starter** | $99 | 50 | Advanced verification, Custom templates, Priority support, API access |
| **Professional** | $499 | 500 | White-label, Advanced analytics, 24/7 support, Custom integrations |

### Revenue Streams
1. **SaaS Subscriptions**: Monthly recurring revenue
2. **Transaction Fees**: 0.5-1% on document processing (enterprise)
3. **API Licensing**: Enterprise API access
4. **Professional Services**: Custom integrations and consulting

## 🔧 Development

### Available Scripts

```bash
# Development
yarn dev                 # Start dev server
yarn build              # Build production
yarn start              # Start production server
yarn lint               # Run ESLint
yarn type-check         # TypeScript validation

# Database
npx prisma studio       # Database GUI
npx prisma db push      # Apply schema changes
npx prisma db seed      # Seed database
npx prisma generate     # Generate client

# Contracts
cd contracts/
npx hardhat compile     # Compile contracts
npx hardhat test        # Run tests
npx hardhat deploy      # Deploy to network
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `POST /api/auth/siwe` | POST | Web3 authentication |
| `POST /api/signup` | POST | Create user account |
| `POST /api/documents/upload` | POST | Upload document to IPFS + blockchain |
| `GET /api/documents/[id]` | GET | Get document details |
| `GET /api/documents/[id]/download` | GET | Download document file |
| `PUT /api/documents/[id]/sign` | PUT | Sign document |

### Database Schema

```sql
-- Core tables
User (id, email, name, walletAddress, plan, createdAt)
Document (id, title, ipfsHash, blockchainId, status, creatorId)
Signature (id, documentId, signerId, status, signedAt)
```

## 🧪 Testing

### Unit Tests
```bash
# Frontend tests
yarn test

# Contract tests
cd contracts/
npx hardhat test
```

### E2E Testing
```bash
# Install Playwright
npx playwright install

# Run E2E tests
npx playwright test
```

### Manual Testing Checklist

- [ ] User signup/signin (email + wallet)
- [ ] Document upload to IPFS
- [ ] Blockchain registration
- [ ] Multi-signer workflows
- [ ] Language switching (EN/ES)
- [ ] Mobile responsiveness
- [ ] Plan limits enforcement

## 🔒 Security

### Implemented Security Measures

- **Smart Contract Security**: OpenZeppelin standards
- **Web3 Authentication**: SIWE protocol
- **Data Encryption**: End-to-end encryption for sensitive data
- **Input Validation**: Comprehensive input sanitization
- **Rate Limiting**: API endpoint protection
- **CORS Protection**: Cross-origin request filtering

### Security Audit Checklist

- [ ] Smart contract audit (recommended: Trail of Bits, OpenZeppelin)
- [ ] Penetration testing
- [ ] IPFS content validation
- [ ] Database security review
- [ ] API security assessment

## 📈 Monitoring & Analytics

### Metrics Tracked

- User signups and plan conversions
- Document upload/signing success rates
- IPFS storage utilization
- Blockchain interaction costs
- Revenue per user (RPU)
- Monthly recurring revenue (MRR)

### Tools Integration

- **Vercel Analytics**: Performance monitoring
- **PostHog**: User behavior analytics
- **Sentry**: Error tracking
- **Prisma Metrics**: Database performance

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Code formatting
- **Conventional Commits**: Semantic commit messages
- **Husky**: Pre-commit hooks

## 📋 Roadmap

### Phase 1: MVP (Current)
- [x] DocuSign Web3 functionality
- [x] Freemium monetization
- [x] Multi-language support
- [x] Basic dashboard

### Phase 2: Advanced Features (Q1 2025)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Webhook integrations
- [ ] Template marketplace

### Phase 3: Enterprise (Q2 2025)
- [ ] API SDK for developers
- [ ] White-label solutions
- [ ] Advanced compliance (SOC2, HIPAA)
- [ ] Enterprise SSO

### Phase 4: Multi-Chain (Q3 2025)
- [ ] Polygon integration
- [ ] Arbitrum support
- [ ] Cross-chain document verification
- [ ] Layer 2 optimization

## 🆘 Support & Community

- **Email**: support@quantpaychain.com
- **Discord**: [Join Community](https://discord.gg/quantpay)
- **Documentation**: [docs.quantpaychain.com](https://docs.quantpaychain.com)
- **Twitter**: [@QuantPayChain](https://twitter.com/quantpaychain)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Acknowledgments

- **OpenZeppelin**: Smart contract security standards
- **IPFS**: Decentralized storage protocol
- **Next.js**: React framework
- **shadcn/ui**: Beautiful UI components
- **Prisma**: Next-generation ORM

---

**Built with ❤️ for the Web3 community**

*Revolutionizing digital signatures with blockchain technology*
