"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  UserCheck, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Globe,
  FileText,
  Shield,
  RefreshCw,
  Clock,
  Flag
} from "lucide-react";
import { API_CONFIG } from "@/lib/api-config";

interface KYCVerificationResult {
  verification_id: string;
  status: "APPROVED" | "PENDING_REVIEW" | "PENDING_DOCUMENTS" | "REJECTED";
  status_reason: string;
  subject: {
    name: string;
    country: string;
    document_type: string;
  };
  checks: {
    sanctions: {
      passed: boolean;
      details: any;
    };
    document: {
      passed: boolean;
      details: any;
    };
    country_risk: {
      level: string;
      is_high_risk: boolean;
    };
  };
  risk_assessment: {
    score: number;
    level: string;
    factors: Array<{ factor: string; severity: string; description: string }>;
  };
  next_steps: string[];
  verified_at: string;
  valid_until: string | null;
}

interface KYCFormData {
  name: string;
  country_code: string;
  document_type: string;
  document_number: string;
  date_of_birth: string;
}

interface KYCVerificationFormProps {
  onVerificationComplete?: (result: KYCVerificationResult) => void;
  showFullForm?: boolean;
}

const COUNTRIES = [
  { code: "CL", name: "Chile", flag: "🇨🇱" },
  { code: "MX", name: "México", flag: "🇲🇽" },
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "US", name: "Estados Unidos", flag: "🇺🇸" },
  { code: "ES", name: "España", flag: "🇪🇸" },
  { code: "CH", name: "Suiza", flag: "🇨🇭" },
  { code: "SG", name: "Singapur", flag: "🇸🇬" },
  { code: "AE", name: "Emiratos Árabes", flag: "🇦🇪" },
  { code: "BR", name: "Brasil", flag: "🇧🇷" },
  { code: "CO", name: "Colombia", flag: "🇨🇴" },
  { code: "PE", name: "Perú", flag: "🇵🇪" },
  { code: "GB", name: "Reino Unido", flag: "🇬🇧" },
  { code: "DE", name: "Alemania", flag: "🇩🇪" },
  { code: "FR", name: "Francia", flag: "🇫🇷" },
];

const DOCUMENT_TYPES = [
  { value: "passport", label: "Pasaporte" },
  { value: "national_id", label: "Documento Nacional de Identidad" },
  { value: "drivers_license", label: "Licencia de Conducir" },
];

