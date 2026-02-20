
# QuantPayChain MVP - Documentación en Español

## Descripción General

QuantPayChain es una plataforma de pagos descentralizada construida sobre Ethereum que integra criptografía post-cuántica (PQC) para garantizar seguridad a largo plazo contra amenazas cuánticas. Este MVP demuestra la viabilidad técnica de combinar contratos inteligentes con preparación cuántica.

## Características Principales

### 1. Arquitectura Híbrida de Seguridad
- **ECDSA Clásico**: Firmas digitales basadas en curvas elípticas para compatibilidad actual
- **Preparación PQC**: Diseño modular para integración futura de CRYSTALS-Kyber y Dilithium
- **Defensa en Profundidad**: Múltiples capas de seguridad criptográfica

### 2. Contratos Inteligentes
- **PaymentProcessor**: Gestión de pagos con escrow y resolución de disputas
- **TokenManager**: Administración de tokens ERC-20 con funcionalidades avanzadas
- **DisputeResolver**: Sistema de arbitraje descentralizado
- **Gobernanza**: Mecanismos de votación y propuestas on-chain

### 3. Frontend Moderno
- **Next.js 14**: Framework React con App Router y Server Components
- **TypeScript**: Tipado estático para mayor seguridad
- **Tailwind CSS**: Diseño responsive y moderno
- **Internacionalización**: Soporte completo para español e inglés

### 4. Integración Web3
- **ethers.js v6**: Interacción con blockchain Ethereum
- **MetaMask**: Conexión de wallet para usuarios
- **Sepolia Testnet**: Red de pruebas para desarrollo

## Estructura del Proyecto

```
quantpaychain-mvp/
├── contracts/           # Contratos inteligentes Solidity
│   ├── src/            # Código fuente de contratos
│   ├── test/           # Suite de pruebas (59 tests)
│   └── scripts/        # Scripts de despliegue
├── frontend/           # Aplicación Next.js
│   ├── app/            # App Router de Next.js
│   ├── components/     # Componentes React
│   ├── lib/            # Utilidades y configuración
│   └── public/         # Recursos estáticos
├── docs/               # Documentación completa
│   ├── es/            # Documentación en español
│   ├── en/            # Documentación en inglés
│   └── SECURITY-PQC.md # Especificaciones de seguridad PQC
└── evidence/          # Evidencia de validación
```

## Tecnologías Utilizadas

### Backend (Contratos)
- **Solidity 0.8.20**: Lenguaje de contratos inteligentes
- **Foundry**: Framework de desarrollo y testing
- **OpenZeppelin**: Librerías de contratos seguros

### Frontend
- **Next.js 14.2.5**: Framework React
- **TypeScript 5.x**: Superset tipado de JavaScript
- **ethers.js 6.13.2**: Librería Web3
- **Tailwind CSS 3.4.1**: Framework CSS utility-first
- **next-intl 3.17.2**: Internacionalización

### DevOps
- **GitHub Actions**: CI/CD automatizado
- **Vercel**: Plataforma de despliegue
- **ESLint/Prettier**: Linting y formateo de código

## Seguridad

### Auditorías y Testing
- **59 tests unitarios**: Cobertura completa de contratos
- **Análisis estático**: Detección de vulnerabilidades
- **Revisión de código**: Mejores prácticas de Solidity

### Criptografía Post-Cuántica
Ver [SECURITY-PQC.md](../SECURITY-PQC.md) para detalles completos sobre:
- Enfoque híbrido ECDSA + PQC
- Algoritmos CRYSTALS-Kyber y Dilithium
- Estrategia de migración
- Puntos de integración

## Roadmap

### Fase 1: MVP (Completada) ✅
- Contratos inteligentes básicos
- Frontend funcional con demo
- Internacionalización
- CI/CD automatizado

### Fase 2: Integración PQC (Q1 2025)
- Implementación de CRYSTALS-Kyber para intercambio de claves
- Integración de Dilithium para firmas digitales
- Testing en testnet con criptografía híbrida

### Fase 3: Producción (Q2-Q3 2025)
- Auditoría de seguridad completa
- Despliegue en mainnet
- Monitoreo y optimización

## Licencia

Este proyecto está bajo licencia MIT. Ver archivo LICENSE para más detalles.

## Contacto y Soporte

Para preguntas, sugerencias o reportes de bugs:
- **GitHub Issues**: [quantpaychain-mvp/issues](https://github.com/francoMengarelli/quantpaychain-mvp/issues)
- **Documentación**: Ver carpeta `/docs` para guías detalladas

## Referencias

- [Whitepaper en Español](../whitepaper.md)
- [Guía de Despliegue](./DEPLOYMENT.md)
- [Documentación de Contratos](./CONTRACTS.md)
- [Guía de Demo](./DEMO.md)
