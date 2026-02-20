
# QuantPay Chain Backend

Post-quantum secure backend for real estate tokenization platform.

## Structure

```
backend/src/
├── services/          # Business logic
│   ├── PropertyService.ts
│   ├── InvestmentService.ts
│   ├── PaymentService.ts
│   ├── ContractService.ts
│   ├── AIAuditorService.ts
│   └── PQCService.ts
├── utils/            # Utilities
│   ├── db.ts         # Prisma client
│   ├── errors.ts     # Error classes
│   ├── validation.ts # Zod schemas
│   └── logger.ts     # Logging
└── types/            # TypeScript types
    └── index.ts
```

## Services

### PropertyService
- Property CRUD operations
- Search and filtering
- Investment calculations
- Featured properties

### InvestmentService
- Create investments
- Confirm after payment
- Portfolio management
- Statistics

### PaymentService
- Stripe integration (real)
- Crypto payments (simulated)
- Webhook handling
- Payment confirmation

### ContractService
- Generate investment contracts
- HTML templates
- PQC signature integration
- PDF export (ready)

### AIAuditorService
- Contract analysis (OpenAI GPT-4)
- Risk assessment
- Compliance scoring
- Recommendations

### PQCService
- Post-quantum signatures (simulated)
- Visual seals
- Signature verification
- Production pathway ready

## Usage

```typescript
import PropertyService from '@/backend/src/services/PropertyService';

const properties = await PropertyService.getProperties(filters, pagination);
```

## Configuration

All services are configured via environment variables. See main `.env.example` for details.

