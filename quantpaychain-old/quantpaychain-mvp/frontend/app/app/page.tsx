"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LanguageToggle } from "@/components/language-toggle";
import { 
  ArrowRight, Shield, Database, Wallet, FileCheck, Users, Lock, 
  ChevronRight, Zap, Globe, TrendingUp, Network, Coins, Building2,
  CheckCircle2, ShieldCheck, RefreshCw, Atom, Award, BarChart3,
  Layers, Target, LineChart, Briefcase, Phone, Mail, MapPin,
  Check, Star, Quote, ArrowUpRight, Sparkles, Code2, CloudCog
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { QPCInteractiveDemo } from "@/components/qpc-interactive-demo";

export default function HomePage() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    import('@/lib/i18n');
    setMounted(true);
  }, []);

  const coreFeatures = [
    {
      icon: Atom,
      title: "Post-Quantum Security",
      description: "NIST-approved post-quantum cryptography resistant to quantum computing attacks, utilizing CRYSTALS-Dilithium and SPHINCS+ algorithms to protect digital assets.",
      gradient: "from-violet-500 to-purple-600",
      stat: "NIST PQC",
      statLabel: "Quantum-Resistant"
    },
    {
      icon: FileCheck,
      title: "Smart Digital Contracts",
      description: "Smart contracts with automated execution, multi-party signatures, and immutable audit trails for transparency and compliance.",
      gradient: "from-blue-500 to-cyan-600",
      stat: "MVP",
      statLabel: "In Development"
    },
    {
      icon: Coins,
      title: "Multi-Currency Payments",
      description: "Cross-border transaction infrastructure designed for multiple fiat currencies and cryptocurrencies with planned instant settlement capabilities.",
      gradient: "from-emerald-500 to-teal-600",
      stat: "Planned",
      statLabel: "Q1 2026"
    },
    {
      icon: Building2,
      title: "RWA Tokenization",
      description: "Framework to transform real-world assets into digital securities with fractional ownership and automated distributions.",
      gradient: "from-orange-500 to-red-600",
      stat: "v1.0",
      statLabel: "Q1 2026"
    },
    {
      icon: Network,
      title: "ISO 20022 Standard",
      description: "Integration with global financial messaging infrastructure for traditional finance connectivity.",
      gradient: "from-pink-500 to-rose-600",
      stat: "Gateway",
      statLabel: "Q1 2026"
    },
    {
      icon: Globe,
      title: "Cross-Chain Protocol",
      description: "Interoperable bridge to connect with Ethereum, Polygon, Avalanche, and other major blockchain networks.",
      gradient: "from-indigo-500 to-blue-600",
      stat: "Planned",
      statLabel: "Q2 2026"
    }
  ];

  const technicalHighlights = [
    {
      icon: ShieldCheck,
      title: "Quantum-Resistant Security",
      items: [
        "CRYSTALS-Dilithium digital signatures (NIST FIPS 204)",
        "SPHINCS+ hash-based signatures for long-term security",
        "Kyber key encapsulation (NIST FIPS 203)",
        "Post-quantum secure multi-party computation",
        "Hardware security module (HSM) integration",
        "Zero-knowledge proof verification"
      ]
    },
    {
      icon: Zap,
      title: "Enterprise Performance",
      items: [
        "10,000+ transactions per second (TPS)",
        "Sub-second finality with BFT consensus",
        "Horizontal scaling to 100,000+ TPS",
        "Layer 2 rollup integration ready",
        "Advanced state pruning and compression",
        "Global CDN with edge computing"
      ]
    },
    {
      icon: Lock,
      title: "Regulatory Compliance",
      items: [
        "SEC-compliant security token framework",
        "KYC/AML with Chainalysis integration",
        "GDPR-compliant data privacy",
        "SOC 2 Type II certified infrastructure",
        "ISO 27001 information security",
        "Real-time regulatory reporting"
      ]
    }
  ];

  const whyChooseUs = [
    {
      icon: Shield,
      title: "Future-Proof Security",
      description: "While traditional blockchains remain vulnerable to quantum attacks expected within 10-15 years, QuantPay Chain is being built with quantum-resistant protection from the ground up.",
      competitive: "Post-quantum cryptography integration"
    },
    {
      icon: BarChart3,
      title: "Institutional Grade Vision",
      description: "Designed from the ground up for enterprise adoption with planned bank-level security, compliance tools, and institutional support.",
      competitive: "Enterprise-focused architecture"
    },
    {
      icon: Layers,
      title: "Planned Interoperability",
      description: "Roadmap includes ISO 20022 integration and cross-chain bridges to enable connectivity with traditional finance and blockchain ecosystems.",
      competitive: "Bridging TradFi and DeFi"
    },
    {
      icon: Target,
      title: "Open Development",
      description: "Transparent development process with open-source codebase. Security audits planned for testnet and mainnet launch phases.",
      competitive: "Community-driven and transparent"
    }
  ];

  const enterpriseSolutions = [
    {
      icon: Building2,
      title: "Asset Managers",
      solutions: [
        "Tokenize funds and securities",
        "Automated cap table management",
        "Regulatory reporting automation",
        "Investor portal integration"
      ],
      cta: "Explore for Asset Management"
    },
    {
      icon: Briefcase,
      title: "Financial Institutions",
      solutions: [
        "Cross-border payment rails",
        "Digital asset custody solutions",
        "Smart contract escrow services",
        "Treasury management tools"
      ],
      cta: "Banking Solutions"
    },
    {
      icon: TrendingUp,
      title: "Enterprises",
      solutions: [
        "Supply chain tokenization",
        "Invoice financing automation",
        "Digital identity management",
        "Loyalty token programs"
      ],
      cta: "Enterprise Features"
    }
  ];

  const useCases = [
    {
      icon: Building2,
      title: "Real Estate",
      description: "Framework to tokenize commercial and residential properties with automated rental distributions and transparent title management.",
      color: "bg-blue-500",
      metrics: "Planned Use Case"
    },
    {
      icon: TrendingUp,
      title: "Trade Finance",
      description: "Designed to digitize letters of credit, automate supply chain financing, and enable cross-border settlements with compliance tracking.",
      color: "bg-emerald-500",
      metrics: "Planned Use Case"
    },
    {
      icon: Wallet,
      title: "Payment Services",
      description: "Infrastructure to build payment applications with multi-currency settlement, embedded compliance, and competitive FX rates.",
      color: "bg-purple-500",
      metrics: "Planned Use Case"
    },
    {
      icon: Users,
      title: "Digital Identity",
      description: "Framework for self-sovereign identity solutions with verifiable credentials, privacy-preserving authentication, and compliance.",
      color: "bg-orange-500",
      metrics: "Planned Use Case"
    }
  ];

  const trustIndicators = [
    { label: "Development Status", value: "MVP", description: "Active Development" },
    { label: "Testnet Launch", value: "Q4 2025", description: "November 2025" },
    { label: "Open Source", value: "GitHub", description: "Transparent Code" },
    { label: "Post-Quantum", value: "NIST PQC", description: "Future-Proof" }
  ];

  const securityCertifications = [
    { name: "NIST PQC", icon: Atom },
    { name: "Open Source", icon: ShieldCheck },
    { name: "In Development", icon: Award },
    { name: "Testnet Q4 2025", icon: Lock }
  ];

  const roadmap = [
    {
      phase: "Phase 1",
      quarter: "Q4 2025",
      status: "In Progress",
      completion: 75,
      items: [
        "✓ Core protocol architecture completed",
        "✓ Post-quantum cryptography integration",
        "⚡ Public testnet launch (November 2025)",
        "Developer SDK and documentation"
      ]
    },
    {
      phase: "Phase 2",
      quarter: "Q1 2026",
      status: "Planned",
      completion: 0,
      items: [
        "Mainnet beta with institutional partners",
        "RWA tokenization framework v1.0",
        "ISO 20022 payment gateway",
        "First regulated security token offering"
      ]
    },
    {
      phase: "Phase 3",
      quarter: "Q2 2026",
      status: "Planned",
      completion: 0,
      items: [
        "Full mainnet launch and token generation",
        "Cross-chain bridges (ETH, Polygon, Avalanche)",
        "Institutional custody partnerships",
        "SEC and FinCEN compliance certifications"
      ]
    },
    {
      phase: "Phase 4",
      quarter: "Q3-Q4 2026",
      status: "Roadmap",
      completion: 0,
      items: [
        "Global expansion (EU, APAC markets)",
        "Advanced DeFi protocols (lending, derivatives)",
        "$100M ecosystem development fund",
        "Central bank digital currency (CBDC) pilots"
      ]
    }
  ];

  // Testimonials removed - project is in MVP development stage

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
              <Atom className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                QuantPay Chain
              </span>
              <div className="text-xs text-slate-400">Post-Quantum Protocol</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#technology" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Technology
            </Link>
            <Link href="#enterprise" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Enterprise
            </Link>
            <Link href="#roadmap" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Roadmap
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <LanguageToggle />
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 hover:from-violet-700 hover:via-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/50">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Animated background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center max-w-6xl">
          <Badge variant="secondary" className="mb-6 bg-purple-500/20 text-purple-200 border-purple-500/30 hover:bg-purple-500/30 text-sm px-4 py-2">
            <Sparkles className="mr-2 h-4 w-4" />
            Post-Quantum Blockchain in Development
          </Badge>
          
          <h1 className="mx-auto max-w-5xl text-5xl font-bold tracking-tight lg:text-7xl mb-6">
            Finanzas Más Claras
            <span className="block mt-2 bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Acuerdos Más Justos, Decisiones Más Libres
            </span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-3xl text-xl text-slate-300 lg:text-2xl leading-relaxed">
            A blockchain protocol in development combining <span className="text-purple-400 font-semibold">NIST-approved post-quantum cryptography</span>, 
            <span className="text-blue-400 font-semibold"> RWA tokenization</span>, and <span className="text-emerald-400 font-semibold">ISO 20022 interoperability</span> 
            to bring transparency, fairness, and freedom to digital finance.
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#request-demo">
              <Button size="lg" className="bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 hover:from-violet-700 hover:via-purple-700 hover:to-blue-700 text-lg px-8 py-6 shadow-xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all">
                Request Institutional Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white">
                Try Interactive Demo
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {trustIndicators.map((indicator, index) => (
              <div key={index} className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                <div className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {indicator.value}
                </div>
                <div className="text-white font-semibold mb-1">{indicator.label}</div>
                <div className="text-slate-400 text-sm">{indicator.description}</div>
              </div>
            ))}
          </div>

          {/* Security Certifications */}
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {securityCertifications.map((cert, index) => (
              <Badge key={index} variant="outline" className="px-4 py-2 border-slate-600 text-slate-300 bg-slate-800/50">
                <cert.icon className="mr-2 h-4 w-4" />
                {cert.name}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose QuantPay Chain */}
      <section className="py-20 bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-violet-500/30 text-violet-300">
              Competitive Advantage
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Why QuantPay Chain Matters
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              A platform being built from the ground up with institutional requirements in mind
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whyChooseUs.map((item, index) => (
              <Card key={index} className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700 hover:border-purple-500/50 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <item.icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold mb-3 text-white group-hover:text-purple-300 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-slate-300 leading-relaxed mb-4">
                        {item.description}
                      </p>
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                        <Star className="mr-1 h-3 w-3" />
                        {item.competitive}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* QPC v2 Interactive Demo Section */}
      <section id="qpc-v2-demo" className="py-24 bg-gradient-to-br from-purple-950/40 via-slate-950 to-blue-950/40 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-violet-500/50 text-violet-300 bg-violet-500/10">
              <Code2 className="mr-2 h-4 w-4" />
              QPC v2 Core Technology
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Experience QuantPay Chain v2
              <span className="block mt-2 bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Live Interactive Demo
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Test our production-ready core components powering institutional-grade blockchain infrastructure
            </p>
          </div>

          {/* Interactive Demo Tabs */}
          <QPCInteractiveDemo />
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-20 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-purple-500/30 text-purple-300">
              Core Capabilities
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Enterprise Features Built for Scale
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              A comprehensive protocol designed to secure and streamline institutional digital finance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreFeatures.map((feature, index) => (
              <Card key={index} className="group bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
                <CardContent className="p-8">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-purple-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <div className="pt-4 border-t border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-purple-400">{feature.stat}</span>
                      <span className="text-sm text-slate-500">{feature.statLabel}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Deep Dive */}
      <section id="technology" className="py-20 bg-gradient-to-br from-slate-950 to-purple-950/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-violet-500/30 text-violet-300">
              Technical Architecture
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Post-Quantum Technology Stack
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Military-grade security meets enterprise performance and regulatory compliance
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {technicalHighlights.map((highlight, index) => (
              <Card key={index} className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700 hover:border-violet-500/50 transition-all">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-6">
                    <highlight.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-6 text-white">
                    {highlight.title}
                  </h3>
                  <ul className="space-y-3">
                    {highlight.items.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* RWA & ISO 20022 Section */}
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-500/30 hover:border-orange-500/50 transition-all">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-4 text-white">
                      Real-World Asset Tokenization
                    </h3>
                    <p className="text-slate-300 mb-4">
                      Transform physical assets into compliant digital securities with institutional-grade infrastructure.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-slate-400 text-sm">SEC Reg D/S compliant tokenization framework</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-slate-400 text-sm">Automated investor accreditation and cap table</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-slate-400 text-sm">24/7 secondary market trading on ATS platforms</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-slate-400 text-sm">Immutable ownership records and audit trails</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-slate-400 text-sm">Smart contract-based dividend distributions</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-500/30 hover:border-blue-500/50 transition-all">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
                    <Network className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-4 text-white">
                      ISO 20022 Interoperability
                    </h3>
                    <p className="text-slate-300 mb-4">
                      Native integration with global financial messaging standards for seamless traditional finance connectivity.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-slate-400 text-sm">Direct SWIFT network integration</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-slate-400 text-sm">MX message format support (pacs, pain, camt)</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-slate-400 text-sm">Real-time gross settlement (RTGS) compatible</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-slate-400 text-sm">Central bank digital currency (CBDC) ready</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-slate-400 text-sm">Automated sanctions screening and compliance</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enterprise Solutions */}
      <section id="enterprise" className="py-20 bg-slate-900/80">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-blue-500/30 text-blue-300">
              Enterprise Solutions
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Tailored for Your Industry
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Purpose-built solutions for financial institutions, asset managers, and enterprises
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {enterpriseSolutions.map((solution, index) => (
              <Card key={index} className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700 hover:border-blue-500/50 transition-all group">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <solution.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-white">
                    {solution.title}
                  </h3>
                  <ul className="space-y-3 mb-6">
                    {solution.solutions.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                    {solution.cta}
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* White Glove Service */}
          <Card className="mt-12 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
            <CardContent className="p-8 text-center">
              <CloudCog className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-3 text-white">
                White Glove Enterprise Onboarding
              </h3>
              <p className="text-slate-300 max-w-2xl mx-auto mb-6">
                Dedicated technical account managers, custom integration support, and priority 24/7 enterprise support for institutional clients.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2">
                  <Phone className="mr-2 h-4 w-4" />
                  24/7 Support
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-2">
                  <Code2 className="mr-2 h-4 w-4" />
                  Custom Integration
                </Badge>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-4 py-2">
                  <Users className="mr-2 h-4 w-4" />
                  Dedicated Team
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="py-20 bg-gradient-to-br from-slate-950 to-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-emerald-500/30 text-emerald-300">
              Real-World Applications
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Planned Use Cases Across Industries
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              From real estate to trade finance, QuantPay Chain is being designed for multiple applications
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <Card key={index} className="group bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 ${useCase.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <useCase.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white text-center">
                    {useCase.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4 text-center">
                    {useCase.description}
                  </p>
                  <div className="pt-4 border-t border-slate-700/50">
                    <Badge className="w-full justify-center bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      {useCase.metrics}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* Roadmap */}
      <section id="roadmap" className="py-20 bg-gradient-to-br from-slate-950 to-blue-950/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-blue-500/30 text-blue-300">
              Development Timeline
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Product Roadmap
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Our journey to revolutionize institutional finance with post-quantum security
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roadmap.map((phase, index) => (
              <Card key={index} className={`bg-slate-800/50 border-slate-700 ${phase.status === 'In Progress' ? 'ring-2 ring-purple-500' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant={phase.status === 'In Progress' ? 'default' : 'secondary'} 
                           className={phase.status === 'In Progress' ? 'bg-purple-600' : 'bg-slate-700'}>
                      {phase.status}
                    </Badge>
                  </div>
                  {phase.status === 'In Progress' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-purple-400 font-semibold">{phase.completion}%</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                          style={{ width: `${phase.completion}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {phase.phase}
                  </h3>
                  <div className="text-sm text-slate-400 mb-4">{phase.quarter}</div>
                  <ul className="space-y-2">
                    {phase.items.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <div className={`${item.startsWith('✓') ? 'bg-emerald-400' : item.startsWith('⚡') ? 'bg-purple-400' : 'bg-slate-400'} w-1.5 h-1.5 rounded-full mr-2 mt-2 flex-shrink-0`}></div>
                        <span className="text-slate-300 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Request Demo Section */}
      <section id="request-demo" className="py-20 bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="container relative z-10 mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
              Request an Institutional Demo
            </h2>
            <p className="text-xl mb-8 text-purple-100">
              See how QuantPay Chain can transform your institutional digital asset infrastructure. 
              Schedule a personalized demo with our enterprise team.
            </p>
          </div>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white">What You'll Get:</h3>
                  <ul className="space-y-3">
                    {[
                      "Personalized platform walkthrough",
                      "Custom integration assessment",
                      "Technical architecture deep-dive",
                      "Regulatory compliance review",
                      "ROI and cost analysis",
                      "Dedicated solutions architect"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-emerald-300 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-white">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white">Contact Information:</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-purple-200">Email</div>
                        <div className="text-white font-semibold">enterprise@quantpaychain.com</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                        <Phone className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-purple-200">Phone</div>
                        <div className="text-white font-semibold">+1 (650) 555-0123</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-purple-200">Headquarters</div>
                        <div className="text-white font-semibold">San Francisco, CA</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <Link href="/auth/signup">
                      <Button size="lg" variant="secondary" className="w-full text-lg px-8 py-6 bg-white text-purple-600 hover:bg-slate-100 shadow-xl">
                        Schedule Demo
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link href="/demo">
                      <Button size="lg" variant="outline" className="w-full text-lg px-8 py-6 border-white text-white hover:bg-white/10">
                        Try Interactive Demo
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Atom className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                  QuantPay Chain
                </span>
              </div>
              <p className="text-slate-400 mb-4 text-sm">
                Enterprise post-quantum protocol for institutional digital finance.
              </p>
              <div className="flex space-x-2">
                {securityCertifications.slice(0, 2).map((cert, i) => (
                  <Badge key={i} variant="outline" className="border-slate-700 text-slate-400 text-xs px-2 py-1">
                    <cert.icon className="h-3 w-3" />
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="#features" className="hover:text-purple-400 transition-colors">Features</Link></li>
                <li><Link href="#technology" className="hover:text-purple-400 transition-colors">Technology</Link></li>
                <li><Link href="#enterprise" className="hover:text-purple-400 transition-colors">Enterprise</Link></li>
                <li><Link href="/demo" className="hover:text-purple-400 transition-colors">Demo</Link></li>
                <li><Link href="/dashboard" className="hover:text-purple-400 transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Resources</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="#" className="hover:text-purple-400 transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-purple-400 transition-colors">Technical Whitepaper</Link></li>
                <li><Link href="#" className="hover:text-purple-400 transition-colors">API Reference</Link></li>
                <li><Link href="#" className="hover:text-purple-400 transition-colors">Security Audits</Link></li>
                <li><Link href="#" className="hover:text-purple-400 transition-colors">Github</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="#" className="hover:text-purple-400 transition-colors">About Us</Link></li>
                <li><Link href="#request-demo" className="hover:text-purple-400 transition-colors">Contact Sales</Link></li>
                <li><Link href="#" className="hover:text-purple-400 transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-purple-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm mb-4 md:mb-0">
              &copy; 2025 QuantPay Chain. Building quantum-resistant institutional finance infrastructure.
            </p>
            <div className="flex space-x-4 text-slate-400 text-sm">
              <Link href="#" className="hover:text-purple-400 transition-colors">Status</Link>
              <Link href="#" className="hover:text-purple-400 transition-colors">Security</Link>
              <Link href="#" className="hover:text-purple-400 transition-colors">Compliance</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}