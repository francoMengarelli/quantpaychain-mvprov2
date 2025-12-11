import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Package } from 'lucide-react';
import { toast } from 'sonner';

const CreateAsset = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    asset_type: 'real_estate',
    description: '',
    value_usd: ''
  });
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
  const API = BACKEND_URL.endsWith('/api') ? BACKEND_URL : `${BACKEND_URL}/api`;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setAnalysis(null); // Clear analysis when form changes
  };

  const handleAnalyze = async () => {
    if (!formData.name || !formData.description || !formData.value_usd) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    try {
      setAnalyzing(true);
      const response = await axios.post(
        `${API}/ai/analyze-asset`,
        { asset_data: formData },
        { withCredentials: true }
      );
      setAnalysis(response.data.analysis);
      toast.success('Análisis completado');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Error al analizar activo');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.value_usd) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${API}/assets`,
        {
          ...formData,
          value_usd: parseFloat(formData.value_usd)
        },
        { withCredentials: true }
      );
      
      toast.success('Activo creado exitosamente');
      navigate('/portfolio');
    } catch (error) {
      console.error('Create asset error:', error);
      toast.error('Error al crear activo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" data-testid="create-asset-page">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="mb-8 fade-in">
          <h1 className="text-4xl font-bold mb-2" data-testid="page-title">Crear Activo RWA</h1>
          <p className="text-gray-600">Tokeniza un activo del mundo real en la blockchain</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="glass mb-6" data-testid="asset-form-card">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Nombre del Activo</label>
                  <Input
                    placeholder="Ej: Edificio Comercial Centro"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                    data-testid="asset-name-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Tipo de Activo</label>
                  <Select value={formData.asset_type} onValueChange={(value) => handleChange('asset_type', value)}>
                    <SelectTrigger data-testid="asset-type-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="real_estate">Bienes Raíces</SelectItem>
                      <SelectItem value="commodity">Commodities</SelectItem>
                      <SelectItem value="invoice">Facturas / Cuentas por Cobrar</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Valor (USD)</label>
                  <Input
                    type="number"
                    placeholder="100000"
                    value={formData.value_usd}
                    onChange={(e) => handleChange('value_usd', e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    data-testid="asset-value-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Descripción Detallada</label>
                  <Textarea
                    placeholder="Describe el activo en detalle: ubicación, características, condición, documentación legal, etc."
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    required
                    rows={5}
                    data-testid="asset-description-input"
                  />
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                    data-testid="analyze-btn"
                  >
                    {analyzing ? (
                      'Analizando...'
                    ) : (
                      <>
                        <Sparkles className="mr-2" size={18} />
                        Analizar con IA
                      </>
                    )}
                  </Button>
                  
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-500 text-white"
                    data-testid="create-asset-btn"
                  >
                    {loading ? (
                      'Creando...'
                    ) : (
                      <>
                        <Package className="mr-2" size={18} />
                        Crear Activo
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis Results */}
          {analysis && (
            <Card className="glass fade-in" data-testid="analysis-results">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Sparkles className="mr-2 text-blue-600" size={24} />
                  Análisis con IA
                </h3>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700">{analysis}</div>
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateAsset;
