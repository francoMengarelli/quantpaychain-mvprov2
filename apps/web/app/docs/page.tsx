"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download, ExternalLink, Book, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/page-layout";

const documents = [
  {
    id: 1,
    title: "Platform Whitepaper",
    description: "Complete technical overview of QuantPayChain platform",
    icon: FileText,
    color: "purple",
    file: "/docs/quantpaychain-whitepaper.pdf",
    size: "2.4 MB"
  },
  {
    id: 2,
    title: "Post-Quantum Security",
    description: "NIST-approved post-quantum cryptography implementation",
    icon: Shield,
    color: "blue",
    file: "/docs/post-quantum-security.pdf",
    size: "1.8 MB"
  },
  {
    id: 3,
    title: "ISO 20022 Compliance",
    description: "Financial messaging standards implementation guide",
    icon: Book,
    color: "green",
    file: "/docs/iso20022-compliance.pdf",
    size: "1.2 MB"
  },
  {
    id: 4,
    title: "API Documentation",
    description: "Complete REST API reference and integration guide",
    icon: FileText,
    color: "orange",
    file: "/docs/api-documentation.pdf",
    size: "3.1 MB"
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
              Technical Documentation
            </h1>
            <p className="text-gray-400">Comprehensive guides and technical specifications</p>
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
                    <p className="text-sm text-gray-500 mb-4">Size: {doc.size}</p>
                    <Button 
                      onClick={() => handleDownload(doc.file, `${doc.title.toLowerCase().replace(/\s+/g, '-')}.pdf`)}
                      className="qpc-gradient text-white"
                    >
                      <Download className="mr-2" size={16} />
                      Download PDF
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
