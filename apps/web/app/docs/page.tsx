"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download, ExternalLink, Book, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/page-layout";

const documents = [
  {
    id: 1,
    title: "Whitepaper de la Plataforma",
    description: "Descripción técnica completa de la plataforma QuantPayChain",
    icon: FileText,
    color: "purple",
    file: "/docs/quantpaychain-whitepaper.pdf",
    size: "2.7 KB"
  },
  {
    id: 2,
    title: "Seguridad Post-Cuántica",
    description: "Implementación de criptografía post-cuántica aprobada por NIST",
    icon: Shield,
    color: "blue",
    file: "/docs/post-quantum-security.pdf",
    size: "2.4 KB"
  },
  {
    id: 3,
    title: "Cumplimiento ISO 20022",
    description: "Guía de implementación de estándares de mensajería financiera",
    icon: Book,
    color: "green",
    file: "/docs/iso20022-compliance.pdf",
    size: "2.2 KB"
  },
  {
    id: 4,
    title: "Documentación de API",
    description: "Referencia completa de API REST y guía de integración",
    icon: FileText,
    color: "orange",
    file: "/docs/api-documentation.pdf",
    size: "2.3 KB"
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
