"use client";

import { Navbar } from "@/components/navbar";
import { PQCSecurityPanel } from "@/components/pqc-security-panel";
import { KYCVerificationForm } from "@/components/kyc-verification-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, UserCheck, Lock, Cpu } from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30">
              <Shield className="h-12 w-12 text-purple-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Centro de Seguridad
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Criptografía Post-Cuántica (PQC) y verificación KYC/AML de nivel institucional.
            Protege tus activos con tecnología resistente a computadoras cuánticas.
          </p>
          
          {/* Security Badges */}
          <div className="flex justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full border border-green-500/20">
              <Lock className="h-4 w-4 text-green-400" />
              <span className="text-green-400 text-sm">NIST FIPS 204</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20">
              <Cpu className="h-4 w-4 text-blue-400" />
              <span className="text-blue-400 text-sm">Quantum-Resistant</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full border border-purple-500/20">
              <UserCheck className="h-4 w-4 text-purple-400" />
              <span className="text-purple-400 text-sm">FATF Compliant</span>
            </div>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="pqc" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 bg-slate-900/50 mb-8">
            <TabsTrigger 
              value="pqc" 
              className="data-[state=active]:bg-purple-500/20 py-4"
            >
              <Shield className="h-5 w-5 mr-2" />
              Criptografía Post-Cuántica
            </TabsTrigger>
            <TabsTrigger 
              value="kyc" 
              className="data-[state=active]:bg-blue-500/20 py-4"
            >
              <UserCheck className="h-5 w-5 mr-2" />
              Verificación KYC/AML
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pqc">
            <PQCSecurityPanel />
          </TabsContent>

          <TabsContent value="kyc">
            <KYCVerificationForm />
          </TabsContent>
        </Tabs>

        {/* Info Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-900/50 rounded-xl border border-purple-500/20">
              <div className="p-3 rounded-lg bg-purple-500/20 w-fit mb-4">
                <Shield className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">ML-DSA (Dilithium)</h3>
              <p className="text-gray-400 text-sm">
                Firmas digitales post-cuánticas estandarizadas por NIST. Resistentes a ataques de computadoras cuánticas.
              </p>
            </div>

            <div className="p-6 bg-slate-900/50 rounded-xl border border-blue-500/20">
              <div className="p-3 rounded-lg bg-blue-500/20 w-fit mb-4">
                <Lock className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">ML-KEM (Kyber)</h3>
              <p className="text-gray-400 text-sm">
                Encapsulación de llaves post-cuántica para intercambio seguro de secretos compartidos.
              </p>
            </div>

            <div className="p-6 bg-slate-900/50 rounded-xl border border-green-500/20">
              <div className="p-3 rounded-lg bg-green-500/20 w-fit mb-4">
                <UserCheck className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">KYC/AML Global</h3>
              <p className="text-gray-400 text-sm">
                Verificación contra listas de sanciones OFAC, EU, UN y cumplimiento FATF en tiempo real.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>QuantPayChain Security Center - Criptografía de nivel institucional</p>
          <p className="mt-2">NIST FIPS 203 & 204 Compliant | FATF Guidelines</p>
        </div>
      </footer>
    </div>
  );
}
