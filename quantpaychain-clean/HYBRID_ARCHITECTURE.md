# 🏗️ Arquitectura Híbrida QuantPayChain

## 📊 Visión General

QuantPayChain utiliza una **arquitectura híbrida optimizada** que combina lo mejor de Python y TypeScript:

```
┌─────────────────────────────────────────────────┐
│          Frontend (Next.js + React)             │
│         Deployed on Vercel                      │
└────────────────┬────────────────────────────────┘
                 │
        ┌────────▼──────────┐
        │  FastAPI Backend  │  ← Puerto 8001
        │   (Python)        │    Orquestación principal
        └─┬──────────────┬──┘
          │              │
    ┌─────▼──────┐  ┌───▼──────────────┐
    │ AI Services│  │ QPC Microservice │  ← Puerto 3001
    │  (Python)  │  │   (Node.js)      │    qpc-v2-core
    │            │  │                  │
    │ • Legal AI │  │ • PQC Layer      │
    │ • Risk AI  │  │ • ISO 20022      │
    │ • Doc OCR  │  │ • KYC/AML Core   │
    └────────────┘  └──────────────────┘
          │                  │
          └──────┬───────────┘
                 │
        ┌────────▼─────────┐
        │  Supabase        │
        │  (PostgreSQL)    │
        └──────────────────┘
```

---

## 🎯 Componentes del Sistema

### 1️⃣ **FastAPI Backend (Python) - Puerto 8001**

**Ubicación**: `/apps/api/`

**Responsabilidades**:
- ✅ Orquestación de requests HTTP
- ✅ Autenticación y autorización
- ✅ Gestión de base de datos (Supabase)
- ✅ Servicios AI especializados:
  - AI Legal Advisor (GPT-4o)
  - Risk Analytics AI
  - Document Verification con OCR
- ✅ Integración con Stripe
- ✅ API REST principal

**Endpoints Python Nativos**:
```
/api/ai/advisor          - AI Legal Advisor con GPT-4o
/api/risk/analytics      - Risk Analytics con AI
/api/assets/*            - Gestión de assets RWA
/api/tokens/*            - Gestión de tokens
/api/payments/*          - Stripe integration
```

**Tecnologías**:
- FastAPI
- Emergent LLM Integrations
- Supabase Client
- Stripe SDK

---

### 2️⃣ **QPC Microservice (Node.js) - Puerto 3001**

**Ubicación**: `/apps/qpc-service/`

**Responsabilidades**:
- ✅ Post-Quantum Cryptography (PQC)
  - Generación de llaves ML-KEM-768 / ML-DSA-65
  - Firma y verificación quantum-resistant
  - Encriptación híbrida PQC + AES-GCM
  - Gestión automática de llaves con rotación
- ✅ ISO 20022 Gateway
  - Parse y validación de mensajes XML
  - Transformación bidireccional (ISO ↔ Internal)
  - Soporte completo: pain.001, pain.002, pacs.008, camt.053
- ✅ KYC/AML Engine
  - Risk scoring avanzado
  - Sanctions checking
  - Pattern detection con ML
  - Rules engine configurable
  - Compliance reporting

**Endpoints QPC**:
```
/pqc/generate-keypair    - Generar llaves PQC
/pqc/sign                - Firma digital PQC
/pqc/verify              - Verificar firma PQC
/pqc/encrypt             - Encriptar con PQC

/iso20022/parse          - Parse XML ISO 20022
/iso20022/validate       - Validar esquema
/iso20022/process        - Pipeline completo
/iso20022/to-internal    - ISO → Internal format
/iso20022/to-iso         - Internal → ISO

/kyc-aml/compliance-check    - Check compliance completo
/kyc-aml/verify-document     - Verificar documentos
/kyc-aml/generate-report     - Reportes de compliance
/kyc-aml/summary             - Resumen de compliance
```

**Tecnologías**:
- TypeScript
- Express.js
- qpc-v2-core (6,347 líneas)
- Winston Logger
- libsodium-wrappers

---

### 3️⃣ **Bridge: Python ↔ TypeScript**

**Ubicación**: `/apps/api/services/qpc_client.py`

**Funcionamiento**:
```python
# FastAPI llama al microservicio QPC vía HTTP
from services.qpc_client import QPCClient

client = QPCClient()  # Se conecta a localhost:3001
keypair = await client.generate_pqc_keypair()
```

**Ventajas**:
- ✅ Comunicación asíncrona con `httpx`
- ✅ Type-safe con Pydantic models
- ✅ Manejo de errores robusto
- ✅ Timeout configurable
- ✅ Health checks automáticos

