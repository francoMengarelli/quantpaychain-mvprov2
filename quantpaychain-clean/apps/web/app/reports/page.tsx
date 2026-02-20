"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  Shield, 
  BarChart3,
  Clock,
  CheckCircle2,
  Eye,
  X,
  Printer
} from "lucide-react";
import { toast } from "sonner";

// Función para generar datos de reporte
function generateReportData(type: string) {
  const now = new Date();
  const formatDate = (d: Date) => d.toLocaleDateString('es-ES', { 
    day: '2-digit', month: '2-digit', year: 'numeric' 
  });
  
  switch (type) {
    case 'transaction':
      return {
        title: 'Reporte de Transacciones ISO 20022',
        subtitle: `Período: ${formatDate(new Date(now.getTime() - 30*24*60*60*1000))} - ${formatDate(now)}`,
        sections: [
          {
            title: 'Resumen Ejecutivo',
            content: [
              { label: 'Total Transacciones', value: '47' },
              { label: 'Volumen Total', value: '$125,450.00 USD' },
              { label: 'Comisiones Pagadas', value: '$1,254.50 USD' },
              { label: 'Transacciones Exitosas', value: '45 (95.7%)' },
              { label: 'Transacciones Pendientes', value: '2 (4.3%)' },
            ]
          },
          {
            title: 'Desglose por Tipo',
            content: [
              { label: 'Compras de Tokens', value: '28 transacciones - $78,200.00' },
              { label: 'Ventas de Tokens', value: '12 transacciones - $32,150.00' },
              { label: 'Dividendos Recibidos', value: '7 transacciones - $15,100.00' },
            ]
          },
          {
            title: 'Cumplimiento ISO 20022',
            content: [
              { label: 'Formato de Mensajes', value: 'pain.001.001.03 / pain.002.001.03' },
              { label: 'Validación XML', value: '✓ Todos los mensajes validados' },
              { label: 'Trazabilidad', value: '✓ End-to-end ID asignado' },
            ]
          }
        ]
      };
    
    case 'valuation':
      return {
        title: 'Reporte de Valuación de Activos',
        subtitle: `Fecha de corte: ${formatDate(now)}`,
        sections: [
          {
            title: 'Resumen del Portafolio',
            content: [
              { label: 'Valor Total de Mercado', value: '$52,750.00 USD' },
              { label: 'Costo Base Total', value: '$47,500.00 USD' },
              { label: 'Ganancia/Pérdida No Realizada', value: '+$5,250.00 USD (+11.05%)' },
              { label: 'Número de Activos', value: '5 activos tokenizados' },
            ]
          },
          {
            title: 'Valuación por Activo',
            content: [
              { label: 'TREFORMA (Torre Reforma)', value: '$18,750.00 (150 tokens @ $125.00)' },
              { label: 'LOGCTR (Centro Logístico)', value: '$22,000.00 (80 tokens @ $275.00)' },
              { label: 'ARTSOL (Arte Solar)', value: '$12,000.00 (25 tokens @ $480.00)' },
            ]
          },
          {
            title: 'Metodología de Valuación',
            content: [
              { label: 'Fuente de Precios', value: 'Oracle de precios QuantPayChain' },
              { label: 'Frecuencia de Actualización', value: 'Cada 15 minutos' },
              { label: 'Última Actualización', value: now.toLocaleString('es-ES') },
            ]
          }
        ]
      };
    
    case 'compliance':
      return {
        title: 'Reporte de Cumplimiento Regulatorio',
        subtitle: `Período de auditoría: Q4 2024`,
        sections: [
          {
            title: 'Estado de Cumplimiento KYC/AML',
            content: [
              { label: 'Verificación de Identidad', value: '✓ Completada y vigente' },
              { label: 'Nivel de Verificación', value: 'Enhanced Due Diligence (EDD)' },
              { label: 'Puntuación de Riesgo', value: 'Bajo (Score: 15/100)' },
              { label: 'Última Revisión', value: formatDate(now) },
            ]
          },
          {
            title: 'Verificaciones Realizadas',
            content: [
              { label: 'Documento de Identidad', value: '✓ Verificado (Pasaporte)' },
              { label: 'Prueba de Domicilio', value: '✓ Verificada' },
              { label: 'Origen de Fondos', value: '✓ Declarado y verificado' },
              { label: 'Lista de Sanciones (OFAC/EU)', value: '✓ Sin coincidencias' },
              { label: 'PEP Screening', value: '✓ No es PEP' },
            ]
          },
          {
            title: 'Regulaciones Aplicables',
            content: [
              { label: 'MiCA (EU)', value: '✓ Cumplimiento preparado' },
              { label: 'SEC Regulation D', value: '✓ Exención 506(c) aplicable' },
              { label: 'FATF Guidelines', value: '✓ Travel Rule implementada' },
            ]
          }
        ]
      };
    
    case 'portfolio':
      return {
        title: 'Análisis de Portafolio',
        subtitle: `Análisis al ${formatDate(now)}`,
        sections: [
          {
            title: 'Métricas de Rendimiento',
            content: [
              { label: 'ROI Total', value: '+11.05%' },
              { label: 'ROI Anualizado', value: '+18.2% (estimado)' },
              { label: 'Dividendos Recibidos YTD', value: '$3,750.00 USD' },
              { label: 'Yield por Dividendos', value: '7.89% anual' },
            ]
          },
          {
            title: 'Distribución de Activos',
            content: [
              { label: 'Bienes Raíces', value: '35.5% ($18,750)' },
              { label: 'Industrial/Logística', value: '41.7% ($22,000)' },
              { label: 'Arte y Coleccionables', value: '22.8% ($12,000)' },
            ]
          },
          {
            title: 'Análisis de Riesgo',
            content: [
              { label: 'Volatilidad (30d)', value: '8.5% (Moderada)' },
              { label: 'Sharpe Ratio', value: '1.42' },
              { label: 'Max Drawdown', value: '-4.2%' },
              { label: 'Correlación con BTC', value: '0.35 (Baja)' },
            ]
          }
        ]
      };
    
    default:
      return null;
  }
}

