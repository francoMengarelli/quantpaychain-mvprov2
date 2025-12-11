"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageLayout } from "@/components/page-layout";
import { TrendingUp, Search, Building2, Coins, Palette, FileText, RefreshCw } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// Force dynamic rendering to avoid indexedDB errors during build
export const dynamic = 'force-dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://quantpaychain-api2.onrender.com';

interface MarketplaceToken {
  id: string;
  asset_id: string;
  token_symbol: string;
  total_supply: number;
  available_supply: number;
  price_per_token: number;
  blockchain_network: string;
  contract_address?: string;
  created_at: string;
  asset_name: string;
  asset_type: string;
  asset_description: string;
  asset_value_usd: number;
  asset_location: string;
}

// Mock data for demo - Professional RWA tokens
const MOCK_TOKENS: MarketplaceToken[] = [
  {
    id: '1',
    asset_id: 'torre-reforma',
    token_symbol: 'TREFORMA',
    total_supply: 100000,
    available_supply: 45000,
    price_per_token: 125.00,
    blockchain_network: 'Ethereum',
    contract_address: '0x1234...5678',
    created_at: '2024-01-15',
    asset_name: 'Torre Reforma 509',
    asset_type: 'real_estate',
    asset_description: 'Edificio comercial premium de 57 pisos en la zona financiera de Ciudad de México. Certificación LEED Platinum.',
    asset_value_usd: 12500000,
    asset_location: 'CDMX, México'
  },
  {
    id: '2',
    asset_id: 'centro-logistico',
    token_symbol: 'LOGCTR',
    total_supply: 50000,
    available_supply: 28000,
    price_per_token: 275.00,
    blockchain_network: 'Polygon',
    contract_address: '0x2345...6789',
    created_at: '2024-02-20',
    asset_name: 'Centro Logístico Guadalajara',
    asset_type: 'real_estate',
    asset_description: 'Complejo logístico de clase A con 85,000 m² de espacio industrial. Ocupación del 98%.',
    asset_value_usd: 13750000,
    asset_location: 'Guadalajara, México'
  },
  {
    id: '3',
    asset_id: 'coleccion-arte',
    token_symbol: 'ARTSOL',
    total_supply: 10000,
    available_supply: 7500,
    price_per_token: 480.00,
    blockchain_network: 'Ethereum',
    contract_address: '0x3456...7890',
    created_at: '2024-03-10',
    asset_name: 'Colección Arte Solar',
    asset_type: 'art',
    asset_description: 'Colección de 25 obras de arte contemporáneo latinoamericano. Valuada por Christie\'s.',
    asset_value_usd: 4800000,
    asset_location: 'Miami, USA'
  },
  {
    id: '4',
    asset_id: 'bono-verde',
    token_symbol: 'GRNBND',
    total_supply: 200000,
    available_supply: 120000,
    price_per_token: 50.00,
    blockchain_network: 'Avalanche',
    contract_address: '0x4567...8901',
    created_at: '2024-04-05',
    asset_name: 'Bono Verde LATAM',
    asset_type: 'bond',
    asset_description: 'Bono verde para financiamiento de proyectos de energía renovable en América Latina. Rendimiento 6.5% anual.',
    asset_value_usd: 10000000,
    asset_location: 'Regional LATAM'
  },
  {
    id: '5',
    asset_id: 'hotel-cancun',
    token_symbol: 'HTLCUN',
    total_supply: 75000,
    available_supply: 35000,
    price_per_token: 200.00,
    blockchain_network: 'Polygon',
    contract_address: '0x5678...9012',
    created_at: '2024-05-15',
    asset_name: 'Hotel Resort Cancún',
    asset_type: 'real_estate',
    asset_description: 'Resort 5 estrellas frente al mar con 350 habitaciones. Ocupación promedio del 85%.',
    asset_value_usd: 15000000,
    asset_location: 'Cancún, México'
  },
  {
    id: '6',
    asset_id: 'commodity-oro',
    token_symbol: 'GOLDMX',
    total_supply: 25000,
    available_supply: 18000,
    price_per_token: 1200.00,
    blockchain_network: 'Ethereum',
    contract_address: '0x6789...0123',
    created_at: '2024-06-01',
    asset_name: 'Reserva de Oro México',
    asset_type: 'commodity',
    asset_description: 'Participación en reserva de oro físico almacenado en bóveda de alta seguridad. Respaldado 1:1.',
    asset_value_usd: 30000000,
    asset_location: 'Ciudad de México'
  }
];

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tokens, setTokens] = useState<MarketplaceToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    loadTokens();
  }, []);

  const [isUsingMockData, setIsUsingMockData] = useState(false);

  const loadTokens = async () => {
    try {
      setLoading(true);
      setIsUsingMockData(false);
      
      // Try to fetch from API first with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`${API_URL}/api/tokens`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data) && data.length > 0) {
          setTokens(data);
          return;
        }
      }
      
      // Fallback to mock data for demo
      console.log('API unavailable, using demo data for marketplace');
      setTokens(MOCK_TOKENS);
      setIsUsingMockData(true);
      
    } catch (error: any) {
      console.error('Error loading tokens:', error);
      // Use mock data on error
      setTokens(MOCK_TOKENS);
      setIsUsingMockData(true);
    } finally {
      setLoading(false);
    }
  };

  const getAssetTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'real_estate': 'Bienes Raíces',
      'commodity': 'Commodity',
      'art': 'Arte',
      'bond': 'Bono',
      'equity': 'Equity',
      'other': 'Otro'
    };
    return types[type] || type;
  };

  const getAssetTypeIcon = (type: string) => {
    switch (type) {
      case 'real_estate': return Building2;
      case 'commodity': return Coins;
      case 'art': return Palette;
      case 'bond': return FileText;
      default: return Coins;
    }
  };

  const getNetworkColor = (network: string) => {
    switch (network.toLowerCase()) {
      case 'ethereum': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'polygon': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'avalanche': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const assetTypes = ['all', 'real_estate', 'commodity', 'art', 'bond'];

  const filteredTokens = tokens.filter(token => {
    const matchesSearch = token.token_symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.asset_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || token.asset_type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <PageLayout showWalletButton={true}>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-[family-name:var(--font-space-grotesk)]">
                🏪 <span className="qpc-gradient-text">Marketplace</span>
              </h1>
              <p className="text-gray-400">Explora y compra activos del mundo real tokenizados</p>
            </div>
            <Button 
              variant="outline" 
              className="mt-4 md:mt-0 border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
              onClick={loadTokens}
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

          {/* Filters */}
          <div className="glass-effect rounded-xl p-6 mb-8 border border-purple-500/20">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por símbolo o nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/40"
                />
              </div>
              
              {/* Type Filter */}
              <div className="flex flex-wrap gap-2">
                {assetTypes.map((type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? 'default' : 'outline'}
                    size="sm"
                    className={selectedType === type 
                      ? 'qpc-gradient text-white' 
                      : 'border-purple-500/30 text-gray-300 hover:bg-purple-500/10'
                    }
                    onClick={() => setSelectedType(type)}
                  >
                    {type === 'all' ? 'Todos' : getAssetTypeLabel(type)}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="glass-effect border-purple-500/20">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-white">{tokens.length}</p>
                <p className="text-xs text-gray-400">Activos Disponibles</p>
              </CardContent>
            </Card>
            <Card className="glass-effect border-purple-500/20">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-emerald-400">
                  ${tokens.reduce((acc, t) => acc + t.asset_value_usd, 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">Valor Total</p>
              </CardContent>
            </Card>
            <Card className="glass-effect border-purple-500/20">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-purple-400">3</p>
                <p className="text-xs text-gray-400">Blockchains</p>
              </CardContent>
            </Card>
            <Card className="glass-effect border-purple-500/20">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-cyan-400">7.2%</p>
                <p className="text-xs text-gray-400">Yield Promedio</p>
              </CardContent>
            </Card>
          </div>

          {/* Tokens Grid */}
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="h-12 w-12 text-purple-400 animate-spin mx-auto" />
              <p className="text-gray-400 mt-4">Cargando activos tokenizados...</p>
            </div>
          ) : filteredTokens.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTokens.map((token) => {
                const TypeIcon = getAssetTypeIcon(token.asset_type);
                return (
                  <Card key={token.id} className="glass-effect border-purple-500/20 hover:border-purple-500/40 transition-all group overflow-hidden">
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300 flex items-center gap-1">
                            <TypeIcon className="h-3 w-3" />
                            {getAssetTypeLabel(token.asset_type)}
                          </Badge>
                          <Badge className={`text-xs ${getNetworkColor(token.blockchain_network)}`}>
                            {token.blockchain_network}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                          {token.asset_name}
                        </h3>
                        <p className="text-sm text-gray-400 line-clamp-2">{token.asset_description}</p>
                      </div>

                      {/* Token Info */}
                      <div className="bg-slate-900/50 rounded-lg p-4 mb-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">Token</span>
                          <span className="text-sm font-bold qpc-gradient-text">{token.token_symbol}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">Precio por Token</span>
                          <span className="text-sm font-semibold text-white">${token.price_per_token?.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">Disponibles</span>
                          <span className="text-sm text-emerald-400 font-semibold">
                            {token.available_supply?.toLocaleString()} / {token.total_supply?.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Asset Value */}
                      <div className="mb-4 pb-4 border-b border-gray-800">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">Valor del Activo</span>
                          <span className="text-lg font-bold text-white">
                            ${Number(token.asset_value_usd).toLocaleString('es-ES')}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">📍 {token.asset_location}</p>
                      </div>

                      {/* Action Button */}
                      <Link href={`/token/${token.asset_id}`}>
                        <Button className="w-full qpc-gradient text-white group-hover:shadow-lg group-hover:shadow-purple-500/25 transition-all">
                          <TrendingUp className="mr-2" size={18} />
                          Ver Detalles & Comprar
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="glass-effect border-purple-500/20">
              <CardContent className="p-12 text-center">
                <Search className="h-16 w-16 text-purple-400/30 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No se encontraron activos</p>
                <p className="text-gray-500 text-sm mt-2">Prueba con otro término de búsqueda o filtro</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
// Build timestamp: 1733949572
