# QuantPayChain - Enterprise RWA Tokenization Platform

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/quantpaychain)
[![Status](https://img.shields.io/badge/status-production-green.svg)](https://quantpaychain-api.onrender.com)
[![License](https://img.shields.io/badge/license-MIT-purple.svg)](LICENSE)

> Institutional-grade platform for Real World Asset (RWA) tokenization with Post-Quantum Security, ISO 20022 Compliance, and AI-Powered Analytics.

## 🎯 What Makes QuantPayChain Unique

| Feature | QuantPayChain | Traditional Platforms |
|---------|---------------|----------------------|
| **Quantum Security** | ✅ Post-Quantum ready | ❌ Vulnerable to quantum |
| **Banking Integration** | ✅ ISO 20022 compliant | ⚠️ Limited compatibility |
| **AI Risk Analytics** | ✅ Real-time KYT | ❌ Manual review only |
| **Legal Automation** | ✅ AI Legal Advisor | ❌ External counsel needed |

---

## 🚀 Core Services

### 1. Post-Quantum Cryptography
Quantum-safe signatures and encryption (ML-DSA-65, ML-KEM-768, NIST Level 3)

### 2. ISO 20022 Messaging
Full compliance with international financial messaging standards

### 3. AI Risk Analytics
Real-time KYT, asset validation, and portfolio monitoring

### 4. AI Legal Advisor
Automated securities analysis and compliance roadmaps

### 5. RWA Platform
Complete tokenization workflow with marketplace and portfolio management

---

## 📡 Quick Start

### Live Deployment
- **Backend API**: https://quantpaychain-api.onrender.com
- **API Docs**: https://quantpaychain-api.onrender.com/docs
- **Frontend**: Deploy to Vercel

### Local Development

**Backend:**
```bash
cd apps/api
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd apps/web
yarn install
yarn dev
```

---

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Complete system architecture
- **[RISK_ANALYTICS_GUIDE.md](./RISK_ANALYTICS_GUIDE.md)** - Risk analytics service guide
- **[API Docs](https://quantpaychain-api.onrender.com/docs)** - Interactive API documentation

---

## 🔧 Key Endpoints

```bash
# PQC
POST /api/pqc/generate-keypair
POST /api/pqc/sign-transaction

# ISO 20022
POST /api/iso20022/payment-initiation
POST /api/iso20022/bank-statement

# Risk Analytics
POST /api/risk/analyze-transaction
POST /api/risk/validate-asset

# AI Legal
POST /api/ai/advisor
```

---

## 🗺 Project Structure

```
quantpaychain-clean/
├── apps/
│   ├── api/              # FastAPI Backend
│   │   └── services/     # Core services
│   └── web/              # Next.js Frontend
│       ├── app/          # Pages
│       └── components/   # UI components
└── docs/                 # Documentation
```

---

## 📊 Stats
- **20+ API Endpoints**
- **5 Core Services**
- **10,000+ Lines of Code**
- **Production Ready**

---

**Version 2.0.0** | Built for institutional finance | MIT License
