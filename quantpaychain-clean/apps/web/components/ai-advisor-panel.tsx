"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle2, AlertTriangle, Lightbulb, FileText, Shield, TrendingUp, Clock, DollarSign, Scale, ChevronRight, Info } from "lucide-react";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://quantpaychain-api.onrender.com';

interface AIAdvisorPanelProps {
  assetType: string;
  description: string;
  valueUsd: string;
  location: string;
}

export function AIAdvisorPanel({ assetType, description, valueUsd, location }: AIAdvisorPanelProps) {
  const [advice, setAdvice] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const getAIAdvice = async () => {
    if (!assetType || !description || !valueUsd || !location) {
      toast.error("Completa todos los campos para obtener el análisis");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('🤖 Solicitando análisis AI...');
      
      const response = await fetch(`${API_BASE_URL}/api/ai/advisor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          asset_type: assetType,
          description: description,
          value_usd: parseFloat(valueUsd),
          location: location,
          user_context: null
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Error desconocido' }));
        throw new Error(errorData.detail || `Error ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Análisis recibido:', data);
      
      setAdvice(data);
      setCurrentStep(0);
      toast.success("Análisis completado! 🎉");
    } catch (error: any) {
      console.error('❌ Error:', error);
      setError(error.message || "Error al obtener análisis");
      toast.error("No se pudo obtener el análisis");
    } finally {
      setLoading(false);
    }
  };

  // Render análisis en pasos
  const renderStepByStep = () => {
    if (!advice) return null;

    const steps = [
      {
        title: "📊 Resumen Ejecutivo",
        icon: TrendingUp,
        color: "from-blue-500 to-cyan-500",
        content: renderExecutiveSummary()
      },
      {
        title: "⚖️ Análisis Legal",
        icon: Scale,
        color: "from-purple-500 to-pink-500",
        content: renderLegalAnalysis()
      },
      {
        title: "🛡️ Cumplimiento y Riesgos",
        icon: Shield,
        color: "from-emerald-500 to-green-500",
        content: renderCompliance()
      },
      {
        title: "📋 Próximos Pasos",
        icon: FileText,
        color: "from-orange-500 to-red-500",
        content: renderNextSteps()
      }
    ];

    return (
      <div className="space-y-6">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <button
                onClick={() => setCurrentStep(index)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  currentStep === index
                    ? 'bg-gradient-to-r ' + step.color + ' text-white scale-110'
                    : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                }`}
              >
                {index + 1}
              </button>
              {index < steps.length - 1 && (
                <div className={`w-12 h-1 ${
                  currentStep > index ? 'bg-gradient-to-r ' + step.color : 'bg-slate-800'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Current Step */}
        <div className="min-h-[400px]">
          <div className="flex items-center gap-3 mb-6">
            {(() => {
              const StepIcon = steps[currentStep].icon;
              return <StepIcon className="h-8 w-8 text-purple-400" />;
            })()}
            <h3 className="text-2xl font-bold text-white">
              {steps[currentStep].title}
            </h3>
          </div>
          
          {steps[currentStep].content}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-800">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
          >
            Anterior
          </Button>
          
          <span className="text-gray-400 text-sm">
            Paso {currentStep + 1} de {steps.length}
          </span>
          
          {currentStep < steps.length - 1 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="qpc-gradient text-white"
            >
              Siguiente
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={() => toast.success("¡Listo para continuar con la tokenización!")}
              className="qpc-gradient text-white"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Continuar
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderExecutiveSummary = () => {
    const summary = advice.executive_summary || {};
    const viabilityScore = parseInt(summary.viability_score) || 70;
    
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Viability Score */}
        <div className="glass-effect rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Score de Viabilidad</h4>
              <p className="text-gray-400 text-sm">Evaluación general para tokenización</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold qpc-gradient-text">{viabilityScore}/10</div>
              <Badge className={`mt-2 ${
                viabilityScore >= 8 ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                viabilityScore >= 6 ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                'bg-red-500/20 text-red-300 border-red-500/30'
              }`}>
                {viabilityScore >= 8 ? 'Excelente' : viabilityScore >= 6 ? 'Viable' : 'Revisar'}
              </Badge>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000 ease-out"
              style={{ width: `${viabilityScore * 10}%` }}
            />
          </div>
        </div>

        {/* Key Insights */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="glass-effect rounded-lg p-5 border border-blue-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <FileText className="h-5 w-5 text-blue-400" />
              </div>
              <h5 className="font-semibold text-white">Clasificación</h5>
            </div>
            <p className="text-gray-300 text-sm">
              {summary.primary_legal_classification || 'Security Token - Requiere registro'}
            </p>
          </div>

          <div className="glass-effect rounded-lg p-5 border border-emerald-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <DollarSign className="h-5 w-5 text-emerald-400" />
              </div>
              <h5 className="font-semibold text-white">Costos Estimados</h5>
            </div>
            <p className="text-gray-300 text-sm">
              {summary.estimated_legal_costs || '$15,000 - $50,000 USD'}
            </p>
          </div>
        </div>

        {/* Main Insight */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h5 className="font-semibold text-white mb-2">Insight Clave</h5>
              <p className="text-gray-200">
                {summary.key_insight || 'Análisis completo disponible en las siguientes secciones'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLegalAnalysis = () => {
    const legal = advice.legal_analysis || {};
    const securities = legal.securities_classification || {};
    const jurisdiction = legal.jurisdictional_requirements || {};
    
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Securities Classification */}
        <div className="glass-effect rounded-xl p-6 border border-purple-500/20">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Scale className="h-5 w-5 text-purple-400" />
            Clasificación de Securities
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-gray-400 mb-1">¿Es un Security Token?</p>
                <p className="text-white font-medium">{securities.is_security || 'Requiere análisis Howey Test'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-gray-400 mb-1">Framework Aplicable</p>
                <p className="text-white font-medium">{securities.applicable_framework || 'Securities Act 1933, MiCA (EU)'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Exemptions */}
        {securities.exemptions_available && Array.isArray(securities.exemptions_available) && (
          <div className="glass-effect rounded-lg p-5 border border-green-500/20">
            <h5 className="font-semibold text-white mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              Exenciones Disponibles
            </h5>
            <div className="flex flex-wrap gap-2">
              {securities.exemptions_available.map((exemption: string, idx: number) => (
                <Badge key={idx} className="bg-green-500/20 text-green-300 border-green-500/30">
                  {exemption}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Jurisdictional Requirements */}
        {jurisdiction.applicable_laws && Array.isArray(jurisdiction.applicable_laws) && (
          <div className="glass-effect rounded-lg p-5 border border-blue-500/20">
            <h5 className="font-semibold text-white mb-3">Leyes Aplicables en {jurisdiction.primary_jurisdiction || location}</h5>
            <ul className="space-y-2">
              {jurisdiction.applicable_laws.slice(0, 4).map((law: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                  <ChevronRight className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span>{law}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderCompliance = () => {
    const compliance = advice.legal_analysis?.compliance_roadmap || {};
    const risks = advice.risk_mitigation || {};
    const kyc = advice.kyc_aml_requirements || {};
    
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Compliance Roadmap */}
        <div className="glass-effect rounded-xl p-6 border border-emerald-500/20">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            Roadmap de Cumplimiento
          </h4>
          
          <div className="space-y-4">
            {/* Phase 1 */}
            {compliance.phase_1_immediate && Array.isArray(compliance.phase_1_immediate) && (
              <div className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/20">
                <h5 className="font-semibold text-blue-300 mb-2 text-sm">📍 Fase 1: Inmediato</h5>
                <ul className="space-y-1">
                  {compliance.phase_1_immediate.slice(0, 3).map((item: string, idx: number) => (
                    <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Phase 2 */}
            {compliance.phase_2_structuring && Array.isArray(compliance.phase_2_structuring) && (
              <div className="bg-purple-500/5 rounded-lg p-4 border border-purple-500/20">
                <h5 className="font-semibold text-purple-300 mb-2 text-sm">🏗️ Fase 2: Estructuración</h5>
                <ul className="space-y-1">
                  {compliance.phase_2_structuring.slice(0, 3).map((item: string, idx: number) => (
                    <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Risk Mitigation */}
        {risks.legal_risks && Array.isArray(risks.legal_risks) && risks.legal_risks.length > 0 && (
          <div className="glass-effect rounded-lg p-5 border border-yellow-500/20">
            <h5 className="font-semibold text-white mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              Riesgos a Mitigar
            </h5>
            <div className="space-y-3">
              {risks.legal_risks.slice(0, 2).map((risk: any, idx: number) => (
                <div key={idx} className="bg-yellow-500/5 rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-yellow-200 text-sm">{risk.risk}</span>
                    <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs">
                      {risk.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400">{risk.mitigation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* KYC Requirements */}
        <div className="glass-effect rounded-lg p-5 border border-cyan-500/20">
          <h5 className="font-semibold text-white mb-3">Requisitos KYC/AML</h5>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Nivel de Verificación:</span>
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                {kyc.investor_verification_level || 'Enhanced'}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Monitoreo:</span>
              <span className="text-sm text-white">{kyc.ongoing_monitoring || 'Continuo'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderNextSteps = () => {
    const timeline = advice.timeline_estimate || {};
    const advisors = advice.recommended_advisors || {};
    const insights = advice.ai_legal_insights || {};
    
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Timeline */}
        <div className="glass-effect rounded-xl p-6 border border-purple-500/20">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-400" />
            Timeline Estimado
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-400">Timeline Realista</p>
                <p className="text-white font-medium">{timeline.realistic_timeline || '6-9 meses'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <div className="flex-1">
                <p className="text-sm text-gray-400">Timeline Mínimo</p>
                <p className="text-white font-medium">{timeline.minimum_timeline || '3-4 meses'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Advisors */}
        <div className="glass-effect rounded-lg p-5 border border-blue-500/20">
          <h5 className="font-semibold text-white mb-3">Asesores Recomendados</h5>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-white">Legal Counsel</p>
                <p className="text-xs text-gray-400">{advisors.legal_counsel || 'Securities attorney especializado en tokenization'}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-white">Tax Advisor</p>
                <p className="text-xs text-gray-400">{advisors.tax_advisor || 'CPA con experiencia en digital assets'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Strategic Recommendation */}
        {insights.strategic_recommendation && (
          <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-xl p-6 border border-emerald-500/30">
            <div className="flex items-start gap-3">
              <Sparkles className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-1" />
              <div>
                <h5 className="font-semibold text-white mb-2">Recomendación Estratégica</h5>
                <p className="text-gray-200">{insights.strategic_recommendation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center pt-4">
          <p className="text-gray-400 mb-4">¿Listo para comenzar la tokenización?</p>
          <Button className="qpc-gradient text-white px-8">
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Proceder con la Tokenización
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card className="glass-effect border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-white text-xl">AI Legal Advisor</CardTitle>
              <p className="text-sm text-gray-400 mt-1">
                Análisis legal profesional paso a paso
              </p>
            </div>
          </div>
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
            Powered by AI
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-200">
              <p className="font-semibold">Error</p>
              <p className="text-xs mt-1">{error}</p>
            </div>
          </div>
        )}
        
        {!advice ? (
          <div className="text-center py-8">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Obtén tu Análisis Legal Profesional
              </h3>
              <p className="text-gray-400 text-sm max-w-md mx-auto">
                Nuestro AI analizará tu activo y te proporcionará una guía completa para la tokenización,
                incluyendo requisitos legales, riesgos y próximos pasos.
              </p>
            </div>
            
            <Button
              onClick={getAIAdvice}
              disabled={loading}
              className="qpc-gradient text-white px-8 py-6 text-lg"
            >
              {loading ? (
                <>
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Analizando...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Obtener Análisis Legal AI
                </>
              )}
            </Button>
          </div>
        ) : (
          renderStepByStep()
        )}
      </CardContent>
    </Card>
  );
}
