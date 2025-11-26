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
  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            {documents.map((doc) => {
              const Icon = doc.icon;
              const colorClasses = {
                purple: "text-purple-400 border-purple-500/20",
                blue: "text-blue-400 border-blue-500/20",
                green: "text-green-400 border-green-500/20",
                orange: "text-orange-400 border-orange-500/20"
              };

              return (
                <Card key={doc.id} className={`glass-effect ${colorClasses[doc.color as keyof typeof colorClasses].split(' ')[1]}`}>
                  <CardContent className="p-8">
                    <Icon className={colorClasses[doc.color as keyof typeof colorClasses].split(' ')[0]} size={32} />
                    <h3 className="text-xl font-bold text-white mb-2 mt-4">{doc.title}</h3>
                    <p className="text-gray-400 mb-2">{doc.description}</p>
                    <p className="text-sm text-gray-500 mb-4">Tamaño: {doc.size}</p>
                    <Button 
                      onClick={() => handleDownload(doc.file, `${doc.title.toLowerCase().replace(/\s+/g, '-')}.pdf`)}
                      className="qpc-gradient text-white"
                    >
                      <Download className="mr-2" size={16} />
                      Descargar PDF
                    </Button>
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
