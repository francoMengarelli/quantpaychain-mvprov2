"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/page-layout";
import { FileText, Globe, Download, Printer } from "lucide-react";

export default function WhitepaperPage() {
  const [lang, setLang] = useState<'es' | 'en'>('es');

  const content = {
    es: {
      title: "Whitepaper Técnico",
      subtitle: "QuantPayChain: Plataforma de Tokenización RWA con Seguridad Post-Cuántica",
      sections: [
        {
          title: "1. Resumen Ejecutivo",
          content: `QuantPayChain es una plataforma revolucionaria de tokenización de activos del mundo real (RWA) que combina tecnología blockchain de vanguardia con características únicas en el mercado:

• AI Legal Advisor: Primer sistema de asesoría legal automatizada para tokenización
• Seguridad Post-Cuántica: Implementación de algoritmos NIST (Dilithium, Kyber)
• Gamificación: Experiencia de usuario innovadora con sistema de recompensas
• ISO 20022: Compliance financiero desde el primer día
• KYC/AML Integrado: Verificación de identidad y screening automatizado

Nuestra misión es democratizar el acceso a inversiones en activos de alto valor mientras mantenemos los más altos estándares de seguridad y compliance.`
        },
        {
          title: "2. Arquitectura Técnica",
          content: `**Stack Tecnológico:**

Frontend:
• Next.js 14 con App Router
• React 18 con Server Components
• Tailwind CSS + Shadcn UI
• RainbowKit + Wagmi para Web3

Backend:
• FastAPI (Python) con arquitectura serverless
• Supabase (PostgreSQL) para persistencia
• Vercel Edge Functions para escalabilidad

Blockchain:
• Multi-chain support (Ethereum, Polygon, Avalanche, BSC)
• Smart contracts ERC-20 standard
• Post-Quantum signature layer

Seguridad:
• Dilithium3 para firmas digitales (NIST Level 3)
• Kyber1024 para intercambio de llaves
• Modo híbrido: PQC + RSA clásico`
        },
        {
          title: "3. Funcionalidades Core",
          content: `**3.1 AI Legal Advisor**

Sistema experto que analiza:
• Requisitos legales por jurisdicción
• Documentación necesaria por tipo de asset
• Estrategia óptima de tokenización
• Recomendaciones de inversión personalizadas
• Compliance checks automatizados

**3.2 Sistema de Tokenización**

Proceso:
1. Creación del asset con metadata completa
2. Valuación y verificación
3. Emisión de tokens ERC-20
4. Firma con criptografía post-cuántica
5. Publicación en marketplace

**3.3 Gamificación**

• Sistema de niveles y XP
• Achievements desbloqueables
• Daily challenges
• Leaderboard global
• Rewards por actividad`
        },
        {
          title: "4. Seguridad Post-Cuántica",
          content: `**¿Por qué Post-Quantum?**

Las computadoras cuánticas representan una amenaza existencial para la criptografía actual (RSA, ECDSA). QuantPayChain implementa algoritmos resistentes a ataques cuánticos:

**Algoritmos Implementados:**

1. **Dilithium3** (NIST Round 3)
   • Firmas digitales post-cuánticas
   • Security Level 3 (equivalente a AES-192)
   • Tamaño de firma: ~2.5KB

2. **Kyber1024** (NIST Round 3)
   • Key Encapsulation Mechanism
   • Security Level 5 (máximo)
   • Resistente a ataques cuánticos

3. **Modo Híbrido**
   • PQC + RSA/ECDSA en paralelo
   • Máxima seguridad durante transición
   • Backwards compatible

**Ventaja Competitiva:**
Somos la ÚNICA plataforma RWA con PQC implementado, adelantándonos 5-10 años a la competencia.`
        },
        {
          title: "5. Compliance & Regulación",
          content: `**ISO 20022 Implementation**

Mensajes soportados:
• pain.001.001.03 - Payment Initiation
• camt.053.001.02 - Bank Statement
• pacs.008 - Financial Institution Transfer

Beneficios:
• Interoperabilidad con sistema bancario tradicional
• Reportes automáticos regulatorios
• Compliance multi-jurisdicción

**KYC/AML**

Proceso automatizado:
1. Document verification (OCR + ML)
2. Identity confirmation
3. AML screening (OFAC, EU sanctions)
4. PEP detection
5. Risk scoring (0-100)
6. Continuous monitoring

**Cumplimiento:**
• GDPR compliant (EU)
• FinCEN guidelines (USA)
• FATF recommendations
• Local regulations support`
        },
        {
          title: "6. Tokenomics & Modelo de Negocio",
          content: `**Revenue Streams:**

1. **Transaction Fees**: 2.5% por transacción
2. **Listing Fee**: Fee único por listar asset
3. **Premium Features**: 
   • AI analysis avanzado
   • Priority support
   • Custom compliance reports
4. **API Access**: Para integradores enterprise

**Incentivos:**

• Early adopters: 50% descuento en fees
• Volume discounts: Hasta 1% para high-volume
• Referral program: 10% de fees generados
• Staking rewards: Por participación en governance

**Distribución de Fees:**
• 40% - Development & Operations
• 30% - Security & Compliance
• 20% - Marketing & Growth
• 10% - Reserve fund`
        },
        {
          title: "7. Roadmap",
          content: `**Q1 2025 - MVP Launch** ✅
• Core tokenization platform
• AI Legal Advisor
• Basic gamification
• Ethereum support

**Q2 2025 - Expansion**
• Multi-chain support (Polygon, Avalanche)
• Advanced KYC/AML
• Mobile app (iOS/Android)
• API v1 para partners

**Q3 2025 - Enterprise**
• White-label solution
• Institutional features
• Custody integration
• Advanced analytics dashboard

**Q4 2025 - Global**
• Multi-language (10+ idiomas)
• Multi-jurisdiction compliance
• DeFi integrations (Uniswap, Aave)
• NFT fractionalization`
        },
        {
          title: "8. Equipo & Contacto",
          content: `**Core Team:**

• Blockchain Engineers
• Smart Contract Specialists
• Full-stack Developers
• Legal & Compliance Experts
• Security Researchers (PQC)
• UX/UI Designers

**Advisors:**
• Post-Quantum Cryptography researchers
• Financial regulation experts
• Blockchain industry veterans

**Contacto:**
• Website: quantpaychain.com
• Email: info@quantpaychain.com
• Twitter: @quantpaychain
• Telegram: t.me/quantpaychain

**Open Source:**
Parts of our codebase are open source:
• github.com/quantpaychain`
        }
      ]
    },
    en: {
      title: "Technical Whitepaper",
      subtitle: "QuantPayChain: RWA Tokenization Platform with Post-Quantum Security",
      sections: [
        {
          title: "1. Executive Summary",
          content: `QuantPayChain is a revolutionary Real-World Asset (RWA) tokenization platform that combines cutting-edge blockchain technology with unique market features:

• AI Legal Advisor: First automated legal advisory system for tokenization
• Post-Quantum Security: Implementation of NIST algorithms (Dilithium, Kyber)
• Gamification: Innovative user experience with rewards system
• ISO 20022: Financial compliance from day one
• Integrated KYC/AML: Automated identity verification and screening

Our mission is to democratize access to high-value asset investments while maintaining the highest security and compliance standards.`
        },
        {
          title: "2. Technical Architecture",
          content: `**Technology Stack:**

Frontend:
• Next.js 14 with App Router
• React 18 with Server Components
• Tailwind CSS + Shadcn UI
• RainbowKit + Wagmi for Web3

Backend:
• FastAPI (Python) with serverless architecture
• Supabase (PostgreSQL) for persistence
• Vercel Edge Functions for scalability

Blockchain:
• Multi-chain support (Ethereum, Polygon, Avalanche, BSC)
• ERC-20 standard smart contracts
• Post-Quantum signature layer

Security:
• Dilithium3 for digital signatures (NIST Level 3)
• Kyber1024 for key exchange
• Hybrid mode: PQC + Classic RSA`
        },
        {
          title: "3. Core Features",
          content: `**3.1 AI Legal Advisor**

Expert system that analyzes:
• Legal requirements by jurisdiction
• Required documentation by asset type
• Optimal tokenization strategy
• Personalized investment recommendations
• Automated compliance checks

**3.2 Tokenization System**

Process:
1. Asset creation with complete metadata
2. Valuation and verification
3. ERC-20 token issuance
4. Post-quantum cryptography signature
5. Marketplace publication

**3.3 Gamification**

• Level and XP system
• Unlockable achievements
• Daily challenges
• Global leaderboard
• Activity rewards`
        },
        {
          title: "4. Post-Quantum Security",
          content: `**Why Post-Quantum?**

Quantum computers represent an existential threat to current cryptography (RSA, ECDSA). QuantPayChain implements quantum-resistant algorithms:

**Implemented Algorithms:**

1. **Dilithium3** (NIST Round 3)
   • Post-quantum digital signatures
   • Security Level 3 (equivalent to AES-192)
   • Signature size: ~2.5KB

2. **Kyber1024** (NIST Round 3)
   • Key Encapsulation Mechanism
   • Security Level 5 (maximum)
   • Quantum attack resistant

3. **Hybrid Mode**
   • PQC + RSA/ECDSA in parallel
   • Maximum security during transition
   • Backwards compatible

**Competitive Advantage:**
We are the ONLY RWA platform with PQC implemented, ahead of competition by 5-10 years.`
        },
        {
          title: "5. Compliance & Regulation",
          content: `**ISO 20022 Implementation**

Supported messages:
• pain.001.001.03 - Payment Initiation
• camt.053.001.02 - Bank Statement
• pacs.008 - Financial Institution Transfer

Benefits:
• Interoperability with traditional banking
• Automated regulatory reports
• Multi-jurisdiction compliance

**KYC/AML**

Automated process:
1. Document verification (OCR + ML)
2. Identity confirmation
3. AML screening (OFAC, EU sanctions)
4. PEP detection
5. Risk scoring (0-100)
6. Continuous monitoring

**Compliance:**
• GDPR compliant (EU)
• FinCEN guidelines (USA)
• FATF recommendations
• Local regulations support`
        },
        {
          title: "6. Tokenomics & Business Model",
          content: `**Revenue Streams:**

1. **Transaction Fees**: 2.5% per transaction
2. **Listing Fee**: One-time fee per asset listing
3. **Premium Features**: 
   • Advanced AI analysis
   • Priority support
   • Custom compliance reports
4. **API Access**: For enterprise integrators

**Incentives:**

• Early adopters: 50% fee discount
• Volume discounts: Up to 1% for high-volume
• Referral program: 10% of generated fees
• Staking rewards: For governance participation

**Fee Distribution:**
• 40% - Development & Operations
• 30% - Security & Compliance
• 20% - Marketing & Growth
• 10% - Reserve fund`
        },
        {
          title: "7. Roadmap",
          content: `**Q1 2025 - MVP Launch** ✅
• Core tokenization platform
• AI Legal Advisor
• Basic gamification
• Ethereum support

**Q2 2025 - Expansion**
• Multi-chain support (Polygon, Avalanche)
• Advanced KYC/AML
• Mobile app (iOS/Android)
• API v1 for partners

**Q3 2025 - Enterprise**
• White-label solution
• Institutional features
• Custody integration
• Advanced analytics dashboard

**Q4 2025 - Global**
• Multi-language (10+ languages)
• Multi-jurisdiction compliance
• DeFi integrations (Uniswap, Aave)
• NFT fractionalization`
        },
        {
          title: "8. Team & Contact",
          content: `**Core Team:**

• Blockchain Engineers
• Smart Contract Specialists
• Full-stack Developers
• Legal & Compliance Experts
• Security Researchers (PQC)
• UX/UI Designers

**Advisors:**
• Post-Quantum Cryptography researchers
• Financial regulation experts
• Blockchain industry veterans

**Contact:**
• Website: quantpaychain.com
• Email: info@quantpaychain.com
• Twitter: @quantpaychain
• Telegram: t.me/quantpaychain

**Open Source:**
Parts of our codebase are open source:
• github.com/quantpaychain`
        }
      ]
    }
  };

  const handlePrint = () => window.print();

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-purple-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">{content[lang].title}</h1>
                <p className="text-gray-400 text-sm mt-1">{content[lang].subtitle}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
                className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
              >
                <Globe className="mr-2 h-4 w-4" />
                {lang === 'es' ? 'English' : 'Español'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
              >
                <Printer className="mr-2 h-4 w-4" />
                {lang === 'es' ? 'Imprimir' : 'Print'}
              </Button>
            </div>
          </div>

          {/* Content */}
          <Card className="glass-effect border-purple-500/20">
            <CardContent className="p-8 space-y-8">
              {content[lang].sections.map((section, idx) => (
                <div key={idx} className="space-y-4">
                  <h2 className="text-2xl font-bold text-white border-b border-purple-500/20 pb-2">
                    {section.title}
                  </h2>
                  <div className="text-gray-300 whitespace-pre-line leading-relaxed">
                    {section.content}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>© 2025 QuantPayChain. All rights reserved.</p>
            <p className="mt-1">Version 2.0 - Updated January 2025</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