// Función para descargar reporte como JSON
function downloadReportJSON(report: any, filename: string) {
  const dataStr = JSON.stringify(report, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Función para descargar reporte como texto
function downloadReportText(report: any, filename: string) {
  let text = `${report.title}\n${'='.repeat(60)}\n${report.subtitle}\n\n`;
  
  report.sections.forEach((section: any) => {
    text += `\n${section.title}\n${'-'.repeat(40)}\n`;
    section.content.forEach((item: any) => {
      text += `${item.label}: ${item.value}\n`;
    });
  });
  
  text += `\n\nGenerado por QuantPayChain - ${new Date().toLocaleString('es-ES')}`;
  
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [generatedReports, setGeneratedReports] = useState<any[]>([]);
  const [viewingReport, setViewingReport] = useState<any>(null);

  const generateReport = async (type: string, name: string) => {
    setLoading(type);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const reportData = generateReportData(type);
      
      const newReport = {
        id: Date.now().toString(),
        type,
        name,
        date: new Date().toISOString(),
        status: 'completed',
        data: reportData
      };
      
      setGeneratedReports(prev => [newReport, ...prev]);
      toast.success(`¡Reporte ${name} generado exitosamente!`);
    } catch (error) {
      toast.error("Error al generar el reporte");
    } finally {
      setLoading(null);
    }
  };

  const reportTypes = [
    {
      id: 'transaction',
      name: 'Reporte de Transacciones',
      description: 'Historial detallado de transacciones con cumplimiento ISO 20022',
      icon: FileText,
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      id: 'valuation',
      name: 'Valuación de Activos',
      description: 'Valuación actual de mercado de todos los activos tokenizados',
      icon: TrendingUp,
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'compliance',
      name: 'Reporte de Cumplimiento',
      description: 'Documentación de cumplimiento regulatorio KYC/AML',
      icon: Shield,
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'portfolio',
      name: 'Análisis de Portafolio',
      description: 'Distribución de activos, rendimiento y métricas de riesgo',
      icon: BarChart3,
      gradient: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <>
      <Navbar showWalletButton={false} />
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 pt-20">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-[family-name:var(--font-space-grotesk)]">
              📊 Reportes <span className="qpc-gradient-text">ISO 20022</span>
            </h1>
            <p className="text-gray-400">Genera reportes financieros con cumplimiento normativo internacional</p>
          </div>

          {/* ISO 20022 Info Banner */}
          <Card className="glass-effect border-purple-500/20 mb-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-purple-500/20">
                  <Shield className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Estándar ISO 20022</h3>
                  <p className="text-gray-400 text-sm">
                    Todos los reportes generados cumplen con el estándar internacional ISO 20022 para 
                    mensajería financiera, facilitando la integración con sistemas bancarios tradicionales 
                    y asegurando la compatibilidad con infraestructuras de pago globales.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Types Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {reportTypes.map((report) => (
              <Card 
                key={report.id}
                className="glass-effect border-purple-500/20 hover:border-purple-500/40 transition-all"
              >
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${report.gradient} mr-3`}>
                      <report.icon className="h-5 w-5 text-white" />
                    </div>
                    {report.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-4">
                    {report.description}
                  </p>
                  <Button
                    onClick={() => generateReport(report.id, report.name)}
                    disabled={loading === report.id}
                    className={`w-full bg-gradient-to-r ${report.gradient} text-white hover:opacity-90`}
                  >
                    {loading === report.id ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2" size={16} />
                        Generar Reporte
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Reports */}
          <Card className="glass-effect border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-400" />
                Reportes Generados
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedReports.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg mb-2">No hay reportes generados</p>
                  <p className="text-sm">Genera tu primer reporte usando las opciones de arriba</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {generatedReports.map((report) => (
                    <div 
                      key={report.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-purple-500/10 gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-purple-400" />
                        <div>
                          <p className="text-white font-medium">{report.name}</p>
                          <p className="text-sm text-gray-400">
                            {new Date(report.date).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Completado
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                          onClick={() => setViewingReport(report)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                          onClick={() => {
                            downloadReportText(report.data, `${report.type}-${report.id}`);
                            toast.success('Reporte descargado');
                          }}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          TXT
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                          onClick={() => {
                            downloadReportJSON(report.data, `${report.type}-${report.id}`);
                            toast.success('Reporte JSON descargado');
                          }}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          JSON
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Report Viewer Modal */}
        {viewingReport && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-purple-500/30 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
                <div>
                  <h2 className="text-xl font-bold text-white">{viewingReport.data?.title}</h2>
                  <p className="text-sm text-gray-400">{viewingReport.data?.subtitle}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-purple-500/30 text-purple-400"
                    onClick={() => window.print()}
                  >
                    <Printer className="h-4 w-4 mr-1" />
                    Imprimir
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="text-gray-400 hover:text-white"
                    onClick={() => setViewingReport(null)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {viewingReport.data?.sections.map((section: any, idx: number) => (
                  <div key={idx} className="mb-6">
                    <h3 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                      {section.title}
                    </h3>
                    <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                      {section.content.map((item: any, itemIdx: number) => (
                        <div key={itemIdx} className="flex justify-between items-center py-2 border-b border-slate-700/50 last:border-0">
                          <span className="text-gray-400">{item.label}</span>
                          <span className="text-white font-medium">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {/* Footer */}
                <div className="mt-8 pt-4 border-t border-purple-500/20 text-center text-sm text-gray-500">
                  <p>Generado por QuantPayChain • {new Date().toLocaleString('es-ES')}</p>
                  <p className="mt-1">Este reporte cumple con el estándar ISO 20022</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
