"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, CheckCircle2, AlertTriangle, FileText, 
  Shield, Clock, DollarSign, Globe, MapPin, Building, 
  Loader2, Download, Eye, Printer, Copy, Calendar, Hash, 
  BarChart3, Target, Users, XCircle, CheckCircle, AlertOctagon
} from "lucide-react";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://quantpaychain-api2.onrender.com';

interface Jurisdiction {
  code: string;
  name: string;
  region: string;
  maturity: string;
  risk_level: string;
}

interface AIAdvisorPanelProps {
  assetType: string;
  description: string;
  valueUsd: string;
  location: string;
}

// Función para generar PDF institucional
function generatePDF(report: any) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    toast.error('Por favor permite las ventanas emergentes para descargar el PDF');
    return;
  }

  const decision = report.decision || {};
  const decisionText = decision.recommendation === 'PROCEED' ? '✅ PROCEED' :
                       decision.recommendation === 'PROCEED_WITH_CONDITIONS' ? '⚠️ PROCEED WITH CONDITIONS' :
                       '❌ DO NOT PROCEED';
  const decisionColor = decision.color === 'green' ? '#166534' :
                        decision.color === 'yellow' ? '#92400e' : '#dc2626';
  const targetInvestorsText = decision.target_investors === 'INSTITUTIONAL_ONLY' ? 'Institutional Only' :
                              decision.target_investors === 'ACCREDITED_ONLY' ? 'Accredited Only' : 'Qualified Retail';
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Pre-Legal Regulatory Dossier - ${report.report_id}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #1a1a2e;
          padding: 40px;
          max-width: 850px;
          margin: 0 auto;
          font-size: 12px;
        }
        .header {
          border-bottom: 3px solid #6b21a8;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
        .logo { font-size: 20px; font-weight: bold; color: #6b21a8; }
        .subtitle { font-size: 11px; color: #666; margin-top: 2px; }
        .report-id {
          font-size: 10px;
          color: #666;
          font-family: monospace;
          background: #f3f4f6;
          padding: 3px 8px;
          border-radius: 4px;
          display: inline-block;
          margin-top: 8px;
        }
        .report-title {
          font-size: 22px;
          color: #1a1a2e;
          margin: 15px 0 8px;
          font-weight: 700;
        }
        
        /* DECISION BOX - Lo más importante */
        .decision-box {
          background: linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%);
          color: white;
          padding: 25px;
          border-radius: 12px;
          margin: 20px 0;
          page-break-inside: avoid;
        }
        .decision-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }
        .decision-main {
          font-size: 28px;
          font-weight: bold;
          color: ${decisionColor};
          margin-bottom: 8px;
        }
        .decision-summary {
          font-size: 14px;
          opacity: 0.9;
          max-width: 400px;
        }
        .risk-score-box {
          text-align: center;
          background: rgba(255,255,255,0.1);
          padding: 15px 25px;
          border-radius: 8px;
        }
        .risk-score-value {
          font-size: 36px;
          font-weight: bold;
        }
        .risk-score-label { font-size: 11px; opacity: 0.8; }
        
        .decision-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-top: 15px;
        }
        .decision-item {
          background: rgba(255,255,255,0.1);
          padding: 12px;
          border-radius: 8px;
          text-align: center;
        }
        .decision-item-label { font-size: 10px; opacity: 0.7; margin-bottom: 4px; }
        .decision-item-value { font-size: 13px; font-weight: 600; }
        
        .red-flags {
          background: rgba(220, 38, 38, 0.2);
          border: 1px solid rgba(220, 38, 38, 0.4);
          border-radius: 8px;
          padding: 12px;
          margin-top: 15px;
        }
        .red-flags-title { font-size: 11px; font-weight: 600; color: #fca5a5; margin-bottom: 8px; }
        .red-flag-item { font-size: 11px; color: #fecaca; margin: 4px 0; }
        
        /* Sections */
        .section {
          margin: 20px 0;
          page-break-inside: avoid;
        }
        .section-title {
          font-size: 14px;
          font-weight: 600;
          color: #6b21a8;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 6px;
          margin-bottom: 12px;
        }
        
        /* Tables */
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 10px 0;
          font-size: 11px;
        }
        th {
          background: #f3f4f6;
          padding: 8px 10px;
          text-align: left;
          font-weight: 600;
          border-bottom: 2px solid #e5e7eb;
        }
        td {
          padding: 8px 10px;
          border-bottom: 1px solid #e5e7eb;
        }
        tr:nth-child(even) { background: #fafafa; }
        
        /* Analysis content */
        .analysis-content {
          white-space: pre-wrap;
          font-size: 11px;
          line-height: 1.7;
          color: #374151;
        }
        
        /* Disclaimer */
        .disclaimer {
          background: #fffbeb;
          border: 1px solid #fcd34d;
          border-radius: 8px;
          padding: 15px;
          margin-top: 25px;
          font-size: 10px;
          color: #92400e;
        }
        .disclaimer-title { font-weight: 600; margin-bottom: 6px; }
        
        /* Audit box */
        .audit-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px;
          margin-top: 20px;
          font-size: 10px;
        }
        .audit-row {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          border-bottom: 1px dashed #e5e7eb;
        }
        .audit-row:last-child { border-bottom: none; }
        
        .footer {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          font-size: 10px;
          color: #666;
        }
        
        @media print {
          body { padding: 20px; }
          .decision-box { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">QuantPayChain</div>
        <div class="subtitle">Pre-Legal Regulatory Intelligence for RWA</div>
        <div class="report-id">ID: ${report.report_id}</div>
      </div>

      <h1 class="report-title">Pre-Legal Regulatory Dossier</h1>
      <p style="color: #666; font-size: 11px; margin-bottom: 15px;">
        ${getFlagEmojiStatic(report.jurisdiction.code)} ${report.jurisdiction.name} | 
        ${report.asset_summary.type} | 
        $${report.asset_summary.value_usd?.toLocaleString()} USD |
        ${new Date(report.generated_at).toLocaleDateString('es-ES')}
      </p>

      <div class="decision-box">
        <div class="decision-header">
          <div>
            <div class="decision-main">${decisionText}</div>
            <div class="decision-summary">
              ${decision.recommendation === 'PROCEED' ? 'Viabilidad favorable para proceder con la tokenización bajo las condiciones indicadas.' :
                decision.recommendation === 'PROCEED_WITH_CONDITIONS' ? 'Viable con condiciones específicas. Revisar red flags y mitigaciones requeridas.' :
                'No recomendado proceder en esta jurisdicción. Evaluar alternativas.'}
            </div>
          </div>
          <div class="risk-score-box">
            <div class="risk-score-value" style="color: ${
              report.jurisdiction.risk_score < 40 ? '#4ade80' :
              report.jurisdiction.risk_score < 70 ? '#fbbf24' : '#f87171'
            }">${report.jurisdiction.risk_score}</div>
            <div class="risk-score-label">RISK SCORE</div>
          </div>
        </div>
        
        <div class="decision-grid">
          <div class="decision-item">
            <div class="decision-item-label">TARGET INVESTORS</div>
            <div class="decision-item-value">${targetInvestorsText}</div>
          </div>
          <div class="decision-item">
            <div class="decision-item-label">MIN. BUDGET</div>
            <div class="decision-item-value">$${decision.min_budget_usd?.toLocaleString() || 'N/A'}</div>
          </div>
          <div class="decision-item">
            <div class="decision-item-label">TIMELINE</div>
            <div class="decision-item-value">${decision.estimated_timeline_months || 'N/A'} meses</div>
          </div>
          <div class="decision-item">
            <div class="decision-item-label">REGULATOR</div>
            <div class="decision-item-value">${report.metadata.regulator || 'N/A'}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h3 class="section-title">📋 ANÁLISIS DETALLADO</h3>
        <div class="analysis-content">${report.analysis}</div>
      </div>

      <div class="disclaimer">
        <div class="disclaimer-title">⚠️ ALCANCE Y LIMITACIONES</div>
        <p>
          Este documento es un Pre-Legal Regulatory Dossier para toma de decisiones.
          NO constituye asesoría legal, fiscal, financiera o de inversión.
          Se recomienda validar con counsel legal especializado antes de proceder.
          QuantPayChain opera como motor de inteligencia, NO como asesor legal.
        </p>
      </div>

      <div class="audit-box">
        <strong>Información de Auditoría</strong>
        <div class="audit-row"><span>Report ID:</span><span style="font-family: monospace;">${report.report_id}</span></div>
        <div class="audit-row"><span>Timestamp:</span><span>${report.generated_at}</span></div>
        <div class="audit-row"><span>Jurisdicción:</span><span>${report.jurisdiction.code} - ${report.jurisdiction.name}</span></div>
        <div class="audit-row"><span>Hash:</span><span style="font-family: monospace;">${generateHash(report.report_id)}</span></div>
      </div>

      <div class="footer">
        <p><strong>QuantPayChain</strong> - Pre-Legal Regulatory Intelligence for RWA</p>
        <p>www.quantpaychain.com</p>
      </div>

      <script>window.onload = function() { window.print(); }</script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

function generateHash(id: string): string {
  let hash = 0;
  const str = id + Date.now().toString();
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).toUpperCase().padStart(12, '0');
}

function getRiskBadgeStatic(score: number) {
  if (score < 40) return { text: 'Riesgo Bajo', class: 'risk-low' };
  if (score < 70) return { text: 'Riesgo Medio', class: 'risk-medium' };
  return { text: 'Riesgo Alto', class: 'risk-high' };
}

function getFlagEmojiStatic(countryCode: string): string {
  const flags: Record<string, string> = {
    'CL': '🇨🇱', 'MX': '🇲🇽', 'AR': '🇦🇷', 'US': '🇺🇸',
    'ES': '🇪🇸', 'CH': '🇨🇭', 'SG': '🇸🇬', 'AE': '🇦🇪'
  };
  return flags[countryCode] || '🌍';
}

function downloadJSON(report: any) {
  const dataStr = JSON.stringify(report, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${report.report_id}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  toast.success('ID copiado al portapapeles');
}

export function AIAdvisorPanel({ assetType, description, valueUsd, location }: AIAdvisorPanelProps) {
  const [advice, setAdvice] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>([]);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>("");
  const [loadingJurisdictions, setLoadingJurisdictions] = useState(true);
  const [showFullReport, setShowFullReport] = useState(false);

  useEffect(() => {
    loadJurisdictions();
  }, []);

  const loadJurisdictions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/jurisdictions`);
      if (response.ok) {
        const data = await response.json();
        setJurisdictions(data);
        const locationLower = location.toLowerCase();
        if (locationLower.includes('chile') || locationLower.includes('santiago')) setSelectedJurisdiction('CL');
        else if (locationLower.includes('mexico') || locationLower.includes('méxico')) setSelectedJurisdiction('MX');
        else if (locationLower.includes('usa') || locationLower.includes('estados unidos')) setSelectedJurisdiction('US');
        else if (locationLower.includes('españa') || locationLower.includes('spain')) setSelectedJurisdiction('ES');
        else if (locationLower.includes('suiza') || locationLower.includes('switzerland')) setSelectedJurisdiction('CH');
      }
    } catch (error) {
      console.error('Error loading jurisdictions:', error);
    } finally {
      setLoadingJurisdictions(false);
    }
  };

  const getJurisdictionalAnalysis = async () => {
    if (!assetType || !description || !valueUsd || !location) {
      toast.error("Completa todos los campos del activo");
      return;
    }
    if (!selectedJurisdiction) {
      toast.error("Selecciona una jurisdicción para el análisis");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const value = parseFloat(valueUsd);
      const response = await fetch(`${API_BASE_URL}/api/ai/jurisdictional-analysis-demo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset: { type: assetType, value_usd: value, location, description },
          jurisdiction_code: selectedJurisdiction,
          tokenization_intent: {
            offering_type: value > 1000000 ? 'private' : 'retail',
            target_investors: value > 500000 ? 'accredited' : 'retail',
            target_chains: ['ethereum', 'polygon']
          }
        })
      });

      if (!response.ok) throw new Error('Error en el análisis');
      const data = await response.json();
      setAdvice(data);
      toast.success("Dossier generado! 🎉");
    } catch (error: any) {
      console.error('Error:', error);
      setError('Error al generar el dossier. Intenta de nuevo.');
      toast.error("Error en el análisis");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score < 40) return 'text-green-400';
    if (score < 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskBgColor = (score: number) => {
    if (score < 40) return 'bg-green-500/20 border-green-500/30';
    if (score < 70) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  const getDecisionIcon = (recommendation: string) => {
    if (recommendation === 'PROCEED') return <CheckCircle className="w-6 h-6 text-green-400" />;
    if (recommendation === 'PROCEED_WITH_CONDITIONS') return <AlertOctagon className="w-6 h-6 text-yellow-400" />;
    return <XCircle className="w-6 h-6 text-red-400" />;
  };

  const getDecisionText = (recommendation: string) => {
    if (recommendation === 'PROCEED') return { text: 'PROCEED', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (recommendation === 'PROCEED_WITH_CONDITIONS') return { text: 'PROCEED WITH CONDITIONS', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    return { text: 'DO NOT PROCEED', color: 'text-red-400', bg: 'bg-red-500/20' };
  };

  const getInvestorTypeText = (type: string) => {
    if (type === 'INSTITUTIONAL_ONLY') return 'Institutional Only';
    if (type === 'ACCREDITED_ONLY') return 'Accredited Only';
    return 'Qualified Retail';
  };

  const getFlagEmoji = (countryCode: string): string => {
    const flags: Record<string, string> = {
      'CL': '🇨🇱', 'MX': '🇲🇽', 'AR': '🇦🇷', 'US': '🇺🇸',
      'ES': '🇪🇸', 'CH': '🇨🇭', 'SG': '🇸🇬', 'AE': '🇦🇪'
    };
    return flags[countryCode] || '🌍';
  };

  return (
    <Card className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 border-purple-500/30 overflow-hidden">
      <CardHeader className="border-b border-purple-500/20 bg-black/20">
        <CardTitle className="flex items-center gap-3 text-white">
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg">Pre-Legal Regulatory Intelligence</span>
            <p className="text-sm font-normal text-gray-400 mt-1">
              Dossier de inteligencia regulatoria para tokenización RWA
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Selector de Jurisdicción */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Globe className="w-4 h-4 text-purple-400" />
            Selecciona la Jurisdicción
          </label>
          
          {loadingJurisdictions ? (
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              Cargando jurisdicciones...
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {jurisdictions.map((j) => (
                <button
                  key={j.code}
                  onClick={() => setSelectedJurisdiction(j.code)}
                  className={`p-3 rounded-lg border transition-all ${
                    selectedJurisdiction === j.code
                      ? 'border-purple-500 bg-purple-500/20 text-white'
                      : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-purple-500/50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-lg">{getFlagEmoji(j.code)}</span>
                    <span className="text-sm font-medium">{j.name}</span>
                    <Badge className={`text-xs ${
                      j.risk_level === 'low' ? 'bg-green-500/20 text-green-400' :
                      j.risk_level === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {j.maturity}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Resumen del Activo */}
        {assetType && valueUsd && (
          <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
            <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <Building className="w-4 h-4 text-purple-400" />
              Activo a Analizar
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Tipo:</span>
                <span className="ml-2 text-white">{assetType}</span>
              </div>
              <div>
                <span className="text-gray-500">Valor:</span>
                <span className="ml-2 text-green-400">${parseFloat(valueUsd).toLocaleString()} USD</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500">Ubicación:</span>
                <span className="ml-2 text-white flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {location}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Botón de Análisis */}
        <Button
          onClick={getJurisdictionalAnalysis}
          disabled={loading || !selectedJurisdiction || !assetType || !valueUsd}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generando Dossier Regulatorio...
            </>
          ) : (
            <>
              <Shield className="w-5 h-5 mr-2" />
              Generar Pre-Legal Regulatory Dossier
            </>
          )}
        </Button>

        {/* Resultado del Análisis */}
        {advice && (
          <div className="space-y-4 animate-fadeIn">
            {/* Header con ID */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-purple-400" />
                <code className="text-xs text-purple-300 bg-purple-500/10 px-2 py-1 rounded font-mono">
                  {advice.report_id}
                </code>
                <button onClick={() => copyToClipboard(advice.report_id)} className="text-gray-400 hover:text-white">
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                {new Date(advice.generated_at).toLocaleString('es-ES')}
              </div>
            </div>

            {/* DECISION BOX - Lo más importante */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 border border-purple-500/30">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  {advice.decision && getDecisionIcon(advice.decision.recommendation)}
                  <div>
                    <div className={`text-2xl font-bold ${advice.decision ? getDecisionText(advice.decision.recommendation).color : 'text-gray-400'}`}>
                      {advice.decision ? getDecisionText(advice.decision.recommendation).text : 'ANALYZING'}
                    </div>
                    <p className="text-sm text-gray-400 mt-1 max-w-md">
                      {advice.decision?.recommendation === 'PROCEED' 
                        ? 'Viabilidad favorable para proceder con la tokenización.'
                        : advice.decision?.recommendation === 'PROCEED_WITH_CONDITIONS'
                        ? 'Viable con condiciones. Revisar red flags y mitigaciones.'
                        : 'No recomendado. Evaluar jurisdicciones alternativas.'}
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getRiskColor(advice.jurisdiction.risk_score)}`}>
                    {advice.jurisdiction.risk_score}
                  </div>
                  <div className="text-xs text-gray-500">RISK SCORE</div>
                </div>
              </div>

              {/* Decision Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700 text-center">
                  <Users className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                  <div className="text-xs text-gray-500">Target Investors</div>
                  <div className="text-sm font-semibold text-white">
                    {advice.decision ? getInvestorTypeText(advice.decision.target_investors) : 'N/A'}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700 text-center">
                  <DollarSign className="w-4 h-4 text-green-400 mx-auto mb-1" />
                  <div className="text-xs text-gray-500">Min. Budget</div>
                  <div className="text-sm font-semibold text-green-400">
                    ${advice.decision?.min_budget_usd?.toLocaleString() || 'N/A'}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700 text-center">
                  <Clock className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                  <div className="text-xs text-gray-500">Timeline</div>
                  <div className="text-sm font-semibold text-blue-400">
                    {advice.decision?.estimated_timeline_months || 'N/A'} meses
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700 text-center">
                  <Shield className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                  <div className="text-xs text-gray-500">Regulator</div>
                  <div className="text-sm font-semibold text-white">
                    {advice.metadata?.regulator || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Jurisdiction Badge */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-700">
                <span className="text-2xl">{getFlagEmoji(advice.jurisdiction.code)}</span>
                <div>
                  <div className="text-white font-semibold">{advice.jurisdiction.name}</div>
                  <div className="text-xs text-gray-500">{advice.jurisdiction.region}</div>
                </div>
                <Badge className={`ml-auto ${getRiskBgColor(advice.jurisdiction.risk_score)} border`}>
                  {advice.jurisdiction.risk_score < 40 ? 'Riesgo Bajo' : 
                   advice.jurisdiction.risk_score < 70 ? 'Riesgo Medio' : 'Riesgo Alto'}
                </Badge>
              </div>
            </div>

            {/* Análisis Detallado */}
            <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  Dossier Regulatorio Completo
                </h4>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-purple-500/30 text-purple-400"
                  onClick={() => setShowFullReport(!showFullReport)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  {showFullReport ? 'Colapsar' : 'Expandir'}
                </Button>
              </div>
              <div className={`prose prose-invert prose-sm max-w-none overflow-hidden transition-all ${
                showFullReport ? 'max-h-none' : 'max-h-48'
              }`}>
                <div className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">
                  {advice.analysis}
                </div>
              </div>
              {!showFullReport && (
                <div className="mt-2 text-center">
                  <span className="text-xs text-gray-500">Click "Expandir" para ver el dossier completo</span>
                </div>
              )}
            </div>

            {/* Botones de Descarga */}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => generatePDF(advice)}
                className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar PDF
              </Button>
              <Button
                onClick={() => downloadJSON(advice)}
                variant="outline"
                className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
              >
                <Download className="w-4 h-4 mr-2" />
                JSON
              </Button>
              <Button
                onClick={() => window.print()}
                variant="outline"
                className="border-gray-500/30 text-gray-400 hover:bg-gray-500/10"
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimir
              </Button>
            </div>

            {/* Disclaimer */}
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <p className="text-xs text-yellow-400 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>ALCANCE:</strong> Este Pre-Legal Regulatory Dossier es para toma de decisiones informadas.
                  NO constituye asesoría legal. Valide con counsel legal especializado antes de proceder.
                  <strong> Próximo paso obligatorio:</strong> Consultar abogados de securities en {advice.jurisdiction.name}.
                </span>
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-sm text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AIAdvisorPanel;
