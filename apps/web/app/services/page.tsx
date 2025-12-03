"use client";

import { useState, useEffect } from "react";
import { PageLayout } from "@/components/page-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  FileText, 
  TrendingUp, 
  Lock, 
  Zap,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Code,
  Activity
} from "lucide-react";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://quantpaychain-api.onrender.com';

interface ServiceStatus {
  name: string;
  status: 'loading' | 'online' | 'offline' | 'error';
  description: string;
  endpoints: number;
  icon: any;
  color: string;
  features: string[];
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: "Post-Quantum Cryptography",
      status: 'loading',
      description: "Quantum-safe signatures and encryption",
      endpoints: 4,
      icon: Shield,
      color: "from-purple-500 to-pink-500",
      features: ["ML-DSA Signatures", "ML-KEM Encryption", "NIST Level 3"]
    },
    {
      name: "ISO 20022 Compliance",
      status: 'loading',
      description: "Financial messaging standards",
      endpoints: 4,
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
      features: ["pain.001", "pain.002", "camt.053"]
    },
    {
      name: "AI Risk Analytics",
      status: 'loading',
      description: "Real-time KYT and fraud detection",
      endpoints: 4,
      icon: TrendingUp,
      color: "from-emerald-500 to-green-500",
      features: ["KYT Monitoring", "Asset Validation", "Portfolio Analytics"]
    },
    {
      name: "AI Legal Advisor",
      status: 'loading',
      description: "Automated legal analysis",
      endpoints: 1,
      icon: Lock,
      color: "from-orange-500 to-red-500",
      features: ["Securities Analysis", "Compliance Roadmap", "Risk Assessment"]
    }
  ]);

  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    checkServicesStatus();
  }, []);

  const checkServicesStatus = async () => {
    try {
      // Check main API
      const healthCheck = await fetch(`${API_BASE_URL}/`);
      const healthData = await healthCheck.json();
      
      if (healthCheck.ok) {
        setApiStatus('online');
      } else {
        setApiStatus('offline');
      }

      // Check individual services
      const serviceChecks = [
        { name: "Post-Quantum Cryptography", endpoint: '/api/pqc/service-info' },
        { name: "ISO 20022 Compliance", endpoint: '/api/iso20022/service-info' },
        { name: "AI Risk Analytics", endpoint: '/api/risk/service-info' },
        { name: "AI Legal Advisor", endpoint: '/api/test/ai-status' }
      ];

      const updatedServices = await Promise.all(
        serviceChecks.map(async (service) => {
          try {
            const response = await fetch(`${API_BASE_URL}${service.endpoint}`);
            const currentService = services.find(s => s.name === service.name);
            
            return {
              ...currentService!,
              status: response.ok ? 'online' as const : 'offline' as const
            };
          } catch (error) {
            const currentService = services.find(s => s.name === service.name);
            return {
              ...currentService!,
              status: 'error' as const
            };
          }
        })
      );

      setServices(updatedServices);
    } catch (error) {
      setApiStatus('offline');
      setServices(services.map(s => ({ ...s, status: 'error' as const })));
    }
  };

  const getStatusBadge = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Online</Badge>;
      case 'offline':
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Offline</Badge>;
      case 'error':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Error</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">Checking...</Badge>;
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              <span className="qpc-gradient-text">Platform Services</span>
            </h1>
            <p className="text-xl text-gray-400 mb-6">
              Institutional-grade infrastructure for RWA tokenization
            </p>
            
            {/* API Status */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-lg glass-effect border border-purple-500/20">
              <Activity className={`h-5 w-5 ${apiStatus === 'online' ? 'text-green-400 animate-pulse' : 'text-red-400'}`} />
              <span className="text-white font-semibold">
                API Status: 
              </span>
              {apiStatus === 'checking' && <span className="text-gray-400">Checking...</span>}
              {apiStatus === 'online' && <span className="text-green-400">Operational</span>}
              {apiStatus === 'offline' && <span className="text-red-400">Offline</span>}
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="glass-effect border-purple-500/20 hover:border-purple-500/40 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${service.color}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      {getStatusBadge(service.status)}
                    </div>
                    <CardTitle className="text-white text-2xl">{service.name}</CardTitle>
                    <CardDescription className="text-gray-400 text-base">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Features */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Key Features:</h4>
                        <div className="flex flex-wrap gap-2">
                          {service.features.map((feature, idx) => (
                            <Badge key={idx} variant="outline" className="border-purple-500/30 text-purple-300">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Endpoints Count */}
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Code className="h-4 w-4" />
                        <span>{service.endpoints} API endpoints available</span>
                      </div>

                      {/* Action Button */}
                      <Button 
                        className="w-full qpc-gradient text-white"
                        onClick={() => window.open(`${API_BASE_URL}/docs`, '_blank')}
                      >
                        View API Docs
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Integration Examples */}
          <Card className="glass-effect border-purple-500/20 mb-12">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center gap-2">
                <Zap className="h-6 w-6 text-yellow-400" />
                Integration Patterns
              </CardTitle>
              <CardDescription className="text-gray-400">
                How services work together for institutional-grade operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Pattern 1 */}
                <div className="bg-slate-900/50 rounded-lg p-4 border border-blue-500/20">
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-400" />
                    Secure Payment Flow
                  </h4>
                  <div className="text-sm text-gray-300 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400 font-mono">1.</span>
                      <span><strong className="text-purple-400">ISO 20022</strong> generates payment message</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400 font-mono">2.</span>
                      <span><strong className="text-green-400">Risk Analytics</strong> validates transaction</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400 font-mono">3.</span>
                      <span><strong className="text-pink-400">PQC</strong> signs with quantum-safe signature</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400 font-mono">4.</span>
                      <span>Transaction processed with full compliance & security</span>
                    </div>
                  </div>
                </div>

                {/* Pattern 2 */}
                <div className="bg-slate-900/50 rounded-lg p-4 border border-emerald-500/20">
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    Asset Tokenization Flow
                  </h4>
                  <div className="text-sm text-gray-300 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-mono">1.</span>
                      <span><strong className="text-orange-400">AI Legal Advisor</strong> analyzes asset legality</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-mono">2.</span>
                      <span><strong className="text-green-400">Risk Analytics</strong> validates asset authenticity</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-mono">3.</span>
                      <span><strong className="text-pink-400">PQC</strong> generates quantum-safe keys</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-mono">4.</span>
                      <span>Asset tokenized with full compliance trail</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/create-asset">
              <Card className="glass-effect border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer h-full">
                <CardContent className="p-6 text-center">
                  <Zap className="h-12 w-12 text-purple-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">Create Asset</h3>
                  <p className="text-gray-400 text-sm">Start tokenizing with AI guidance</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/marketplace">
              <Card className="glass-effect border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer h-full">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">Marketplace</h3>
                  <p className="text-gray-400 text-sm">Browse available tokens</p>
                </CardContent>
              </Card>
            </Link>

            <a href={`${API_BASE_URL}/docs`} target="_blank" rel="noopener noreferrer">
              <Card className="glass-effect border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer h-full">
                <CardContent className="p-6 text-center">
                  <Code className="h-12 w-12 text-green-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">API Documentation</h3>
                  <p className="text-gray-400 text-sm">Explore all endpoints</p>
                </CardContent>
              </Card>
            </a>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
