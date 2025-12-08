
# QPC v2 Core

[![License: MIT](https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/MIT_Logo_New.svg/250px-MIT_Logo_New.svg.png)
[![TypeScript](https://i.ytimg.com/vi/4cgpu9L2AE8/maxresdefault.jpg)
[![Tests](https://png.pngtree.com/png-vector/20230923/ourmid/pngtree-passed-stamp-shows-quality-control-approved-satisfied-png-image_10044870.png)

Post-Quantum Cryptography Core for QuantPay Chain - A secure, ISO 20022 compliant payment processing platform with integrated AI-powered KYC/AML capabilities.

## 🚀 Features

### 🔐 Post-Quantum Cryptography (PQC) Layer
- **ML-KEM-768 (Kyber)** for quantum-resistant key exchange
- **ML-DSA-65 (Dilithium)** for digital signatures and contract signing
- **Hybrid cryptography mode** supporting both PQC and classical algorithms
- Secure key management with generation, storage, and rotation capabilities
- Contract signing and verification infrastructure

### 🏦 ISO 20022 Gateway
- Full support for ISO 20022 XML payment messages:
  - `pain.001` - Customer Credit Transfer Initiation
  - `pacs.008` - Financial Institution Credit Transfer
  - `camt.053` - Bank to Customer Statement
- XML parsing and validation with schema compliance
- Bidirectional transformation between ISO 20022 and internal formats
- Comprehensive error handling and logging

### 🤖 AI KYC/AML Engine
- Real-time risk scoring algorithm for transactions
- Sanctions list checking and compliance verification
- Pattern detection for suspicious activity
- Document verification with OCR capabilities
- Configurable rules engine for compliance policies
- Detailed compliance reporting

## 📦 Installation

```bash
npm install @quantpaychain/qpc-v2-core
```

## 🏗️ Architecture

```
qpc-v2-core/
├── core/
│   ├── iso20022-gateway/    # ISO 20022 message processing
│   ├── pqc-layer/            # Post-quantum cryptography
│   └── ai-kyc-aml/           # KYC/AML compliance engine
├── tests/
│   ├── unit/                 # Unit tests (>80% coverage)
│   ├── integration/          # Integration tests
│   └── e2e/                  # End-to-end tests
├── examples/                 # Working demos and examples
└── docs/                     # Comprehensive documentation
```

## 🔧 Quick Start

### Basic Usage

```typescript
import { ISO20022Gateway, PQCLayer, AIKYCAMLEngine } from '@quantpaychain/qpc-v2-core';

// Initialize components
const gateway = new ISO20022Gateway();
const pqc = new PQCLayer();
const kyc = new AIKYCAMLEngine();

// Process ISO 20022 message
const xmlMessage = '<?xml version="1.0"?>...';
const parsedMessage = await gateway.parse(xmlMessage);

// Generate PQC keys
const keyPair = await pqc.generateKeyPair('ML-KEM-768');

// Perform KYC check
const riskScore = await kyc.assessRisk(transaction);
```

### Running Examples

```bash
# ISO 20022 demo
npm run example:iso20022

# PQC signature demo
npm run example:pqc

# KYC/AML check demo
npm run example:kyc
```

## 🧪 Testing

```bash
# Run all tests with coverage
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e

# Watch mode for development
npm run test:watch
```

## 📚 Documentation

Detailed documentation is available in the `/docs` directory:

- [Architecture Overview](docs/ARCHITECTURE.md)
- [API Documentation](docs/API.md)
- [Integration Guide](docs/INTEGRATION.md)
- [Configuration Guide](docs/CONFIGURATION.md)
- [Performance Benchmarks](docs/PERFORMANCE.md)

## 🔒 Security

This project implements cutting-edge post-quantum cryptography algorithms to ensure long-term security against quantum computing threats:

- **NIST-approved PQC algorithms** (ML-KEM-768, ML-DSA-65)
- **Hybrid cryptography** for backward compatibility
- **Secure key management** with proper rotation policies
- **Comprehensive audit logging** for compliance

## 🤝 Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 👥 Authors

- Franco Mengarelli <fmengarelli@gmail.com>

## 🌟 Acknowledgments

- Open Quantum Safe (OQS) project for PQC implementations
- ISO 20022 standards organization
- QuantPay Chain community

---

**Note**: This is production-ready code designed for secure payment processing and digital contract management with post-quantum security guarantees.
