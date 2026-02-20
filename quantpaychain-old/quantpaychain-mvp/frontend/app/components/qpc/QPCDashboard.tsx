
'use client';

/**
 * Dashboard principal para demostrar todas las funcionalidades del núcleo QPC v2
 */

import { ISO20022Parser } from './ISO20022Parser';
import { PQCEncryption } from './PQCEncryption';
import { KYCVerification } from './KYCVerification';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function QPCDashboard() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">QPC v2 Core Demo</h1>
        <p className="text-muted-foreground">
          Demonstration of QuantPay Chain v2 Core functionality including ISO 20022, Post-Quantum Cryptography, and AI KYC/AML
        </p>
      </div>
      
      <Tabs defaultValue="iso20022" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="iso20022">ISO 20022</TabsTrigger>
          <TabsTrigger value="pqc">Post-Quantum Crypto</TabsTrigger>
          <TabsTrigger value="kyc">KYC/AML</TabsTrigger>
        </TabsList>
        
        <TabsContent value="iso20022">
          <ISO20022Parser />
        </TabsContent>
        
        <TabsContent value="pqc">
          <PQCEncryption />
        </TabsContent>
        
        <TabsContent value="kyc">
          <KYCVerification />
        </TabsContent>
      </Tabs>
    </div>
  );
}
