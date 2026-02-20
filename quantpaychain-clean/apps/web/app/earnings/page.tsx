"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Award, 
  ArrowUpRight, 
  ArrowDownRight,
  Wallet,
  Calendar,
  RefreshCw,
  Download,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";

// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://quantpaychain-api2.onrender.com';

interface PortfolioSummary {
  total_invested: number;
  current_value: number;
  total_dividends: number;
  roi_percentage: number;
  total_holdings: number;
}

interface Holding {
  asset: {
    id: string;
    name: string;
    token_symbol: string;
  };
  holding: {
    quantity: number;
    total_invested: number;
    current_value: number;
  };
  performance: {
    roi_percentage: number;
    total_gain: number;
    total_dividends: number;
  };
}

interface Dividend {
  id: string;
  amount: number;
  distribution_date: string;
  period: string;
  tokens_held: number;
  status: string;
  asset_name?: string;
}

export default function EarningsPage() {
  const [portfolio, setPortfolio] = useState<{ summary: PortfolioSummary; holdings: Holding[] } | null>(null);
  const [dividends, setDividends] = useState<Dividend[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  useEffect(() => {
    fetchPortfolioData();
    fetchDividends();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`${API_URL}/api/earnings/portfolio`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error('Failed to fetch portfolio');

      const data = await response.json();
      setPortfolio(data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      // Set mock data for demo
      setPortfolio({
        summary: {
          total_invested: 50000,
          current_value: 62500,
          total_dividends: 3750,
          roi_percentage: 25.0,
          total_holdings: 5
        },
        holdings: []
      });
      setIsUsingMockData(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchDividends = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`${API_URL}/api/earnings/dividends`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error('Failed to fetch dividends');

      const data = await response.json();
      setDividends(data);
    } catch (error) {
      console.error('Error fetching dividends:', error);
      // Set mock data for demo
      setDividends([
        { id: '1', amount: 1250, distribution_date: '2024-12-01', period: '2024-11', tokens_held: 500, status: 'completed', asset_name: 'Torre Reforma' },
        { id: '2', amount: 875, distribution_date: '2024-11-01', period: '2024-10', tokens_held: 350, status: 'completed', asset_name: 'Centro Logístico' },
        { id: '3', amount: 1625, distribution_date: '2024-10-01', period: '2024-09', tokens_held: 650, status: 'completed', asset_name: 'Complejo Industrial' },
      ]);
      setIsUsingMockData(true);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setIsUsingMockData(false);
    fetchPortfolioData();
    fetchDividends();
    toast.success('Datos actualizados');
  };

  if (loading) {
    return (
      <>
        <Navbar showWalletButton={false} />
        <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-purple-400 text-xl animate-pulse flex items-center gap-3">
                <RefreshCw className="h-6 w-6 animate-spin" />
                Cargando portafolio...
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  const summary = portfolio?.summary || {
    total_invested: 0,
    current_value: 0,
    total_dividends: 0,
    roi_percentage: 0,
    total_holdings: 0
  };

  const holdings = portfolio?.holdings || [];

  const statCards = [
    {
      title: 'Total Invertido',
      value: `$${summary.total_invested.toLocaleString()}`,
      icon: Wallet,
      gradient: 'from-violet-500 to-purple-600',
      change: null
    },
    {
      title: 'Valor Actual',
      value: `$${summary.current_value.toLocaleString()}`,
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-teal-600',
      change: summary.roi_percentage
    },
    {
      title: 'Dividendos Totales',
      value: `$${summary.total_dividends.toLocaleString()}`,
      icon: DollarSign,
      gradient: 'from-blue-500 to-cyan-600',
      change: null
    },
    {
      title: 'ROI Global',
      value: `${summary.roi_percentage >= 0 ? '+' : ''}${summary.roi_percentage.toFixed(2)}%`,
      icon: Award,
      gradient: 'from-orange-500 to-red-600',
      change: summary.roi_percentage
    }
  ];

  return (
    <>
      <Navbar showWalletButton={false} />
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 pt-20">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-[family-name:var(--font-space-grotesk)]">
                💰 Ganancias & <span className="qpc-gradient-text">ROI</span>
              </h1>
              <p className="text-gray-400">Seguimiento de rendimiento e inversiones</p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Button 
                variant="outline" 
                className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                onClick={handleRefresh}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
              <Button className="qpc-gradient text-white">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          {/* Demo Mode Banner */}
          {isUsingMockData && (
            <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <p className="text-amber-300 text-sm">
                <strong>Modo Demo:</strong> Mostrando datos de ejemplo. El servidor de datos no está disponible temporalmente.
              </p>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat, index) => (
              <Card key={index} className="glass-effect border-purple-500/20 hover:border-purple-500/40 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400 text-sm">{stat.title}</span>
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                      <stat.icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                    {stat.change !== null && (
                      <span className={`flex items-center text-sm ${stat.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {stat.change >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Holdings Section */}
          <Card className="glass-effect border-purple-500/20 mb-8">
            <CardHeader className="border-b border-purple-500/20">
              <CardTitle className="text-white flex items-center gap-2">
                <PieChart className="h-5 w-5 text-purple-400" />
                Mis Inversiones
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {holdings.length === 0 ? (
                <div className="text-center py-12">
                  <Wallet className="h-16 w-16 mx-auto mb-4 text-purple-400/30" />
                  <p className="text-gray-400 text-lg mb-2">No tienes inversiones aún</p>
                  <p className="text-gray-500 text-sm mb-6">¡Empieza a invertir en el marketplace!</p>
                  <Button className="qpc-gradient text-white">
                    Ir al Marketplace
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {holdings.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/50 rounded-xl p-5 border border-purple-500/10 hover:border-purple-500/30 transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white text-lg mb-1">
                            {item.asset?.name || 'Asset'}
                          </h3>
                          <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                            <span>Tokens: <span className="text-white">{item.holding?.quantity}</span></span>
                            <span>•</span>
                            <span>Invertido: <span className="text-white">${item.holding?.total_invested?.toLocaleString()}</span></span>
                          </div>
                        </div>

                        <div className="flex flex-col md:items-end gap-2">
                          <Badge
                            className={`${
                              item.performance?.roi_percentage >= 0 
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                                : 'bg-red-500/20 text-red-400 border-red-500/30'
                            }`}
                          >
                            ROI: {item.performance?.roi_percentage >= 0 ? '+' : ''}
                            {item.performance?.roi_percentage?.toFixed(2)}%
                          </Badge>

                          <div className="text-sm">
                            <span className="text-gray-400">Ganancia: </span>
                            <span className={`font-semibold ${item.performance?.total_gain >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              ${item.performance?.total_gain?.toLocaleString()}
                            </span>
                          </div>

                          <div className="text-sm">
                            <span className="text-gray-400">Dividendos: </span>
                            <span className="font-semibold text-cyan-400">
                              ${item.performance?.total_dividends?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dividend History */}
          <Card className="glass-effect border-purple-500/20">
            <CardHeader className="border-b border-purple-500/20">
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-400" />
                Historial de Dividendos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {dividends.length === 0 ? (
                <div className="text-center py-12">
                  <DollarSign className="h-16 w-16 mx-auto mb-4 text-purple-400/30" />
                  <p className="text-gray-400 text-lg">No has recibido dividendos aún</p>
                  <p className="text-gray-500 text-sm">Los dividendos se distribuyen mensualmente</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-purple-500/20">
                      <tr className="text-left text-gray-400 text-sm">
                        <th className="pb-4 font-medium">Fecha</th>
                        <th className="pb-4 font-medium">Activo</th>
                        <th className="pb-4 font-medium">Período</th>
                        <th className="pb-4 font-medium">Tokens</th>
                        <th className="pb-4 font-medium text-right">Monto</th>
                        <th className="pb-4 font-medium">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dividends.slice(0, 10).map((div, idx) => (
                        <tr key={idx} className="border-b border-purple-500/10 hover:bg-purple-500/5 transition-colors">
                          <td className="py-4 text-white">
                            {new Date(div.distribution_date).toLocaleDateString('es-ES')}
                          </td>
                          <td className="py-4 text-white">
                            {div.asset_name || 'N/A'}
                          </td>
                          <td className="py-4 text-gray-400">{div.period}</td>
                          <td className="py-4 text-white">{div.tokens_held}</td>
                          <td className="py-4 text-right font-semibold text-emerald-400">
                            +${div.amount.toLocaleString()}
                          </td>
                          <td className="py-4">
                            <Badge 
                              className={
                                div.status === 'completed' 
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                                  : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                              }
                            >
                              {div.status === 'completed' ? '✓ Pagado' : '⏳ Pendiente'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
// Build timestamp: 1765488107