---

## 🚀 Inicio de Servicios

### Opción 1: Script Automático
```bash
bash /app/quantpaychain-clean/start-services.sh
```

### Opción 2: Manual

**1. Iniciar QPC Service**:
```bash
cd /app/quantpaychain-clean/apps/qpc-service
node dist/server.js
```

**2. Iniciar FastAPI**:
```bash
cd /app/quantpaychain-clean/apps/api
export QPC_SERVICE_URL="http://localhost:3001"
uvicorn main:app --host 0.0.0.0 --port 8001
```

---

## 📊 Comparación: Python Services vs TypeScript Core

| Feature | Python Básico | TypeScript qpc-v2-core | En Uso |
|---------|---------------|------------------------|--------|
| **PQC - Key Management** | ❌ | ✅ Rotación automática | 🟢 TypeScript |
| **PQC - Encriptación** | ⚠️ XOR simple | ✅ ML-KEM + AES-GCM | 🟢 TypeScript |
| **ISO 20022 - Parse** | ❌ | ✅ Completo | 🟢 TypeScript |
| **ISO 20022 - Validación** | ❌ | ✅ Schema validation | 🟢 TypeScript |
| **KYC/AML - AI Verification** | ✅ GPT-4o | ❌ | 🟢 Python |
| **KYC/AML - Sanctions** | ❌ | ✅ Completo | 🟢 TypeScript |
| **KYC/AML - Patterns** | ❌ | ✅ ML-based | 🟢 TypeScript |
| **AI Legal Advisor** | ✅ Implementado | ❌ | 🟢 Python |
| **Risk Analytics** | ✅ Con LLM | ❌ | 🟢 Python |

---

## 🔧 Variables de Entorno

### FastAPI (apps/api/.env)
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
STRIPE_SECRET_KEY=your_stripe_key
EMERGENT_LLM_KEY=your_emergent_key
QPC_SERVICE_URL=http://localhost:3001
```

### QPC Service (apps/qpc-service/.env)
```bash
QPC_SERVICE_PORT=3001
NODE_ENV=production
```

---

## 📈 Ventajas de la Arquitectura Híbrida

### ✅ **Eficiencia de Desarrollo**
- Ahorra 70+ horas vs reimplementar en Python
- Código ya probado y documentado
- Tests incluidos

### ✅ **Performance**
- Node.js para operaciones criptográficas intensivas
- Python para AI/ML y orquestación
- Servicios independientes escalables

### ✅ **Mantenibilidad**
- Separación clara de responsabilidades
- Cada servicio usa el lenguaje óptimo
- Actualizaciones independientes

### ✅ **Costos Optimizados**
- Menos dependencia de APIs LLM para funciones base
- Criptografía local (no external API)
- Compliance checking sin costos por llamada

---

## 🧪 Testing

### Test Individual de QPC Service
```bash
curl -X POST http://localhost:3001/pqc/generate-keypair \
  -H "Content-Type: application/json" \
  -d '{"purpose": "test"}' | jq
```

### Test desde FastAPI
```bash
curl -X POST http://localhost:8001/api/qpc/pqc/generate-keypair \
  -H "Content-Type: application/json" \
  -d '{"purpose": "test"}' | jq
```

### Test Health Checks
```bash
# QPC Service
curl http://localhost:3001/health | jq

# FastAPI
curl http://localhost:8001/api/qpc/health | jq
```

---

## 📝 Próximos Pasos

1. ✅ **COMPLETADO**: Migración de qpc-v2-core
2. ✅ **COMPLETADO**: Creación de microservicio Node.js
3. ✅ **COMPLETADO**: Bridge Python ↔ TypeScript
4. ⏳ **EN PROGRESO**: Optimizar servicios AI Python
5. ⏳ **PENDIENTE**: Integrar con frontend
6. ⏳ **PENDIENTE**: Testing E2E completo
7. ⏳ **PENDIENTE**: Deployment production

---

## 🆘 Troubleshooting

### QPC Service no inicia
```bash
# Verificar logs
tail -f /var/log/qpc-service.log

# Verificar puerto
lsof -i :3001

# Rebuild si es necesario
cd /app/quantpaychain-clean/apps/qpc-service
npm run build
```

### FastAPI no conecta con QPC
```bash
# Verificar variable de entorno
echo $QPC_SERVICE_URL

# Test manual
curl http://localhost:3001/health

# Verificar logs de Python
tail -f /var/log/fastapi.log
```

---

**Última actualización**: Diciembre 8, 2025
**Status**: ✅ Arquitectura híbrida funcionando