export function KYCVerificationForm({ onVerificationComplete, showFullForm = true }: KYCVerificationFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<KYCVerificationResult | null>(null);
  const [formData, setFormData] = useState<KYCFormData>({
    name: "",
    country_code: "CL",
    document_type: "passport",
    document_number: "",
    date_of_birth: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${API_CONFIG.baseURL}/api/kyc/verify-identity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error en la verificación");
      }

      const data: KYCVerificationResult = await response.json();
      setResult(data);
      
      if (onVerificationComplete) {
        onVerificationComplete(data);
      }
    } catch (err) {
      setError("Error al verificar identidad. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "PENDING_REVIEW": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "PENDING_DOCUMENTS": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "REJECTED": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED": return <CheckCircle className="h-6 w-6" />;
      case "PENDING_REVIEW": return <Clock className="h-6 w-6" />;
      case "PENDING_DOCUMENTS": return <FileText className="h-6 w-6" />;
      case "REJECTED": return <XCircle className="h-6 w-6" />;
      default: return <AlertTriangle className="h-6 w-6" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "LOW": return "bg-green-500/20 text-green-400";
      case "MEDIUM": return "bg-yellow-500/20 text-yellow-400";
      case "HIGH": return "bg-orange-500/20 text-orange-400";
      case "CRITICAL": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-blue-500/20">
          <UserCheck className="h-8 w-8 text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Verificación KYC/AML</h2>
          <p className="text-gray-400">Verificación de identidad y cumplimiento regulatorio</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {!result ? (
        <Card className="bg-slate-900/50 border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-400" />
              Verificar Identidad
            </CardTitle>
            <CardDescription>
              Completa el formulario para verificar tu identidad según regulaciones KYC/AML
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Nombre Completo</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Como aparece en tu documento"
                  required
                  className="bg-slate-800 border-blue-500/20 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">País de Residencia</Label>
                  <select
                    value={formData.country_code}
                    onChange={(e) => setFormData({ ...formData, country_code: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-800 border border-blue-500/20 text-white"
                  >
                    {COUNTRIES.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Tipo de Documento</Label>
                  <select
                    value={formData.document_type}
                    onChange={(e) => setFormData({ ...formData, document_type: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-800 border border-blue-500/20 text-white"
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
                    value={formData.document_number}
                    onChange={(e) => setFormData({ ...formData, document_number: e.target.value })}
                    placeholder="Ej: AB123456"
                    required
                    className="bg-slate-800 border-blue-500/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Fecha de Nacimiento</Label>
                  <Input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    required
                    className="bg-slate-800 border-blue-500/20 text-white"
                  />
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-3 text-sm text-gray-400">
                <p className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-400" />
                  Tu información será verificada contra listas de sanciones internacionales (OFAC, EU, UN)
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Verificar Identidad
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Status Card */}
          <Card className={`border ${getStatusColor(result.status)}`}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${getStatusColor(result.status)}`}>
                  {getStatusIcon(result.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">
                      {result.status === "APPROVED" && "Verificación Aprobada"}
                      {result.status === "PENDING_REVIEW" && "En Revisión"}
                      {result.status === "PENDING_DOCUMENTS" && "Documentos Pendientes"}
                      {result.status === "REJECTED" && "Verificación Rechazada"}
                    </h3>
                    <Badge className={getStatusColor(result.status)}>
                      {result.status}
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{result.status_reason}</p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-gray-400">ID de Verificación:</p>
                <p className="text-white font-mono">{result.verification_id}</p>
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Flag className="h-5 w-5 text-purple-400" />
                Evaluación de Riesgo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                  <p className="text-3xl font-bold text-white">{result.risk_assessment.score}</p>
                  <p className="text-sm text-gray-400">Risk Score</p>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                  <Badge className={`text-lg ${getRiskColor(result.risk_assessment.level)}`}>
                    {result.risk_assessment.level}
                  </Badge>
                  <p className="text-sm text-gray-400 mt-2">Nivel de Riesgo</p>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                  <p className="text-3xl font-bold text-white">
                    {result.checks.sanctions.passed ? "✓" : "✗"}
                  </p>
                  <p className="text-sm text-gray-400">Sanciones</p>
                </div>
              </div>

              {result.risk_assessment.factors.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-2">Factores de Riesgo:</p>
                  <div className="space-y-2">
                    {result.risk_assessment.factors.map((factor, idx) => (
                      <div 
                        key={idx}
                        className={`p-2 rounded-lg ${
                          factor.severity === "CRITICAL" ? "bg-red-500/10 border border-red-500/20" :
                          factor.severity === "HIGH" ? "bg-orange-500/10 border border-orange-500/20" :
                          "bg-yellow-500/10 border border-yellow-500/20"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Badge className={
                            factor.severity === "CRITICAL" ? "bg-red-500/20 text-red-400" :
                            factor.severity === "HIGH" ? "bg-orange-500/20 text-orange-400" :
                            "bg-yellow-500/20 text-yellow-400"
                          }>
                            {factor.severity}
                          </Badge>
                          <span className="text-white text-sm">{factor.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-slate-900/50 border-green-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                Próximos Pasos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.next_steps.map((step, idx) => (
                  <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    {step}
                  </li>
                ))}
              </ul>
              
              {result.valid_until && (
                <div className="mt-4 p-3 bg-green-500/10 rounded-lg">
                  <p className="text-sm text-gray-400">Válido hasta:</p>
                  <p className="text-green-400">{new Date(result.valid_until).toLocaleDateString()}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Button
            onClick={() => setResult(null)}
            variant="outline"
            className="w-full border-blue-500/20 text-blue-300"
          >
            Nueva Verificación
          </Button>
        </div>
      )}
    </div>
  );
}
