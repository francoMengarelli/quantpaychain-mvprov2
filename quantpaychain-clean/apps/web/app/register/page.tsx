"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Network, 
  Mail, 
  Lock, 
  User, 
  AlertCircle, 
  CheckCircle, 
  Shield, 
  Globe,
  FileText,
  ChevronRight,
  ChevronLeft,
  UserCheck
} from "lucide-react";
import { API_CONFIG } from "@/lib/api-config";

interface KYCResult {
  verification_id: string;
  status: string;
  risk_assessment: {
    score: number;
    level: string;
  };
}

const COUNTRIES = [
  { code: "CL", name: "Chile", flag: "🇨🇱" },
  { code: "MX", name: "México", flag: "🇲🇽" },
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "US", name: "Estados Unidos", flag: "🇺🇸" },
  { code: "ES", name: "España", flag: "🇪🇸" },
  { code: "CH", name: "Suiza", flag: "🇨🇭" },
  { code: "SG", name: "Singapur", flag: "🇸🇬" },
  { code: "BR", name: "Brasil", flag: "🇧🇷" },
  { code: "CO", name: "Colombia", flag: "🇨🇴" },
  { code: "PE", name: "Perú", flag: "🇵🇪" },
  { code: "GB", name: "Reino Unido", flag: "🇬🇧" },
  { code: "DE", name: "Alemania", flag: "🇩🇪" },
];

const DOCUMENT_TYPES = [
  { value: "passport", label: "Pasaporte" },
  { value: "national_id", label: "Documento Nacional de Identidad" },
  { value: "drivers_license", label: "Licencia de Conducir" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Account, 2: KYC, 3: Success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [kycResult, setKycResult] = useState<KYCResult | null>(null);
  
  // Account form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // KYC form
  const [countryCode, setCountryCode] = useState("CL");
  const [documentType, setDocumentType] = useState("passport");
  const [documentNumber, setDocumentNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    // Move to KYC step
    setStep(2);
  };

  const handleKYCSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // First, perform KYC verification
      const kycResponse = await fetch(`${API_CONFIG.baseURL}/api/kyc/verify-identity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          country_code: countryCode,
          document_type: documentType,
          document_number: documentNumber,
          date_of_birth: dateOfBirth,
        }),
      });

      const kycData = await kycResponse.json();
      setKycResult(kycData);

      // Check if KYC was rejected
      if (kycData.status === "REJECTED") {
        setError("La verificación KYC fue rechazada. Por favor contacta soporte.");
        return;
      }

      // Now create the Supabase account
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            kyc_verification_id: kycData.verification_id,
            kyc_status: kycData.status,
            country_code: countryCode,
          },
        },
      });

      if (signUpError) throw signUpError;

      // Success!
      setStep(3);
    } catch (err: any) {
      setError(err.message || "Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  const skipKYC = async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            kyc_status: "PENDING",
          },
        },
      });

      if (signUpError) throw signUpError;
      setStep(3);
    } catch (err: any) {
      setError(err.message || "Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Success
  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass-effect border-green-500/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-green-500/20">
                  <CheckCircle className="h-16 w-16 text-green-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white">¡Cuenta Creada!</h2>
              
              {kycResult && (
                <div className="bg-slate-800/50 rounded-lg p-4 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-purple-400" />
                    <span className="text-white font-semibold">Verificación KYC</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-400">Estado:</span>
                      <Badge className={
                        kycResult.status === "APPROVED" ? "bg-green-500/20 text-green-400 ml-2" :
                        kycResult.status === "PENDING_REVIEW" ? "bg-yellow-500/20 text-yellow-400 ml-2" :
                        "bg-blue-500/20 text-blue-400 ml-2"
                      }>
                        {kycResult.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-gray-400">Riesgo:</span>
                      <span className="text-white ml-2">{kycResult.risk_assessment.level}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    ID: {kycResult.verification_id}
                  </p>
                </div>
              )}

              <p className="text-gray-400">
                Te hemos enviado un email de confirmación a <strong className="text-white">{email}</strong>
              </p>
              <p className="text-sm text-gray-500">
                Por favor revisa tu bandeja de entrada y haz click en el enlace para verificar tu cuenta.
              </p>
              <Link href="/login">
                <Button className="qpc-gradient text-white w-full mt-4">
                  Ir a Iniciar Sesión
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg glass-effect border-purple-500/20">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Network className="h-12 w-12 text-purple-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            {step === 1 ? "Crear Cuenta" : "Verificación KYC"}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {step === 1 
              ? "Regístrate para comenzar a tokenizar activos" 
              : "Completa la verificación de identidad"}
          </CardDescription>
          
          {/* Progress indicator */}
          <div className="flex justify-center gap-2 pt-4">
            <div className={`h-2 w-16 rounded-full ${step >= 1 ? 'bg-purple-500' : 'bg-gray-700'}`} />
            <div className={`h-2 w-16 rounded-full ${step >= 2 ? 'bg-purple-500' : 'bg-gray-700'}`} />
          </div>
          <div className="flex justify-between px-4 text-xs text-gray-500">
            <span>Cuenta</span>
            <span>KYC</span>
          </div>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-2 mb-4">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Step 1: Account Information */}
          {step === 1 && (
            <form onSubmit={handleAccountSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">
                  Nombre Completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Juan Pérez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="pl-10 bg-slate-900/50 border-purple-500/20 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-slate-900/50 border-purple-500/20 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 bg-slate-900/50 border-purple-500/20 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300">
                  Confirmar Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pl-10 bg-slate-900/50 border-purple-500/20 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full qpc-gradient text-white">
                Continuar a Verificación KYC
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </form>
          )}

          {/* Step 2: KYC Verification */}
          {step === 2 && (
            <form onSubmit={handleKYCSubmit} className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-400" />
                  <span className="text-blue-400 font-medium">Verificación de Identidad</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Requerido para cumplir con regulaciones KYC/AML internacionales
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300 flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    País
                  </Label>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-900/50 border border-purple-500/20 text-white"
                  >
                    {COUNTRIES.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300 flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    Tipo de Documento
                  </Label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-900/50 border border-purple-500/20 text-white"
                  >
                    {DOCUMENT_TYPES.map((doc) => (
                      <option key={doc.value} value={doc.value}>
                        {doc.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Número de Documento</Label>
                  <Input
                    type="text"
                    placeholder="AB123456"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    required
                    className="bg-slate-900/50 border-purple-500/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Fecha de Nacimiento</Label>
                  <Input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                    className="bg-slate-900/50 border-purple-500/20 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep(1)}
                  className="flex-1 border-purple-500/20 text-gray-300"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Atrás
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 qpc-gradient text-white"
                  disabled={loading}
                >
                  {loading ? "Verificando..." : "Verificar y Crear Cuenta"}
                  <UserCheck className="h-4 w-4 ml-2" />
                </Button>
              </div>

              <button
                type="button"
                onClick={skipKYC}
                disabled={loading}
                className="w-full text-sm text-gray-500 hover:text-gray-400 mt-2"
              >
                Omitir verificación por ahora (funcionalidad limitada)
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-gray-400">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-purple-400 hover:text-purple-300">
              Inicia sesión aquí
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-gray-400 hover:text-white">
              ← Volver al inicio
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
