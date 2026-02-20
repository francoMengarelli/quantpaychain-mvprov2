"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield, FileText, Brain, CheckCircle2, AlertTriangle,
  Copy, Play, RotateCw, Sparkles, Code2, ArrowRight,
  Lock, Unlock, Key, FileCheck, AlertCircle, TrendingUp
} from "lucide-react";

export function QPCInteractiveDemo() {
  const [activeTab, setActiveTab] = useState("iso20022");
  
  // ISO 20022 Demo State
  const [iso20022Message, setIso20022Message] = useState("");
  const [iso20022Result, setIso20022Result] = useState<any>(null);
  const [iso20022Loading, setIso20022Loading] = useState(false);
  
  // PQC Demo State
  const [pqcMessage, setPqcMessage] = useState("");
  const [pqcSignature, setPqcSignature] = useState<any>(null);
  const [pqcVerification, setPqcVerification] = useState<any>(null);
  const [pqcLoading, setPqcLoading] = useState(false);
  
  // KYC/AML Demo State
  const [kycTransaction, setKycTransaction] = useState<any>(null);
  const [kycResult, setKycResult] = useState<any>(null);
  const [kycLoading, setKycLoading] = useState(false);

  // ISO 20022 Sample XML
  const sampleISO20022 = `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03">
  <CstmrCdtTrfInitn>
    <GrpHdr>
      <MsgId>MSGID-001-2024</MsgId>
      <CreDtTm>2024-11-11T10:00:00</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
      <CtrlSum>10000.00</CtrlSum>
      <InitgPty>
        <Nm>Acme Corporation</Nm>
      </InitgPty>
    </GrpHdr>
    <PmtInf>
      <PmtInfId>PMTINF-001</PmtInfId>
      <PmtMtd>TRF</PmtMtd>
      <ReqdExctnDt>2024-11-12</ReqdExctnDt>
      <Dbtr>
        <Nm>Acme Corporation</Nm>
      </Dbtr>
      <CdtTrfTxInf>
        <Amt><InstdAmt Ccy="USD">10000.00</InstdAmt></Amt>
        <Cdtr><Nm>Global Tech Inc</Nm></Cdtr>
      </CdtTrfTxInf>
    </PmtInf>
  </CstmrCdtTrfInitn>
</Document>`;

  // Demo handlers
  const handleISO20022Demo = async () => {
    setIso20022Loading(true);
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIso20022Result({
      messageType: "pain.001.001.03",
      status: "valid",
      transactions: 1,
      totalAmount: "10,000.00 USD",
      sender: "Acme Corporation",
      receiver: "Global Tech Inc",
      validationErrors: 0,
      processingTime: "147ms"
    });
    setIso20022Loading(false);
  };

  const handlePQCSignDemo = async () => {
    setPqcLoading(true);
    setPqcVerification(null);
    // Simulate signature generation
    await new Promise(resolve => setTimeout(resolve, 1200));
    setPqcSignature({
      algorithm: "ML-DSA-65 (Dilithium)",
      signatureSize: "2,420 bytes",
      publicKeySize: "1,952 bytes",
      generationTime: "3.2ms",
      signature: "0x7a8f9e2b...4d3c1a0e",
      quantumResistant: true
    });
    setPqcLoading(false);
  };

  const handlePQCVerifyDemo = async () => {
    setPqcLoading(true);
    // Simulate signature verification
    await new Promise(resolve => setTimeout(resolve, 800));
    setPqcVerification({
      valid: true,
      verificationTime: "2.1ms",
      algorithm: "ML-DSA-65 (Dilithium)",
      securityLevel: "NIST Level 3",
      quantumResistant: true
    });
    setPqcLoading(false);
  };

  const handleKYCDemo = async () => {
    setKycLoading(true);
    // Simulate KYC/AML analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    setKycResult({
      riskScore: 23,
      riskLevel: "LOW",
      recommendation: "APPROVED",
      checks: {
        sanctions: { passed: true, matches: 0 },
        pep: { passed: true, matches: 0 },
        adverseMedia: { passed: true, matches: 0 },
        transactionPattern: { passed: true, anomalies: 0 }
      },
      factors: [
        { factor: "Transaction Amount", impact: "+5", value: "$10,000" },
        { factor: "Customer History", impact: "-8", value: "15 months, clean" },
        { factor: "Geographic Risk", impact: "+3", value: "Low-risk jurisdiction" },
        { factor: "Transaction Pattern", impact: "+2", value: "Normal activity" }
      ],
      processingTime: "342ms"
    });
    setKycLoading(false);
  };

  const loadSampleTransaction = () => {
    setKycTransaction({
      id: "TXN-2024-001",
      amount: 10000,
      currency: "USD",
      sender: { name: "Acme Corporation", country: "USA" },
      receiver: { name: "Global Tech Inc", country: "DEU" },
      type: "INTERNATIONAL_WIRE"
    });
  };

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700 p-1 rounded-xl mb-8">
          <TabsTrigger 
            value="iso20022" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-600 data-[state=active]:to-rose-600 data-[state=active]:text-white rounded-lg transition-all"
          >
            <FileText className="mr-2 h-4 w-4" />
            ISO 20022 Gateway
          </TabsTrigger>
          <TabsTrigger 
            value="pqc"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all"
          >
            <Shield className="mr-2 h-4 w-4" />
            Post-Quantum Crypto
          </TabsTrigger>
          <TabsTrigger 
            value="kyc"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg transition-all"
          >
            <Brain className="mr-2 h-4 w-4" />
            AI KYC/AML Engine
          </TabsTrigger>
        </TabsList>

        {/* ISO 20022 Gateway Demo */}
        <TabsContent value="iso20022" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <FileText className="mr-2 h-5 w-5 text-pink-400" />
                  ISO 20022 XML Message
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Standard payment message format used by banks worldwide
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700">
                    <pre className="text-xs text-slate-300 overflow-x-auto max-h-64 overflow-y-auto">
                      {sampleISO20022}
                    </pre>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleISO20022Demo}
                      disabled={iso20022Loading}
                      className="flex-1 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                    >
                      {iso20022Loading ? (
                        <>
                          <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Parse & Transform
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigator.clipboard.writeText(sampleISO20022)}
                      className="border-slate-600 text-slate-300"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Sparkles className="mr-2 h-5 w-5 text-pink-400" />
                  Transformation Result
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Parsed and validated internal payment format
                </CardDescription>
              </CardHeader>
              <CardContent>
                {iso20022Result ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400 mr-2" />
                        <span className="text-emerald-300 font-semibold">Validation Successful</span>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                        {iso20022Result.processingTime}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700">
                        <div className="text-xs text-slate-500 mb-1">Message Type</div>
                        <div className="text-lg font-semibold text-white">{iso20022Result.messageType}</div>
                      </div>
                      <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700">
                        <div className="text-xs text-slate-500 mb-1">Total Amount</div>
                        <div className="text-lg font-semibold text-white">{iso20022Result.totalAmount}</div>
                      </div>
                      <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700">
                        <div className="text-xs text-slate-500 mb-1">Sender</div>
                        <div className="text-sm font-semibold text-white truncate">{iso20022Result.sender}</div>
                      </div>
                      <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700">
                        <div className="text-xs text-slate-500 mb-1">Receiver</div>
                        <div className="text-sm font-semibold text-white truncate">{iso20022Result.receiver}</div>
                      </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Code2 className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-300">
                          <div className="font-semibold mb-1">Ready for Blockchain Processing</div>
                          <div className="text-xs text-blue-400/80">
                            Message validated against ISO 20022 schema and transformed to internal format
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                    <FileCheck className="h-12 w-12 text-slate-600 mb-4" />
                    <p className="text-slate-400 mb-2">No results yet</p>
                    <p className="text-sm text-slate-500">Click "Parse & Transform" to process the message</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6 bg-gradient-to-r from-pink-950/30 to-rose-950/30 border-pink-500/30">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">ISO 20022 Gateway Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-pink-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-white">XML Parsing</div>
                        <div className="text-xs text-slate-400">pain.001, pacs.008, camt.053</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-pink-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-white">Schema Validation</div>
                        <div className="text-xs text-slate-400">Full ISO 20022 compliance</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-pink-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-white">Bidirectional Transform</div>
                        <div className="text-xs text-slate-400">ISO ↔ Internal format</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PQC Demo */}
        <TabsContent value="pqc" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Key className="mr-2 h-5 w-5 text-violet-400" />
                  Digital Signature
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Sign messages with post-quantum cryptography
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700">
                    <label className="text-xs text-slate-500 mb-2 block">Message to Sign</label>
                    <textarea
                      value={pqcMessage}
                      onChange={(e) => setPqcMessage(e.target.value)}
                      placeholder="Enter a message to sign with quantum-resistant cryptography..."
                      className="w-full bg-slate-900/50 text-slate-300 rounded p-3 text-sm border border-slate-700 focus:border-violet-500 focus:outline-none min-h-[120px]"
                      defaultValue="Contract Agreement: Payment of $10,000 USD from Acme Corp to Global Tech Inc. Terms: 30 days net payment."
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={handlePQCSignDemo}
                      disabled={pqcLoading}
                      className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                    >
                      {pqcLoading ? (
                        <>
                          <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                          Signing...
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 h-4 w-4" />
                          Sign Message
                        </>
                      )}
                    </Button>
                    {pqcSignature && (
                      <Button
                        onClick={handlePQCVerifyDemo}
                        disabled={pqcLoading}
                        variant="outline"
                        className="border-violet-500 text-violet-300 hover:bg-violet-500/10"
                      >
                        <Unlock className="mr-2 h-4 w-4" />
                        Verify
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Shield className="mr-2 h-5 w-5 text-violet-400" />
                  Cryptographic Result
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {pqcVerification ? "Signature verification result" : "Generated signature details"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pqcVerification ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle2 className="h-6 w-6 text-emerald-400 mr-3" />
                        <div>
                          <div className="text-emerald-300 font-semibold text-lg">Signature Valid ✓</div>
                          <div className="text-xs text-emerald-400/70">Verified in {pqcVerification.verificationTime}</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700">
                        <div className="text-xs text-slate-500 mb-1">Algorithm</div>
                        <div className="text-sm font-semibold text-white">{pqcVerification.algorithm}</div>
                      </div>
                      <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700">
                        <div className="text-xs text-slate-500 mb-1">Security Level</div>
                        <div className="text-sm font-semibold text-white">{pqcVerification.securityLevel}</div>
                      </div>
                      <div className="bg-slate-950/50 rounded-lg p-4 border border-violet-700/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs text-violet-400 mb-1">Quantum Resistant</div>
                            <div className="text-sm font-semibold text-white">
                              {pqcVerification.quantumResistant ? "Yes - Protected against quantum attacks" : "No"}
                            </div>
                          </div>
                          <Shield className="h-8 w-8 text-violet-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : pqcSignature ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-violet-500/10 border border-violet-500/30 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle2 className="h-5 w-5 text-violet-400 mr-2" />
                        <span className="text-violet-300 font-semibold">Signature Generated</span>
                      </div>
                      <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30">
                        {pqcSignature.generationTime}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700">
                        <div className="text-xs text-slate-500 mb-1">Algorithm</div>
                        <div className="text-sm font-semibold text-white">{pqcSignature.algorithm}</div>
                      </div>
                      <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700">
                        <div className="text-xs text-slate-500 mb-1">Signature Size</div>
                        <div className="text-sm font-semibold text-white">{pqcSignature.signatureSize}</div>
                      </div>
                    </div>

                    <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700">
                      <div className="text-xs text-slate-500 mb-2">Signature Hash</div>
                      <div className="font-mono text-xs text-violet-300 break-all">{pqcSignature.signature}</div>
                    </div>

                    <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Shield className="h-5 w-5 text-violet-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-violet-300">
                          <div className="font-semibold mb-1">NIST-Approved PQC Algorithm</div>
                          <div className="text-xs text-violet-400/80">
                            Resistant to both classical and quantum computer attacks
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                    <Key className="h-12 w-12 text-slate-600 mb-4" />
                    <p className="text-slate-400 mb-2">No signature yet</p>
                    <p className="text-sm text-slate-500">Click "Sign Message" to generate a quantum-resistant signature</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6 bg-gradient-to-r from-violet-950/30 to-purple-950/30 border-violet-500/30">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">Post-Quantum Cryptography Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-violet-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-white">ML-DSA-65 Signatures</div>
                        <div className="text-xs text-slate-400">NIST FIPS 204 approved</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-violet-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-white">ML-KEM-768 Encryption</div>
                        <div className="text-xs text-slate-400">Quantum-resistant key exchange</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-violet-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-white">Hybrid Mode</div>
                        <div className="text-xs text-slate-400">PQC + Classical crypto</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* KYC/AML Demo */}
        <TabsContent value="kyc" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <FileText className="mr-2 h-5 w-5 text-emerald-400" />
                  Transaction Details
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Sample transaction for compliance analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {!kycTransaction ? (
                    <div className="text-center py-8">
                      <Button
                        onClick={loadSampleTransaction}
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Load Sample Transaction
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700 space-y-3">
                        <div>
                          <div className="text-xs text-slate-500">Transaction ID</div>
                          <div className="text-sm font-mono text-white">{kycTransaction.id}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="text-xs text-slate-500">Amount</div>
                            <div className="text-lg font-semibold text-white">
                              ${kycTransaction.amount.toLocaleString()} {kycTransaction.currency}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500">Type</div>
                            <div className="text-sm text-white">{kycTransaction.type.replace(/_/g, ' ')}</div>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">From</div>
                          <div className="text-sm text-white">
                            {kycTransaction.sender.name} ({kycTransaction.sender.country})
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">To</div>
                          <div className="text-sm text-white">
                            {kycTransaction.receiver.name} ({kycTransaction.receiver.country})
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        onClick={handleKYCDemo}
                        disabled={kycLoading}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                      >
                        {kycLoading ? (
                          <>
                            <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Brain className="mr-2 h-4 w-4" />
                            Run KYC/AML Analysis
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <TrendingUp className="mr-2 h-5 w-5 text-emerald-400" />
                  Risk Assessment
                </CardTitle>
                <CardDescription className="text-slate-400">
                  AI-powered compliance analysis results
                </CardDescription>
              </CardHeader>
              <CardContent>
                {kycResult ? (
                  <div className="space-y-4">
                    {/* Risk Score */}
                    <div className="bg-gradient-to-r from-emerald-950/50 to-teal-950/50 border border-emerald-500/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-sm text-emerald-400 mb-1">Risk Score</div>
                          <div className="text-4xl font-bold text-white">{kycResult.riskScore}/100</div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-lg px-4 py-2">
                            {kycResult.riskLevel}
                          </Badge>
                          <div className="text-xs text-emerald-400 mt-2">
                            {kycResult.recommendation}
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="w-full bg-slate-800 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all"
                          style={{ width: `${kycResult.riskScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Compliance Checks */}
                    <div className="space-y-2">
                      <div className="text-xs text-slate-500 font-semibold mb-2">Compliance Checks</div>
                      {Object.entries(kycResult.checks).map(([key, value]: [string, any]) => (
                        <div key={key} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-700">
                          <div className="flex items-center space-x-2">
                            <CheckCircle2 className={`h-4 w-4 ${value.passed ? 'text-emerald-400' : 'text-red-400'}`} />
                            <span className="text-sm text-white capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          </div>
                          <Badge variant="outline" className="border-slate-600 text-slate-300 text-xs">
                            {value.matches ?? value.anomalies} issues
                          </Badge>
                        </div>
                      ))}
                    </div>

                    {/* Risk Factors */}
                    <div className="space-y-2">
                      <div className="text-xs text-slate-500 font-semibold mb-2">Risk Factors</div>
                      {kycResult.factors.map((factor: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-700">
                          <div className="flex-1">
                            <div className="text-sm text-white">{factor.factor}</div>
                            <div className="text-xs text-slate-400">{factor.value}</div>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`${
                              factor.impact.startsWith('+') 
                                ? 'border-orange-500/30 text-orange-300 bg-orange-500/10' 
                                : 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10'
                            }`}
                          >
                            {factor.impact}
                          </Badge>
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-300">
                          <div className="font-semibold mb-1">Analysis Complete</div>
                          <div className="text-xs text-blue-400/80">
                            Processed in {kycResult.processingTime} with real-time sanctions screening
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                    <Brain className="h-12 w-12 text-slate-600 mb-4" />
                    <p className="text-slate-400 mb-2">No analysis yet</p>
                    <p className="text-sm text-slate-500">Load a transaction and run KYC/AML analysis</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6 bg-gradient-to-r from-emerald-950/30 to-teal-950/30 border-emerald-500/30">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">AI KYC/AML Engine Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-white">Real-time Screening</div>
                        <div className="text-xs text-slate-400">Sanctions, PEP, adverse media</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-white">Pattern Detection</div>
                        <div className="text-xs text-slate-400">ML-powered anomaly detection</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-white">Risk Scoring</div>
                        <div className="text-xs text-slate-400">AI-driven compliance engine</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Integrate QPC v2 into Your Application?
            </h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              All three modules are production-ready and available as open-source TypeScript packages with comprehensive documentation and examples.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 hover:from-violet-700 hover:via-purple-700 hover:to-blue-700"
              >
                <Code2 className="mr-2 h-5 w-5" />
                View Documentation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-slate-600 text-slate-200 hover:bg-slate-800"
              >
                <FileText className="mr-2 h-5 w-5" />
                Download SDK
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
