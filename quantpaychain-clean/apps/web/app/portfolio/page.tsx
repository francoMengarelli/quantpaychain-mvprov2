"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  PieChart, 
  ArrowUpRight,
  RefreshCw,
  Coins,
  Building2,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://quantpaychain-api2.onrender.com';

interface TokenHolding {
  id: string;
  token_symbol: string;
  asset_name: string;
  quantity: number;
  purchase_price: number;
  current_price: number;
  total_invested: number;
  current_value: number;
  roi_percentage: number;
  asset_type: string;
}

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<TokenHolding[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalValue, setTotalValue] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);
  const [totalROI, setTotalROI] = useState(0);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const setMockData = () => {
    const mockHoldings: TokenHolding[] = [
      {
        id: '1',
        token_symbol: 'TREFORMA',
        asset_name: 'Torre Reforma',
        quantity: 150,
        purchase_price: 100,
        current_price: 125,
        total_invested: 15000,
        current_value: 18750,
        roi_percentage: 25,
        asset_type: 'Real Estate'
      },
      {
        id: '2',
        token_symbol: 'LOGCTR',
        asset_name: 'Centro Logístico CDMX',
        quantity: 80,
        purchase_price: 250,
        current_price: 275,
        total_invested: 20000,
        current_value: 22000,
        roi_percentage: 10,
        asset_type: 'Industrial'
      },
      {
        id: '3',
        token_symbol: 'ARTSOL',
        asset_name: 'Colección Arte Solar',
        quantity: 25,
        purchase_price: 500,
        current_price: 480,
        total_invested: 12500,
        current_value: 12000,
        roi_percentage: -4,
        asset_type: 'Art & Collectibles'
      }
    ];
    setHoldings(mockHoldings);
    const totInvested = mockHoldings.reduce((acc, h) => acc + h.total_invested, 0);
    const totValue = mockHoldings.reduce((acc, h) => acc + h.current_value, 0);
    setTotalInvested(totInvested);
    setTotalValue(totValue);
    setTotalROI(((totValue - totInvested) / totInvested) * 100);
    setIsUsingMockData(true);
  };

  const fetchPortfolio = async () => {
    setLoading(true);
    setIsUsingMockData(false);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`${API_URL}/api/earnings/portfolio`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.holdings && data.holdings.length > 0) {
          setHoldings(data.holdings);
          setTotalValue(data.summary?.current_value || 0);
          setTotalInvested(data.summary?.total_invested || 0);
          setTotalROI(data.summary?.roi_percentage || 0);
          return;
        }
      }
      // Fallback to mock data
      console.log('API unavailable, using demo data for portfolio');
      setMockData();
    } catch (error) {
      console.error('Error:', error);
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const getAssetIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'real estate':
        return Building2;
      case 'industrial':
        return Coins;
      default:
        return PieChart;
    }
  };

  return (
    <>
      <Navbar showWalletButton={false} />
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 pt-20">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-[family-name:var(--font-space-grotesk)]">
                💼 Mi <span className="qpc-gradient-text">Portafolio</span>
              </h1>
              <p className="text-gray-400">Gestiona tus activos tokenizados</p>
            </div>
            <Button 
              variant="outline" 
              className="mt-4 md:mt-0 border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
              onClick={fetchPortfolio}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
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

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="glass-effect border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Valor Total</span>
                  <Wallet className="h-5 w-5 text-purple-400" />
                </div>
                <p className="text-3xl font-bold text-white">
                  ${totalValue.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Total Invertido</span>
                  <DollarSign className="h-5 w-5 text-blue-400" />
                </div>
                <p className="text-3xl font-bold text-white">
                  ${totalInvested.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">ROI Total</span>
                  {totalROI >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-400" />
                  )}
                </div>
                <p className={`text-3xl font-bold ${totalROI >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {totalROI >= 0 ? '+' : ''}{totalROI.toFixed(2)}%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Holdings List */}
          <Card className="glass-effect border-purple-500/20">
            <CardHeader className="border-b border-purple-500/20">
              <CardTitle className="text-white flex items-center gap-2">
                <Coins className="h-5 w-5 text-purple-400" />
                Mis Holdings ({holdings.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 text-purple-400 animate-spin" />
                </div>
              ) : holdings.length === 0 ? (
                <div className="text-center py-12">
                  <Wallet className="h-16 w-16 mx-auto mb-4 text-purple-400/30" />
                  <p className="text-gray-400 text-lg mb-2">No tienes tokens aún</p>
                  <p className="text-gray-500 text-sm mb-6">Empieza a invertir en el marketplace</p>
                  <Link href="/marketplace">
                    <Button className="qpc-gradient text-white">
                      Ir al Marketplace
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {holdings.map((holding) => {
                    const Icon = getAssetIcon(holding.asset_type);
                    return (
                      <div
                        key={holding.id}
                        className="bg-slate-900/50 rounded-xl p-5 border border-purple-500/10 hover:border-purple-500/30 transition-all"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-purple-500/20">
                              <Icon className="h-6 w-6 text-purple-400" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-white text-lg">
                                  {holding.token_symbol}
                                </h3>
                                <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
                                  {holding.asset_type}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-400">{holding.asset_name}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-400">Cantidad</p>
                              <p className="text-white font-medium">{holding.quantity}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Precio Actual</p>
                              <p className="text-white font-medium">${holding.current_price}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Valor Total</p>
                              <p className="text-white font-medium">${holding.current_value.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">ROI</p>
                              <p className={`font-semibold ${holding.roi_percentage >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {holding.roi_percentage >= 0 ? '+' : ''}{holding.roi_percentage.toFixed(1)}%
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
