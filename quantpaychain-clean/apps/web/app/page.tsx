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
      title: "Post-Quantum Security",
      description: "NIST-approved cryptography resistant to quantum computing attacks, utilizing CRYSTALS-Dilithium and SPHINCS+ algorithms.",
      gradient: "from-violet-500 to-purple-600",
      stat: "NIST PQC",
      statLabel: "Quantum-Resistant"
    },
    {
      icon: Building2,
      title: "RWA Tokenization",
      description: "Transform real-world assets into digital securities with fractional ownership and automated distributions.",
      gradient: "from-blue-500 to-cyan-600",
      stat: "Active",
      statLabel: "Live Platform"
    },
    {
      icon: Coins,
      title: "Multi-Currency Payments",
      description: "Cross-border transaction infrastructure for multiple fiat currencies and cryptocurrencies with instant settlement.",
      gradient: "from-emerald-500 to-teal-600",
      stat: "6+",
      statLabel: "Blockchains"
    },
    {
      icon: Network,
      title: "ISO 20022 Standard",
      description: "Integration with global financial messaging infrastructure for traditional finance connectivity.",
      gradient: "from-pink-500 to-rose-600",
      stat: "Gateway",
      statLabel: "Compliant"
    },
    {
      icon: Globe,
      title: "Cross-Chain Protocol",
      description: "Interoperable bridge to connect with Ethereum, Polygon, Avalanche, and other major blockchain networks.",
      gradient: "from-indigo-500 to-blue-600",
      stat: "Multi-Chain",
      statLabel: "Supported"
    },
    {
      icon: Sparkles,
      title: "AI-Powered Analytics",
      description: "GPT-4 powered analysis for asset validation, risk assessment, and automated reporting.",
      gradient: "from-orange-500 to-red-600",
      stat: "GPT-4",
      statLabel: "AI Engine"
    }
  ];

  const stats = [
    { value: "$24B+", label: "RWA Market 2025" },
    { value: "10K+", label: "TPS Capacity" },
    { value: "99.99%", label: "Uptime SLA" },
    { value: "6+", label: "Blockchains" }
  ];

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Navbar />
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
              Post-Quantum Security • ISO 20022 Compliant
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-[family-name:var(--font-space-grotesk)]">
              <span className="qpc-gradient-text">
                The Future of
              </span>
              <br />
              <span className="text-white">
                Asset Tokenization
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Enterprise platform combining <span className="text-purple-400 font-semibold">post-quantum cryptography</span> with real-world asset tokenization for institutional finance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/dashboard">
                <Button size="lg" className="qpc-gradient text-white px-8 py-6 text-lg animate-glow-pulse">
                  Launch Platform
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="border-purple-500/30 text-white hover:bg-purple-500/10 px-8 py-6 text-lg">
                  View Demo
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
              <span className="text-white">Core </span>
              <span className="qpc-gradient-text">Capabilities</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Enterprise-grade infrastructure for the next generation of digital finance
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
                  <span className="text-white">Ready to </span>
                  <span className="qpc-gradient-text">Transform</span>
                  <span className="text-white"> Finance?</span>
                </h2>
                
                <p className="text-xl text-gray-300 mb-8">
                  Join leading institutions building the future of asset tokenization with quantum-resistant security.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/dashboard">
                    <Button size="lg" className="qpc-gradient text-white px-8 py-6 text-lg">
                      Get Started
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/docs">
                    <Button size="lg" variant="outline" className="border-purple-500/30 text-white hover:bg-purple-500/10 px-8 py-6 text-lg">
                      Read Whitepaper
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
            <p className="mb-2">&copy; 2025 QuantPay Chain. All rights reserved.</p>
            <p className="text-sm">Built with 💜 by Franco Mengarelli • Powered by Emergent AI</p>
          </div>
        </div>
      </footer>
    </main>
    </>
  );
}
