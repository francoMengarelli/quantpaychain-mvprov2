import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedType, setSelectedType] = useState('transaction_summary');
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const API = `${BACKEND_URL}/api`;

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/reports`, {
        withCredentials: true
      });
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Error al cargar reportes');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      const response = await axios.post(
        `${API}/reports/generate`,
        { report_type: selectedType },
        { withCredentials: true }
      );
      
      toast.success('Reporte generado exitosamente');
      fetchReports();
    } catch (error) {
      console.error('Generate report error:', error);
      toast.error('Error al generar reporte');
    } finally {
      setGenerating(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen" data-testid="reports-page">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8 fade-in">
          <h1 className="text-4xl font-bold mb-2" data-testid="reports-title">Reportes ISO 20022</h1>
          <p className="text-gray-600">Genera reportes financieros compatibles con ISO 20022</p>
        </div>

        {/* Generate Report Card */}
        <Card className="glass mb-8" data-testid="generate-report-card">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6">Generar Nuevo Reporte</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Tipo de Reporte</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger data-testid="report-type-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transaction_summary">Resumen de Transacciones</SelectItem>
                    <SelectItem value="asset_valuation">Valuación de Activos</SelectItem>
                    <SelectItem value="compliance_report">Reporte de Cumplimiento</SelectItem>
                    <SelectItem value="portfolio_analysis">Análisis de Portfolio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white py-6"
                  data-testid="generate-report-btn"
                >
                  {generating ? (
                    'Generando...'
                  ) : (
                    <>
                      <Sparkles className="mr-2" size={20} />
                      Generar Reporte con IA
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Reportes Generados</h2>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i} className="glass animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : reports.length === 0 ? (
            <Card className="glass" data-testid="no-reports">
              <CardContent className="p-12 text-center">
                <FileText className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-600">No tienes reportes generados aún</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4 fade-in" data-testid="reports-list">
              {reports.map(report => (
                <Card key={report.id} className="glass hover:shadow-xl transition-all" data-testid={`report-${report.id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <FileText className="text-blue-600" size={24} />
                          <h3 className="text-lg font-bold capitalize">
                            {report.report_type.replace('_', ' ')}
                          </h3>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">
                          Generado: {formatDate(report.generated_at)}
                        </p>
                        
                        <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                          <div className="text-sm text-gray-700 whitespace-pre-wrap">
                            {report.data.content?.substring(0, 300)}...
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-4"
                        onClick={() => {
                          const blob = new Blob([report.data.content], { type: 'text/plain' });
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `report_${report.id}.txt`;
                          a.click();
                          toast.success('Reporte descargado');
                        }}
                        data-testid={`download-report-${report.id}`}
                      >
                        <Download size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
