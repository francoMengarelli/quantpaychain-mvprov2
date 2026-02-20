
# QuantPayChain MVP - English Documentation

**⚠️ AUTOMATIC TRANSLATION — REVIEW REQUIRED**
*This document has been automatically translated from Spanish. Technical review is recommended for accuracy.*

## Overview

QuantPayChain is a decentralized payment platform built on Ethereum that integrates post-quantum cryptography (PQC) to ensure long-term security against quantum threats. This MVP demonstrates the technical feasibility of combining smart contracts with quantum readiness.

## Key Features

### 1. Hybrid Security Architecture
- **Classical ECDSA**: Elliptic curve digital signatures for current compatibility
- **PQC Readiness**: Modular design for future integration of CRYSTALS-Kyber and Dilithium
- **Defense in Depth**: Multiple layers of cryptographic security

### 2. Smart Contracts
- **PaymentProcessor**: Payment management with escrow and dispute resolution
- **TokenManager**: ERC-20 token administration with advanced features
- **DisputeResolver**: Decentralized arbitration system
- **Governance**: On-chain voting and proposal mechanisms

### 3. Modern Frontend
- **Next.js 14**: React framework with App Router and Server Components
- **TypeScript**: Static typing for enhanced security
- **Tailwind CSS**: Responsive and modern design
- **Internationalization**: Full support for Spanish and English

### 4. Web3 Integration
- **ethers.js v6**: Ethereum blockchain interaction
- **MetaMask**: Wallet connection for users
- **Sepolia Testnet**: Test network for development

## Project Structure

```
quantpaychain-mvp/
├── contracts/           # Solidity smart contracts
│   ├── src/            # Contract source code
│   ├── test/           # Test suite (59 tests)
│   └── scripts/        # Deployment scripts
├── frontend/           # Next.js application
│   ├── app/            # Next.js App Router
│   ├── components/     # React components
│   ├── lib/            # Utilities and configuration
│   └── public/         # Static assets
├── docs/               # Complete documentation
│   ├── es/            # Spanish documentation
│   ├── en/            # English documentation
│   └── SECURITY-PQC.md # PQC security specifications
└── evidence/          # Validation evidence
```

## Technologies Used

### Backend (Contracts)
- **Solidity 0.8.20**: Smart contract language
- **Foundry**: Development and testing framework
- **OpenZeppelin**: Secure contract libraries

### Frontend
- **Next.js 14.2.5**: React framework
- **TypeScript 5.x**: Typed JavaScript superset
- **ethers.js 6.13.2**: Web3 library
- **Tailwind CSS 3.4.1**: Utility-first CSS framework
- **next-intl 3.17.2**: Internationalization

### DevOps
- **GitHub Actions**: Automated CI/CD
- **Vercel**: Deployment platform
- **ESLint/Prettier**: Code linting and formatting

## Security

### Audits and Testing
- **59 unit tests**: Complete contract coverage
- **Static analysis**: Vulnerability detection
- **Code review**: Solidity best practices

### Post-Quantum Cryptography
See [SECURITY-PQC.md](../SECURITY-PQC.md) for complete details on:
- Hybrid ECDSA + PQC approach
- CRYSTALS-Kyber and Dilithium algorithms
- Migration strategy
- Integration points

## Roadmap

### Phase 1: MVP (Completed) ✅
- Basic smart contracts
- Functional frontend with demo
- Internationalization
- Automated CI/CD

### Phase 2: PQC Integration (Q1 2025)
- CRYSTALS-Kyber implementation for key exchange
- Dilithium integration for digital signatures
- Testnet testing with hybrid cryptography

### Phase 3: Production (Q2-Q3 2025)
- Complete security audit
- Mainnet deployment
- Monitoring and optimization

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Contact and Support

For questions, suggestions, or bug reports:
- **GitHub Issues**: [quantpaychain-mvp/issues](https://github.com/francoMengarelli/quantpaychain-mvp/issues)
- **Documentation**: See `/docs` folder for detailed guides

## References

- [English Whitepaper](../whitepaper-en.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Contracts Documentation](./CONTRACTS.md)
- [Demo Guide](./DEMO.md)
