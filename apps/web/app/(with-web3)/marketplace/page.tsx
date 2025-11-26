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

interface Token {
  id: string;
  asset_id: string;
  token_symbol: string;
  total_supply: number;
  available_supply: number;
  price_per_token: number;
  blockchain_network: string;
  contract_address?: string;
  created_at: string;
}

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTokens();
  }, []);

  const loadTokens = async () => {
    try {
      const { data, error } = await supabase
        .from('tokens')
        .select('*')
        .limit(10);

      if (error) throw error;
      setTokens(data || []);
    } catch (error) {
      console.error('Error loading tokens:', error);
      toast.error('Error loading tokens');
    } finally {
      setLoading(false);
    }
  };

  const filteredTokens = tokens.filter(token =>
    token.token_symbol.toLowerCase().includes(searchTerm.toLowerCase())
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
                <Card key={token.id} className="glass-effect border-purple-500/20 hover:border-purple-500/40 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold qpc-gradient-text">{token.token_symbol}</h3>
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                        {token.blockchain_network}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Price</span>
                        <span className="text-white font-semibold">${token.price_per_token?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Available</span>
                        <span className="text-white font-semibold">{token.available_supply?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Supply</span>
                        <span className="text-white">{token.total_supply?.toLocaleString()}</span>
                      </div>
                    </div>

                    <Link href={`/token/${token.id}`}>
                      <Button className="w-full qpc-gradient text-white">
                        <TrendingUp className="mr-2" size={18} />
                        View Details
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
