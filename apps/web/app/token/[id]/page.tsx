"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageLayout } from "@/components/page-layout";
import { ArrowLeft, TrendingUp, ShoppingCart, ExternalLink, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

// Force dynamic rendering to avoid indexedDB errors during build
export const dynamic = 'force-dynamic';

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

interface TokenDetailsProps {
  params: {
    id: string;
  };
}

export default function TokenDetailsPage({ params }: TokenDetailsProps) {
  const router = useRouter();
  const [token, setToken] = useState<Token | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadTokenDetails();
  }, [params.id]);

  const loadTokenDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('tokens')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setToken(data);
    } catch (error) {
      console.error('Error loading token:', error);
      toast.error('Error loading token details');
    } finally {
      setLoading(false);
    }
  };

  const [purchasing, setPurchasing] = useState(false);
  const { user } = useAuth();

  const handlePurchase = async () => {
    if (!user) {
      toast.error("Debes iniciar sesi\u00f3n para comprar");
      router.push("/login");
      return;
    }

    if (quantity > (token?.available_supply || 0)) {
      toast.error("Cantidad no disponible");
      return;
    }

    setPurchasing(true);
    try {
      // TODO: Conectar con backend API cuando est\u00e9 deployado
      // const response = await fetch('/api/purchase/create-intent', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     token_id: params.id,
      //     quantity,
      //     user_id: user.id
      //   })
      // });
      
      // Mock: Simular proceso de compra
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Actualizar supply localmente
      if (token) {
        const newSupply = token.available_supply - quantity;
        setToken({ ...token, available_supply: newSupply });
      }
      
      // Crear transacci\u00f3n en Supabase
      const { error } = await supabase.from('transactions').insert([{
        id: crypto.randomUUID(),
        buyer_id: user.id,
        token_id: params.id,
        quantity,
        total_amount: totalPrice,
        transaction_hash: `mock_${Date.now()}`,
        status: 'completed',
        created_at: new Date().toISOString()
      }]);
      
      if (error) throw error;
      
      // Actualizar supply en DB
      await supabase.from('tokens').update({
        available_supply: (token?.available_supply || 0) - quantity
      }).eq('id', params.id);
      
      toast.success("Compra exitosa! Tokens agregados a tu portafolio");
      toast.info("Transacción firmada con PQC");
      
      // Reset quantity
      setQuantity(1);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error: any) {
      console.error('Purchase error:', error);
      toast.error("Error al procesar la compra");
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </PageLayout>
    );
  }

  if (!token) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <div className="container mx-auto px-4 py-8">
          <Card className="glass-effect border-purple-500/20">
            <CardContent className="p-12 text-center">
              <p className="text-gray-400 text-lg mb-4">Token not found</p>
              <Link href="/marketplace">
                <Button className="qpc-gradient text-white">
                  <ArrowLeft className="mr-2" size={16} />
                  Back to Marketplace
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
      </PageLayout>
    );
  }

  const totalPrice = (token.price_per_token || 0) * quantity;

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/marketplace">
          <Button variant="ghost" className="text-gray-400 hover:text-white mb-6">
            <ArrowLeft className="mr-2" size={16} />
            Back to Marketplace
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2">
            <Card className="glass-effect border-purple-500/20 mb-6">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-4xl font-bold qpc-gradient-text">
                    {token.token_symbol}
                  </h1>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    {token.blockchain_network}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Price per Token</p>
                    <p className="text-3xl font-bold text-white">${token.price_per_token?.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Available Supply</p>
                    <p className="text-3xl font-bold text-white">{token.available_supply?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Supply</p>
                    <p className="text-2xl font-semibold text-white">{token.total_supply?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Status</p>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                      Active
                    </Badge>
                  </div>
                </div>

                {token.contract_address && (
                  <div className="mb-6">
                    <p className="text-gray-400 text-sm mb-2">Contract Address</p>
                    <div className="flex items-center gap-2">
                      <code className="text-purple-400 text-sm bg-slate-900/50 px-3 py-2 rounded border border-purple-500/20">
                        {token.contract_address}
                      </code>
                      <Button size="sm" variant="ghost" className="text-purple-400">
                        <ExternalLink size={16} />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card className="glass-effect border-purple-500/20">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Token Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Asset ID</p>
                    <p className="text-white">{token.asset_id || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Created</p>
                    <p className="text-white">{new Date(token.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Compliance</p>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      ISO 20022 Compliant
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Purchase Card */}
          <div>
            <Card className="glass-effect border-purple-500/20 sticky top-8">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-6">Purchase Tokens</h3>
                
                <div className="mb-6">
                  <label className="text-gray-400 text-sm mb-2 block">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max={token.available_supply}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500/40"
                  />
                </div>

                <div className="mb-6 p-4 bg-slate-900/50 rounded-lg border border-purple-500/20">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Price per token:</span>
                    <span className="text-white font-semibold">${token.price_per_token?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Quantity:</span>
                    <span className="text-white font-semibold">{quantity}</span>
                  </div>
                  <div className="border-t border-gray-800 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-white font-semibold">Total:</span>
                      <span className="text-2xl font-bold qpc-gradient-text">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handlePurchase}
                  disabled={purchasing || (token?.available_supply || 0) < 1}
                  className="w-full qpc-gradient text-white mb-3 group"
                >
                  {purchasing ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 group-hover:scale-110 transition-transform" size={18} />
                      Comprar Ahora
                    </>
                  )}
                </Button>

                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Shield className="h-3 w-3 text-purple-400" />
                    <span>Post-Quantum Cryptography</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Zap className="h-3 w-3 text-blue-400" />
                    <span>ISO 20022 Compliant</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </PageLayout>
  );
}
