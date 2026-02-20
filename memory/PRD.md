# QuantPayChain - Product Requirements Document

## Problema Original
Construir una plataforma de tokenización de activos del mundo real (RWA) con capacidades de:
- Inteligencia regulatoria multi-jurisdiccional con IA
- Criptografía Post-Cuántica (PQC) 
- Cumplimiento ISO 20022
- Motor de KYC/AML automatizado

## Estado Actual del Proyecto

### ✅ Componentes Funcionales

| Componente | Estado | Descripción |
|------------|--------|-------------|
| Frontend (Next.js) | ✅ LIVE | www.quantpaychain.com (Vercel) |
| Backend (FastAPI) | ✅ LIVE | Backend Emergent + Render |
| Auth (Supabase) | ✅ LIVE | Autenticación funcionando |
| AI Advisor | ✅ LIVE | Motor de inteligencia regulatoria |
| **PQC Real** | ✅ NUEVO | ML-KEM, ML-DSA (NIST FIPS 203/204) |
| **KYC/AML Real** | ✅ NUEVO | Verificación de sanciones, análisis de riesgo |
| **Security Page** | ✅ NUEVO | Panel de seguridad con PQC y KYC |
| **KYC en Registro** | ✅ NUEVO | Verificación integrada en signup |

### Páginas Frontend Nuevas (2025-02-17)

1. **`/security`** - Centro de Seguridad
   - Panel de Criptografía Post-Cuántica
   - Generación de llaves ML-DSA/ML-KEM
   - Firma y verificación de mensajes
   - Panel de verificación KYC/AML

2. **`/register` (Actualizado)**
   - Flujo de 2 pasos: Cuenta → KYC
   - Verificación de identidad integrada
   - Detección de países de alto riesgo
   - Almacena KYC status en Supabase user metadata

### Componentes Frontend Nuevos

- `pqc-security-panel.tsx` - Panel completo de PQC
- `kyc-verification-form.tsx` - Formulario de verificación KYC
- `ui/tabs.tsx` - Componente de tabs de Radix UI

### Endpoints Backend (13 nuevos)

#### PQC (Post-Quantum Cryptography)
```
GET  /api/pqc/algorithms              - Lista algoritmos disponibles
POST /api/pqc/generate-kem-keypair    - Genera llaves KEM (ML-KEM)
POST /api/pqc/generate-signature-keypair - Genera llaves de firma (ML-DSA)
POST /api/pqc/encapsulate             - Encapsula secreto compartido
POST /api/pqc/decapsulate             - Decapsula secreto compartido
POST /api/pqc/sign                    - Firma mensaje con PQC
POST /api/pqc/verify                  - Verifica firma PQC
POST /api/pqc/sign-tokenization       - Firma datos de tokenización
POST /api/pqc/verify-tokenization     - Verifica autenticidad de token
```

#### KYC/AML
```
POST /api/kyc/check-sanctions         - Verifica contra listas de sanciones
POST /api/kyc/verify-identity         - Verificación KYC completa
POST /api/aml/analyze-transaction     - Análisis AML de transacciones
GET  /api/kyc/high-risk-countries     - Lista países de alto riesgo
```

## Arquitectura Técnica

```
/app/
├── backend/                  # FastAPI Backend
│   ├── server.py            # API principal + 13 nuevos endpoints
│   └── services/
│       ├── pqc_real_service.py      # ✅ PQC con pqcrypto
│       ├── kyc_aml_real_service.py  # ✅ KYC/AML con sanciones
│       └── jurisdictions.py         # Datos jurisdiccionales
│
├── quantpaychain-clean/      # Monorepo Frontend
│   └── apps/web/
│       ├── app/
│       │   ├── security/page.tsx    # ✅ NUEVO
│       │   └── register/page.tsx    # ✅ ACTUALIZADO
│       ├── components/
│       │   ├── pqc-security-panel.tsx   # ✅ NUEVO
│       │   ├── kyc-verification-form.tsx # ✅ NUEVO
│       │   └── navbar.tsx               # ✅ ACTUALIZADO (+Seguridad link)
│       └── lib/
│           └── api-config.ts        # ✅ ACTUALIZADO
│
└── docs/                    # Documentación
```

## Algoritmos PQC Soportados

| Tipo | Algoritmo | Nivel NIST | Uso |
|------|-----------|------------|-----|
| KEM | ML-KEM-512 | 1 | Intercambio de llaves |
| KEM | ML-KEM-768 | 3 | **Recomendado** |
| KEM | ML-KEM-1024 | 5 | Alta seguridad |
| Firma | ML-DSA-44 | 2 | Firmas ligeras |
| Firma | ML-DSA-65 | 3 | **Recomendado** |
| Firma | ML-DSA-87 | 5 | Alta seguridad |
| Firma | Falcon-512/1024 | 1/5 | Firmas compactas |

## Dependencias Nuevas

```
# Backend
pqcrypto==0.4.0      # Criptografía post-cuántica
httpx==0.28.1        # HTTP async client
aiofiles==25.1.0     # Async file operations

# Frontend
@radix-ui/react-tabs # Componente tabs
```

## Backlog Priorizado

### P0 - Crítico (Completado)
- [x] ~~Implementar PQC real~~ ✅
- [x] ~~Implementar KYC/AML real~~ ✅
- [x] ~~Integrar PQC en frontend~~ ✅
- [x] ~~Integrar KYC en registro~~ ✅

### P1 - Alto
- [ ] Desplegar backend actualizado a Render (para producción)
- [ ] Desplegar frontend actualizado a Vercel
- [ ] Smart contracts ERC-3643 para Arbitrum
- [ ] Auditoría de seguridad

### P2 - Medio
- [ ] Migrar @supabase/auth-helpers → @supabase/ssr
- [ ] Actualizar Next.js (vulnerabilidad)
- [ ] Eliminar código legacy

### P3 - Bajo
- [ ] Multi-idioma (i18n)
- [ ] Mobile app
- [ ] Más jurisdicciones

## Changelog

### 2025-02-17 (Sesión actual)
- ✅ Implementado servicio PQC real con pqcrypto
- ✅ Implementado servicio KYC/AML con sanciones OFAC/EU/UN
- ✅ 13 nuevos endpoints API
- ✅ Página `/security` con panel completo PQC + KYC
- ✅ Registro con verificación KYC integrada
- ✅ Navbar actualizado con enlace a Seguridad
- ✅ api-config.ts actualizado con nuevos endpoints
