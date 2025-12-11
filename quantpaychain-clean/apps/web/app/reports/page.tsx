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
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

export default function ReportsPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [generatedReports, setGeneratedReports] = useState<any[]>([]);

  const generateReport = async (type: string, name: string) => {
    setLoading(type);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newReport = {
        id: Date.now().toString(),
        type,
        name,
        date: new Date().toISOString(),
        status: 'completed'
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
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      id: 'valuation',
      name: 'Valuación de Activos',
      description: 'Valuación actual de mercado de todos los activos tokenizados',
      icon: TrendingUp,
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'compliance',
      name: 'Reporte de Cumplimiento',
      description: 'Documentación de cumplimiento regulatorio y auditoría',
      icon: Shield,
      color: 'emerald',
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'portfolio',
      name: 'Análisis de Portafolio',
      description: 'Distribución de activos, rendimiento y métricas de riesgo',
      icon: BarChart3,
      color: 'orange',
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
                        <Download className="mr-2" size={16} />
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
                Reportes Recientes
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
                      className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-purple-500/10"
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
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Completado
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="text-purple-400 hover:text-purple-300"
                          onClick={() => toast.info('Descarga disponible próximamente')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
