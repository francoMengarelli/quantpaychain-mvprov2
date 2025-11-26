"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/page-layout";
import { Code, Globe, Printer } from "lucide-react";

export default function TechnicalGuidePage() {
  const [lang, setLang] = useState<'es' | 'en'>('es');

  const content = {
    es: {
      title: "Guía Técnica de Integración",
      subtitle: "Documentación completa para desarrolladores",
      sections: [
        {
          title: "Inicio Rápido",
          content: `**Requisitos:**
• Node.js 18+
• Python 3.10+
• Cuenta de Supabase
• Wallet Web3

**Instalación:**
\`\`\`bash
git clone https://github.com/quantpaychain/platform
cd platform
yarn install
cp .env.example .env
# Configurar variables de entorno
yarn dev
\`\`\`

**Variables de Entorno:**
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_id
\`\`\``
        },
        {
          title: "API Endpoints",
          content: `**Base URL:** \`https://api.quantpaychain.com\`

**Autenticación:**
Todas las requests requieren Bearer token:
\`\`\`
Authorization: Bearer <your_token>
\`\`\`

**Endpoints Principales:**

**Assets:**
• GET /api/assets - Listar assets
• POST /api/assets - Crear asset
• GET /api/assets/:id - Ver detalle
• PUT /api/assets/:id - Actualizar
• DELETE /api/assets/:id - Eliminar

**Tokens:**
• GET /api/tokens - Listar tokens
• POST /api/tokens - Crear token
• GET /api/tokens/:id - Ver detalle

**Transactions:**
• POST /api/purchase/create-intent - Crear intento de compra
• POST /api/purchase/confirm - Confirmar compra
• GET /api/transactions - Ver historial

**AI Advisor:**
• POST /api/ai/advisor - Obtener análisis
• POST /api/ai/gamification-tips - Tips personalizados`
        }
      ]
    },
    en: {
      title: "Technical Integration Guide",
      subtitle: "Complete documentation for developers",
      sections: [
        {
          title: "Quick Start",
          content: `**Requirements:**
• Node.js 18+
• Python 3.10+
• Supabase account
• Web3 Wallet

**Installation:**
\`\`\`bash
git clone https://github.com/quantpaychain/platform
cd platform
yarn install
cp .env.example .env
# Configure environment variables
yarn dev
\`\`\`

**Environment Variables:**
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_id
\`\`\``
        },
        {
          title: "API Endpoints",
          content: `**Base URL:** \`https://api.quantpaychain.com\`

**Authentication:**
All requests require Bearer token:
\`\`\`
Authorization: Bearer <your_token>
\`\`\`

**Main Endpoints:**

**Assets:**
• GET /api/assets - List assets
• POST /api/assets - Create asset
• GET /api/assets/:id - View detail
• PUT /api/assets/:id - Update
• DELETE /api/assets/:id - Delete

**Tokens:**
• GET /api/tokens - List tokens
• POST /api/tokens - Create token
• GET /api/tokens/:id - View detail

**Transactions:**
• POST /api/purchase/create-intent - Create purchase intent
• POST /api/purchase/confirm - Confirm purchase
• GET /api/transactions - View history

**AI Advisor:**
• POST /api/ai/advisor - Get analysis
• POST /api/ai/gamification-tips - Personalized tips`
        }
      ]
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Code className="h-8 w-8 text-purple-400" />
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
                onClick={() => window.print()}
                className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
              >
                <Printer className="mr-2 h-4 w-4" />
                {lang === 'es' ? 'Imprimir' : 'Print'}
              </Button>
            </div>
          </div>

          <Card className="glass-effect border-purple-500/20">
            <CardContent className="p-8 space-y-8">
              {content[lang].sections.map((section, idx) => (
                <div key={idx} className="space-y-4">
                  <h2 className="text-2xl font-bold text-white border-b border-purple-500/20 pb-2">
                    {section.title}
                  </h2>
                  <div className="text-gray-300 whitespace-pre-line leading-relaxed font-mono text-sm">
                    {section.content}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
