"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageLayout } from "@/components/page-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { TrendingUp, Search } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// Force dynamic rendering to avoid indexedDB errors during build
export const dynamic = 'force-dynamic';

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
  // Asset info
  asset_name: string;
  asset_type: string;
  asset_description: string;
  asset_value_usd: number;
  asset_location: string;
}

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tokens, setTokens] = useState<MarketplaceToken[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = async () => {
    try {
      setLoading(true);
      // Join tokens with rwa_assets to get asset information
      const { data, error } = await supabase
        .from('tokens')
        .select(`
          *,
          asset:rwa_assets!inner(
            name,
            asset_type,
            description,
            value_usd,
            location,
            status
          )
        `)
        .eq('asset.status', 'active')
        .gt('available_supply', 0)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to flat structure
      const transformedData = data?.map((item: any) => ({
        id: item.id,
        asset_id: item.asset_id,
        token_symbol: item.token_symbol,
        total_supply: item.total_supply,
        available_supply: item.available_supply,
        price_per_token: item.price_per_token,
        blockchain_network: item.blockchain_network,
        contract_address: item.contract_address,
        created_at: item.created_at,
        asset_name: item.asset.name,
        asset_type: item.asset.asset_type,
        asset_description: item.asset.description,
        asset_value_usd: item.asset.value_usd,
        asset_location: item.asset.location
      })) || [];

      setTokens(transformedData);
    } catch (error: any) {
      console.error('Error loading tokens:', error);
      toast.error('Error al cargar el marketplace');
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

  const filteredTokens = tokens.filter(token =>
    token.token_symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.asset_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <PageLayout showWalletButton={true}>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Marketplace</h1>
            <p className="text-gray-400">Explore and purchase tokenized real-world assets</p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search tokens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/40"
              />
            </div>
          </div>

          {/* Tokens Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              <p className="text-gray-400 mt-4">Loading tokens...</p>
            </div>
          ) : filteredTokens.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTokens.map((token) => (
                <Card key={token.id} className="glass-effect border-purple-500/20 hover:border-purple-500/40 transition-all group">
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300">
                          {getAssetTypeLabel(token.asset_type)}
                        </Badge>
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
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
                        <span className="text-sm font-bold text-purple-300">{token.token_symbol}</span>
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
                        <span className="text-sm text-gray-400">Valor del Asset</span>
                        <span className="text-lg font-bold text-white">
                          ${Number(token.asset_value_usd).toLocaleString('es-ES')}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{token.asset_location}</p>
                    </div>

                    {/* Action Button */}
                    <Link href={`/token/${token.asset_id}`}>
                      <Button className="w-full qpc-gradient text-white group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all">
                        <TrendingUp className="mr-2" size={18} />
                        Ver Detalles & Comprar
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="glass-effect border-purple-500/20">
              <CardContent className="p-12 text-center">
                <p className="text-gray-400 text-lg">No tokens found</p>
                <p className="text-gray-500 text-sm mt-2">Try a different search term</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
    </ProtectedRoute>
  );
}
