"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/page-layout";
import { FileText, ExternalLink, BookOpen, Shield, Globe } from "lucide-react";
import Link from "next/link";

const documents = [
  {
    title: "Whitepaper Técnico",
    titleEn: "Technical Whitepaper",
    description: "Arquitectura, tecnología y visión de QuantPayChain",
    descriptionEn: "Architecture, technology and vision of QuantPayChain",
    icon: FileText,
    path: "/docs/whitepaper",
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Guía Técnica",
    titleEn: "Technical Guide",
    description: "Documentación completa para desarrolladores",
    descriptionEn: "Complete documentation for developers",
    icon: BookOpen,
    path: "/docs/technical-guide",
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Seguridad Post-Cuántica",
    titleEn: "Post-Quantum Security",
    description: "Implementación de criptografía resistente a computadoras cuánticas",
    descriptionEn: "Implementation of quantum-resistant cryptography",
    icon: Shield,
    path: "/docs/pqc-security",
    color: "from-emerald-500 to-teal-500",
    comingSoon: true
  },
  {
    title: "ISO 20022 Compliance",
    titleEn: "ISO 20022 Compliance",
    description: "Estándares de mensajería financiera internacional",
    descriptionEn: "International financial messaging standards",
    icon: Globe,
    path: "/docs/iso20022",
    color: "from-orange-500 to-red-500",
    comingSoon: true
  }
];

export default function DocsPage() {
  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Documentación Técnica
            </h1>
            <p className="text-gray-400">Guías completas y especificaciones técnicas</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {documents.map((doc, index) => {
              const Icon = doc.icon;

              return (
                <Card key={index} className="glass-effect border-gray-800/50 hover:border-gray-700/50 transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${doc.color} flex items-center justify-center mb-4`}>
                      <Icon className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{doc.title}</h3>
                    <p className="text-gray-400 mb-4">{doc.description}</p>
                    
                    {doc.comingSoon ? (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-amber-400 font-medium">Próximamente</span>
                        <Button disabled className="bg-gray-700 text-gray-400 cursor-not-allowed">
                          <ExternalLink className="mr-2" size={16} />
                          Ver Documentación
                        </Button>
                      </div>
                    ) : (
                      <Link href={doc.path} target="_blank" rel="noopener noreferrer">
                        <Button className="qpc-gradient text-white group-hover:scale-105 transition-transform">
                          <ExternalLink className="mr-2" size={16} />
                          Ver Documentación
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
