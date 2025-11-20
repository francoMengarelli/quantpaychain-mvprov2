"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Atom, Shield, Zap } from "lucide-react";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <Badge className="mb-4 bg-purple-500/10 text-purple-300 border-purple-500/20">
            <Atom className="w-4 h-4 mr-2 inline" />
            Interactive Demo
          </Badge>
          <h1 className="text-4xl font-bold text-white mb-2">QuantPay Chain Demo</h1>
          <p className="text-gray-400 text-lg">Experience the future of asset tokenization</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-effect border-purple-500/20">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Atom className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Post-Quantum Security</h3>
              <p className="text-gray-400 text-sm">NIST-approved cryptography protecting your assets</p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-purple-500/20">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <Shield className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">ISO 20022 Compliant</h3>
              <p className="text-gray-400 text-sm">Global financial messaging standards</p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-purple-500/20">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Zap className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">10K+ TPS</h3>
              <p className="text-gray-400 text-sm">Enterprise-grade performance</p>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-effect border-purple-500/20">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Coming Soon</h2>
            <p className="text-gray-400 text-lg mb-6">Interactive demo of tokenization process</p>
            <div className="flex justify-center space-x-4">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
