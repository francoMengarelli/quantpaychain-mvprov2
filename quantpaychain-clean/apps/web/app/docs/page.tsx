"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/page-layout";

export default function DocsPage() {
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
            <Card className="glass-effect border-purple-500/20">
              <CardContent className="p-8">
                <FileText className="text-purple-400 mb-4" size={32} />
                <h3 className="text-xl font-bold text-white mb-2">Platform Whitepaper</h3>
                <p className="text-gray-400 mb-4">Complete technical overview</p>
                <Button className="qpc-gradient text-white">
                  <Download className="mr-2" size={16} />
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-effect border-purple-500/20">
              <CardContent className="p-8">
                <FileText className="text-blue-400 mb-4" size={32} />
                <h3 className="text-xl font-bold text-white mb-2">Post-Quantum Security</h3>
                <p className="text-gray-400 mb-4">NIST-approved algorithms</p>
                <Button className="bg-blue-500/20 text-blue-300">
                  <Download className="mr-2" size={16} />
                  Download PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
