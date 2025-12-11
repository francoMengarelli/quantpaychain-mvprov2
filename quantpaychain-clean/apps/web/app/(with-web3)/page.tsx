"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import { 
  ArrowRight, Shield, Zap, Globe, TrendingUp, Network, Coins, Building2,
  CheckCircle2, ShieldCheck, Atom, Award, BarChart3, Sparkles, ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const coreFeatures = [
    {
      icon: Atom,
      title: "Seguridad Post-Cuántica",
      description: "Criptografía aprobada por NIST resistente a ataques de computación cuántica, utilizando algoritmos CRYSTALS-Dilithium y SPHINCS+.",
      gradient: "from-violet-500 to-purple-600",
      stat: "NIST PQC",
      statLabel: "Resistente a Cuántica"
    },
    {
      icon: Building2,
      title: "Tokenización de RWA",
      description: "Transforma activos del mundo real en valores digitales con propiedad fraccionada y distribuciones automatizadas.",
      gradient: "from-blue-500 to-cyan-600",
      stat: "Activo",
      statLabel: "Plataforma Live"
    },
    {
      icon: Coins,
      title: "Pagos Multi-Divisa",
      description: "Infraestructura de transacciones transfronterizas para múltiples monedas fiduciarias y criptomonedas con liquidación instantánea.",
      gradient: "from-emerald-500 to-teal-600",
      stat: "6+",
      statLabel: "Blockchains"
    },
    {
      icon: Network,
      title: "Estándar ISO 20022",
      description: "Integración con la infraestructura de mensajería financiera global para conectividad con finanzas tradicionales.",
      gradient: "from-pink-500 to-rose-600",
      stat: "Gateway",
      statLabel: "Cumplimiento"
    },
    {
      icon: Globe,
      title: "Protocolo Cross-Chain",
      description: "Puente interoperable para conectar con Ethereum, Polygon, Avalanche y otras redes blockchain principales.",
      gradient: "from-indigo-500 to-blue-600",
      stat: "Multi-Chain",
      statLabel: "Soportado"
    },
    {
      icon: Sparkles,
      title: "Análisis con IA",
      description: "Análisis impulsado por GPT-4 para validación de activos, evaluación de riesgos e informes automatizados.",
      gradient: "from-orange-500 to-red-600",
      stat: "GPT-4",
      statLabel: "Motor IA"
    }
  ];

  const stats = [
    { value: "$24B+", label: "Mercado RWA 2025" },
    { value: "10K+", label: "Capacidad TPS" },
    { value: "99.99%", label: "SLA de Uptime" },
    { value: "6+", label: "Blockchains" }
  ];

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Navbar showWalletButton={true} />
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center max-w-5xl mx-auto">
            <Badge className="mb-6 bg-purple-500/10 text-purple-300 border-purple-500/20 text-sm px-4 py-2">
              <Atom className="w-4 h-4 mr-2 inline" />
              Seguridad Post-Cuántica • Cumple ISO 20022
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-[family-name:var(--font-space-grotesk)]">
              <span className="qpc-gradient-text">
                El Futuro de la
              </span>
              <br />
              <span className="text-white">
                Tokenización de Activos
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Plataforma empresarial que combina <span className="text-purple-400 font-semibold">criptografía post-cuántica</span> con tokenización de activos del mundo real para finanzas institucionales.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/register">
                <Button size="lg" className="qpc-gradient text-white px-8 py-6 text-lg animate-glow-pulse">
                  Crear Cuenta Gratis
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="border-purple-500/30 text-white hover:bg-purple-500/10 px-8 py-6 text-lg">
                  Ver Demostración
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="glass-effect rounded-xl p-6">
                  <div className="text-3xl md:text-4xl font-bold qpc-gradient-text mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-space-grotesk)]">
              <span className="text-white">Capacidades </span>
              <span className="qpc-gradient-text">Principales</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Infraestructura de nivel empresarial para la próxima generación de finanzas digitales
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <Card key={index} className="glass-effect border-purple-500/20 hover:border-purple-500/40 transition-all group cursor-pointer">
                <CardContent className="p-8">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <div>
                      <div className="text-purple-400 font-semibold">{feature.stat}</div>
                      <div className="text-gray-500 text-xs">{feature.statLabel}</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-purple-400 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <Card className="glass-effect border-purple-500/20 overflow-hidden">
            <CardContent className="p-12 text-center">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 font-[family-name:var(--font-space-grotesk)]">
                  <span className="text-white">¿Listo para </span>
                  <span className="qpc-gradient-text">Transformar</span>
                  <span className="text-white"> las Finanzas?</span>
                </h2>
                
                <p className="text-xl text-gray-300 mb-8">
                  Únete a las instituciones líderes que construyen el futuro de la tokenización de activos con seguridad cuántica resistente.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/dashboard">
                    <Button size="lg" className="qpc-gradient text-white px-8 py-6 text-lg">
                      Comenzar Ahora
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/docs">
                    <Button size="lg" variant="outline" className="border-purple-500/30 text-white hover:bg-purple-500/10 px-8 py-6 text-lg">
                      Leer Whitepaper
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500">
            <p className="mb-2">&copy; 2025 QuantPay Chain. Todos los derechos reservados.</p>
            <p className="text-sm">Construido con 💜 por Franco Mengarelli • Powered by Emergent AI</p>
          </div>
        </div>
      </footer>
    </main>
    </>
  );
}
