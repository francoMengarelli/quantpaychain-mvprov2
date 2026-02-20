"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Key, 
  FileSignature, 
  CheckCircle, 
  XCircle, 
  Copy, 
  Download,
  Lock,
  Unlock,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import { API_CONFIG } from "@/lib/api-config";

interface KeyPair {
  key_id: string;
  algorithm: string;
  public_key: string;
  secret_key: string;
  metadata: {
    public_key_size: number;
    secret_key_size: number;
    security_level: number;
    generated_at: string;
  };
}

interface SignatureResult {
  signature: string;
  message_hash: string;
  binding_hash: string;
  algorithm: string;
  metadata: {
    signature_size: number;
    signed_at: string;
  };
}

interface VerifyResult {
  is_valid: boolean;
  algorithm: string;
  message_hash: string;
  binding_verified: boolean;
  verified_at: string;
}

export function PQCSecurityPanel() {
  const [loading, setLoading] = useState(false);
  const [keyPair, setKeyPair] = useState<KeyPair | null>(null);
  const [algorithm, setAlgorithm] = useState("ML-DSA-65");
  const [messageToSign, setMessageToSign] = useState("");
  const [signatureResult, setSignatureResult] = useState<SignatureResult | null>(null);
  const [verifyMessage, setVerifyMessage] = useState("");
  const [verifySignature, setVerifySignature] = useState("");
  const [verifyPublicKey, setVerifyPublicKey] = useState("");
  const [verifyBindingHash, setVerifyBindingHash] = useState("");
  const [verifyResult, setVerifyResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState("");

  const algorithms = [
    { value: "ML-DSA-44", label: "ML-DSA-44 (Level 2)", level: 2 },
    { value: "ML-DSA-65", label: "ML-DSA-65 (Level 3) - Recomendado", level: 3 },
    { value: "ML-DSA-87", label: "ML-DSA-87 (Level 5)", level: 5 },
    { value: "Falcon-512", label: "Falcon-512 (Compacto)", level: 1 },
    { value: "Falcon-1024", label: "Falcon-1024 (Alta Seguridad)", level: 5 },
  ];

  const generateKeyPair = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_CONFIG.baseURL}/api/pqc/generate-signature-keypair`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ algorithm }),
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data || !data.public_key) {
        throw new Error("Respuesta inválida del servidor");
      }
      
      setKeyPair(data);
    } catch (err: any) {
      console.error("PQC Generate Error:", err);
      setError(err.message?.includes("404") 
        ? "Servicio PQC no disponible. El backend necesita ser actualizado." 
        : "Error generando llaves. Verifica la conexión al servidor.");
    } finally {
      setLoading(false);
    }
  };

  const signMessage = async () => {
    if (!keyPair || !messageToSign) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_CONFIG.baseURL}/api/pqc/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageToSign,
          secret_key: keyPair.secret_key,
          algorithm: keyPair.algorithm,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      setSignatureResult(data);
    } catch (err: any) {
      console.error("PQC Sign Error:", err);
      setError("Error firmando mensaje. Verifica la conexión al servidor.");
    } finally {
      setLoading(false);
    }
  };

  const verifySignatureHandler = async () => {
    if (!verifyMessage || !verifySignature || !verifyPublicKey) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_CONFIG.baseURL}/api/pqc/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: verifyMessage,
          signature: verifySignature,
          public_key: verifyPublicKey,
          algorithm,
          binding_hash: verifyBindingHash || undefined,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      setVerifyResult(data);
    } catch (err: any) {
      console.error("PQC Verify Error:", err);
      setError("Error verificando firma. Verifica la conexión al servidor.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadKeyPair = () => {
    if (!keyPair) return;
    const data = {
      key_id: keyPair.key_id,
      algorithm: keyPair.algorithm,
      public_key: keyPair.public_key,
      secret_key: keyPair.secret_key,
      generated_at: keyPair.metadata.generated_at,
      warning: "NUNCA compartas tu secret_key. Guárdala de forma segura.",
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qpc-keypair-${keyPair.key_id}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-purple-500/20">
          <Shield className="h-8 w-8 text-purple-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Seguridad Post-Cuántica</h2>
          <p className="text-gray-400">Criptografía resistente a computadoras cuánticas (NIST FIPS 204)</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-slate-900/50">
          <TabsTrigger value="generate" className="data-[state=active]:bg-purple-500/20">
            <Key className="h-4 w-4 mr-2" />
            Generar Llaves
          </TabsTrigger>
          <TabsTrigger value="sign" className="data-[state=active]:bg-purple-500/20">
            <FileSignature className="h-4 w-4 mr-2" />
            Firmar
          </TabsTrigger>
          <TabsTrigger value="verify" className="data-[state=active]:bg-purple-500/20">
            <CheckCircle className="h-4 w-4 mr-2" />
            Verificar
          </TabsTrigger>
        </TabsList>

        {/* Generate Keys Tab */}
        <TabsContent value="generate">
          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Key className="h-5 w-5 text-purple-400" />
                Generar Par de Llaves PQC
              </CardTitle>
              <CardDescription>
                Genera un par de llaves criptográficas post-cuánticas para firmar documentos y tokenizaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Algoritmo</Label>
                <select
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-800 border border-purple-500/20 text-white"
                >
                  {algorithms.map((algo) => (
                    <option key={algo.value} value={algo.value}>
                      {algo.label}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                onClick={generateKeyPair}
                disabled={loading}
                className="w-full qpc-gradient text-white"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Key className="h-4 w-4 mr-2" />
                )}
                Generar Llaves Post-Cuánticas
              </Button>

              {keyPair && (
                <div className="mt-4 space-y-4">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-green-400 font-semibold">Llaves Generadas</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Key ID:</span>
                        <p className="text-white font-mono">{keyPair.key_id}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Algoritmo:</span>
                        <p className="text-white">{keyPair.algorithm}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Nivel de Seguridad:</span>
                        <Badge className="bg-purple-500/20 text-purple-300">
                          NIST Level {keyPair.metadata.security_level}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-gray-400">Tamaño Firma:</span>
                        <p className="text-white">{keyPair.metadata.secret_key_size} bytes</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300 flex items-center gap-2">
                      <Unlock className="h-4 w-4" />
                      Llave Pública (compartible)
                    </Label>
                    <div className="relative">
                      <Input
                        value={keyPair.public_key.substring(0, 60) + "..."}
                        readOnly
                        className="bg-slate-800 border-purple-500/20 text-white font-mono text-xs pr-10"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute right-1 top-1 h-7 w-7 p-0"
                        onClick={() => copyToClipboard(keyPair.public_key, "Llave pública")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300 flex items-center gap-2">
                      <Lock className="h-4 w-4 text-red-400" />
                      Llave Secreta (NO compartir)
                    </Label>
                    <div className="relative">
                      <Input
                        value="••••••••••••••••••••••••••••••••"
                        readOnly
                        className="bg-slate-800 border-red-500/20 text-white font-mono text-xs pr-10"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute right-1 top-1 h-7 w-7 p-0 text-red-400"
                        onClick={() => copyToClipboard(keyPair.secret_key, "Llave secreta")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-red-400">
                      Guarda esta llave de forma segura. Nunca la compartas.
                    </p>
                  </div>

                  <Button
                    onClick={downloadKeyPair}
                    variant="outline"
                    className="w-full border-purple-500/20 text-purple-300"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar Par de Llaves (JSON)
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sign Tab */}
        <TabsContent value="sign">
          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileSignature className="h-5 w-5 text-purple-400" />
                Firmar Mensaje
              </CardTitle>
              <CardDescription>
                Firma un mensaje o documento con tu llave secreta post-cuántica
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!keyPair ? (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center">
                  <AlertTriangle className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-yellow-400">Primero genera un par de llaves en la pestaña anterior</p>
                </div>
              ) : (
                <>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-sm text-gray-400">Usando llave:</p>
                    <p className="text-white font-mono">{keyPair.key_id}</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Mensaje a Firmar</Label>
                    <textarea
                      value={messageToSign}
                      onChange={(e) => setMessageToSign(e.target.value)}
                      placeholder="Ingresa el mensaje o datos a firmar..."
                      className="w-full h-32 p-3 rounded-lg bg-slate-800 border border-purple-500/20 text-white resize-none"
                    />
                  </div>

                  <Button
                    onClick={signMessage}
                    disabled={loading || !messageToSign}
                    className="w-full qpc-gradient text-white"
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <FileSignature className="h-4 w-4 mr-2" />
                    )}
                    Firmar con PQC
                  </Button>

                  {signatureResult && (
                    <div className="mt-4 space-y-3">
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                          <span className="text-green-400 font-semibold">Mensaje Firmado</span>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-400">Hash del Mensaje:</span>
                            <p className="text-white font-mono text-xs break-all">{signatureResult.message_hash}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Binding Hash:</span>
                            <p className="text-white font-mono text-xs break-all">{signatureResult.binding_hash}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Tamaño de Firma:</span>
                            <p className="text-white">{signatureResult.metadata.signature_size} bytes</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-300">Firma Digital (Base64)</Label>
                        <div className="relative">
                          <textarea
                            value={signatureResult.signature}
                            readOnly
                            className="w-full h-24 p-3 rounded-lg bg-slate-800 border border-purple-500/20 text-white font-mono text-xs resize-none"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute right-2 top-2"
                            onClick={() => copyToClipboard(signatureResult.signature, "Firma")}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Verify Tab */}
        <TabsContent value="verify">
          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-purple-400" />
                Verificar Firma
              </CardTitle>
              <CardDescription>
                Verifica la autenticidad de una firma post-cuántica
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Mensaje Original</Label>
                <textarea
                  value={verifyMessage}
                  onChange={(e) => setVerifyMessage(e.target.value)}
                  placeholder="Ingresa el mensaje original..."
                  className="w-full h-24 p-3 rounded-lg bg-slate-800 border border-purple-500/20 text-white resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Firma (Base64)</Label>
                <textarea
                  value={verifySignature}
                  onChange={(e) => setVerifySignature(e.target.value)}
                  placeholder="Pega la firma a verificar..."
                  className="w-full h-20 p-3 rounded-lg bg-slate-800 border border-purple-500/20 text-white font-mono text-xs resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Llave Pública del Firmante</Label>
                <textarea
                  value={verifyPublicKey}
                  onChange={(e) => setVerifyPublicKey(e.target.value)}
                  placeholder="Pega la llave pública..."
                  className="w-full h-20 p-3 rounded-lg bg-slate-800 border border-purple-500/20 text-white font-mono text-xs resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Binding Hash (opcional pero recomendado)</Label>
                <Input
                  value={verifyBindingHash}
                  onChange={(e) => setVerifyBindingHash(e.target.value)}
                  placeholder="Hash de binding para verificación segura"
                  className="bg-slate-800 border-purple-500/20 text-white font-mono text-xs"
                />
              </div>

              <Button
                onClick={verifySignatureHandler}
                disabled={loading || !verifyMessage || !verifySignature || !verifyPublicKey}
                className="w-full qpc-gradient text-white"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Verificar Firma
              </Button>

              {verifyResult && (
                <div className={`mt-4 rounded-lg p-4 ${
                  verifyResult.is_valid 
                    ? "bg-green-500/10 border border-green-500/20" 
                    : "bg-red-500/10 border border-red-500/20"
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    {verifyResult.is_valid ? (
                      <>
                        <CheckCircle className="h-6 w-6 text-green-400" />
                        <span className="text-green-400 font-bold text-lg">FIRMA VÁLIDA</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-6 w-6 text-red-400" />
                        <span className="text-red-400 font-bold text-lg">FIRMA INVÁLIDA</span>
                      </>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Algoritmo:</span>
                      <p className="text-white">{verifyResult.algorithm}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Binding Verificado:</span>
                      <p className={verifyResult.binding_verified ? "text-green-400" : "text-yellow-400"}>
                        {verifyResult.binding_verified ? "Sí" : "No proporcionado"}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-400">Hash del Mensaje:</span>
                      <p className="text-white font-mono text-xs break-all">{verifyResult.message_hash}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
