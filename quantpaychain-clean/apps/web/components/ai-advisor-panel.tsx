"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle2, TrendingUp, Shield, Lightbulb, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AIAdvisorPanelProps {
  assetType: string;
  description: string;
  valueUsd: string;
  location: string;
}

export function AIAdvisorPanel({ assetType, description, valueUsd, location }: AIAdvisorPanelProps) {
  const [advice, setAdvice] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const getAIAdvice = async () => {
    if (!assetType || !description || !valueUsd || !location) {
      toast.error("Completa los campos principales para obtener consejos de IA");
      return;
    }

    setLoading(true);
    try {
      // TODO: Conectar con backend API real cuando esté deployado
      // const response = await fetch('/api/ai/advisor', { ... });
      
      // Mock data por ahora
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockAdvice = {
        asset_analysis: {
          type: assetType,
          value_assessment: parseFloat(valueUsd) > 1000000 ? "High-value asset" : "Mid-range asset",
          location_analysis: `Ubicación estratégica en ${location}`
        },
        legal_guidance: {
          requirements: [
            "🏛️ Verificar título de propiedad",
            "📋 Avalúo profesional reciente",
            "⚖️ Verificar zonificación y permisos",
            "🔍 Due diligence completo"
          ],
          next_steps: [
            "1️⃣ Reunir documentación legal",
            "2️⃣ Obtener valuación profesional",
            "3️⃣ Verificar cumplimiento regulatorio",
            "4️⃣ Configurar estructura de tokens"
          ]
        },
        tokenization_strategy: "Fraccionamiento ideal: 1,000-10,000 tokens para liquidez óptima",
        investment_recommendations: {
          potential: "Alto",
          strategies: [
            "💡 Considera alquilar para generar ingresos pasivos",
            "📈 Revalorización promedio: 5-8% anual",
            "🎯 Ideal para diversificar portafolio"
          ],
          risk_level: "Medio"
        },
        ai_insights: {
          market_trends: `📊 ${assetType} muestra tendencia positiva en ${location}`,
          timing: "⏰ Momento favorable para tokenizar",
          gamification_tip: "🎮 ¡Completa tu primer asset para desbloquear badge 'Tokenizador Novato'!"
        }
      };
      
      setAdvice(mockAdvice);
      setExpanded(true);
      toast.success("Análisis de IA completado");
    } catch (error) {
      toast.error("Error al obtener consejos de IA");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-effect border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
            AI Legal Advisor
          </CardTitle>
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
            Beta
          </Badge>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          Obtén análisis legal, estrategia de tokenización y recomendaciones de inversión
        </p>
      </CardHeader>
      <CardContent>
        {!advice ? (
          <Button
            onClick={getAIAdvice}
            disabled={loading}
            className="w-full qpc-gradient text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analizando con IA...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Obtener Análisis de IA
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            {/* Quick Summary */}
            <div className="bg-slate-900/50 rounded-lg p-4 border border-purple-500/20">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-white font-semibold mb-1">Análisis Rápido</h4>
                  <p className="text-sm text-gray-400">{advice.asset_analysis.value_assessment}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpanded(!expanded)}
                  className="text-purple-400"
                >
                  {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </Button>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  {advice.investment_recommendations.potential}
                </Badge>
                <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                  <Shield className="mr-1 h-3 w-3" />
                  {advice.investment_recommendations.risk_level}
                </Badge>
              </div>
            </div>

            {/* Gamification Tip */}
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-3 border border-purple-500/20">
              <p className="text-sm text-purple-200">{advice.ai_insights.gamification_tip}</p>
            </div>

            {expanded && (
              <div className="space-y-4 animate-in fade-in duration-300">
                {/* Legal Requirements */}
                <div>
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    Requisitos Legales
                  </h4>
                  <ul className="space-y-2">
                    {advice.legal_guidance.requirements.map((req: string, idx: number) => (
                      <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="text-purple-400">•</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tokenization Strategy */}
                <div className="bg-slate-900/50 rounded-lg p-3 border border-blue-500/20">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-400" />
                    Estrategia de Tokenización
                  </h4>
                  <p className="text-sm text-gray-300">{advice.tokenization_strategy}</p>
                </div>

                {/* Investment Recommendations */}
                <div>
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    Recomendaciones de Inversión
                  </h4>
                  <ul className="space-y-2">
                    {advice.investment_recommendations.strategies.map((strategy: string, idx: number) => (
                      <li key={idx} className="text-sm text-gray-300">{strategy}</li>
                    ))}
                  </ul>
                </div>

                {/* Next Steps */}
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-3 border border-blue-500/20">
                  <h4 className="text-white font-semibold mb-2">Próximos Pasos</h4>
                  <ol className="space-y-1">
                    {advice.legal_guidance.next_steps.map((step: string, idx: number) => (
                      <li key={idx} className="text-sm text-gray-300">{step}</li>
                    ))}
                  </ol>
                </div>

                {/* Market Insights */}
                <div className="bg-slate-900/50 rounded-lg p-3 border border-purple-500/20">
                  <p className="text-sm text-purple-200">{advice.ai_insights.market_trends}</p>
                  <p className="text-sm text-blue-200 mt-1">{advice.ai_insights.timing}</p>
                </div>
              </div>
            )}

            <Button
              onClick={getAIAdvice}
              variant="outline"
              className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
            >
              Actualizar Análisis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}