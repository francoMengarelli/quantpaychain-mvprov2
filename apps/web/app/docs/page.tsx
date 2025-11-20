"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Technical Documentation
          </h1>
          <p className="text-gray-400">Comprehensive guides and technical specifications</p>
        </div>

        {/* Documentation Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="glass-effect border-purple-500/20 hover:border-purple-500/40 transition-all">
            <CardContent className="p-8">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mr-4">
                  <FileText className="text-purple-400" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Platform Whitepaper</h3>
                  <p className="text-gray-400 mb-4">Complete technical overview of QuantPay Chain architecture</p>
                  <Button className="qpc-gradient text-white">
                    <Download className="mr-2" size={16} />
                    Download PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-purple-500/20 hover:border-purple-500/40 transition-all">
            <CardContent className="p-8">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mr-4">
                  <FileText className="text-blue-400" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Post-Quantum Security</h3>
                  <p className="text-gray-400 mb-4">Implementation details of NIST-approved algorithms</p>
                  <Button className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30">
                    <Download className="mr-2" size={16} />
                    Download PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-purple-500/20 hover:border-purple-500/40 transition-all">
            <CardContent className="p-8">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center mr-4">
                  <FileText className="text-emerald-400" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">ISO 20022 Compliance</h3>
                  <p className="text-gray-400 mb-4">Standards compliance and integration guide</p>
                  <Button className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30">
                    <Download className="mr-2" size={16} />
                    Download PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-purple-500/20 hover:border-purple-500/40 transition-all">
            <CardContent className="p-8">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center mr-4">
                  <FileText className="text-orange-400" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">API Documentation</h3>
                  <p className="text-gray-400 mb-4">Interactive API reference and examples</p>
                  <Link href="/api-docs" target="_blank">
                    <Button className="bg-orange-500/20 text-orange-300 hover:bg-orange-500/30">
                      <ExternalLink className="mr-2" size={16} />
                      View Online
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technical Guides */}
        <Card className="glass-effect border-purple-500/20">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Technical Guides</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-purple-500/10 hover:border-purple-500/30 transition-all">
                <div>
                  <h4 className="font-semibold text-white">Getting Started with RWA Tokenization</h4>
                  <p className="text-sm text-gray-400">Step-by-step guide to tokenize your first asset</p>
                </div>
                <Button variant="ghost" className="text-purple-400">
                  <ExternalLink size={18} />
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-purple-500/10 hover:border-purple-500/30 transition-all">
                <div>
                  <h4 className="font-semibold text-white">Multi-Chain Integration Guide</h4>
                  <p className="text-sm text-gray-400">Connect to Ethereum, Polygon, and more</p>
                </div>
                <Button variant="ghost" className="text-purple-400">
                  <ExternalLink size={18} />
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-purple-500/10 hover:border-purple-500/30 transition-all">
                <div>
                  <h4 className="font-semibold text-white">Payment Integration</h4>
                  <p className="text-sm text-gray-400">Accept payments and manage settlements</p>
                </div>
                <Button variant="ghost" className="text-purple-400">
                  <ExternalLink size={18} />
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-purple-500/10 hover:border-purple-500/30 transition-all">
                <div>
                  <h4 className="font-semibold text-white">Security Best Practices</h4>
                  <p className="text-sm text-gray-400">Implementing quantum-resistant security</p>
                </div>
                <Button variant="ghost" className="text-purple-400">
                  <ExternalLink size={18} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
