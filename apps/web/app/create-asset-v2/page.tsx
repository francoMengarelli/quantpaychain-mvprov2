"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/page-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { v4 as uuidv4 } from 'uuid';

export default function CreateAssetV2Page() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    asset_type: "",
    description: "",
    value_usd: "",
    location: "",
    token_name: "",
    token_symbol: "",
    total_supply: "",
    price_per_token: "",
    blockchain: "ethereum"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) {
        toast.error("Debes iniciar sesión");
        router.push("/login");
        return;
      }

      const assetId = uuidv4();
      const tokenId = uuidv4();

      const asset = {
        id: assetId,
        owner_id: user.id,
        name: formData.name,
        asset_type: formData.asset_type,
        description: formData.description,
        value_usd: parseFloat(formData.value_usd),
        location: formData.location,
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error: assetError } = await supabase
        .from('rwa_assets')
        .insert([asset]);

      if (assetError) throw assetError;

      const token = {
        id: tokenId,
        asset_id: assetId,
        token_name: formData.token_name,
        token_symbol: formData.token_symbol,
        total_supply: parseInt(formData.total_supply),
        available_supply: parseInt(formData.total_supply),
        price_per_token: parseFloat(formData.price_per_token),
        blockchain_network: formData.blockchain,
        token_standard: "ERC-20",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error: tokenError } = await supabase
        .from('tokens')
        .insert([token]);

      if (tokenError) throw tokenError;

      toast.success("Asset creado exitosamente!");
      router.push("/dashboard");
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || "Error al crear asset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold qpc-gradient-text mb-2">Crear Nuevo Asset</h1>
          <p className="text-gray-400 mb-8">Tokeniza tu activo del mundo real</p>

          <form onSubmit={handleSubmit}>
            <Card className="glass-effect border-purple-500/20">
              <CardContent className="p-8">
                
                {/* Basic Info */}
                <div className="space-y-6 mb-8">
                  <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
                    Información del Asset
                  </h3>
                  
                  <div>
                    <label htmlFor="name" className="block text-gray-300 mb-2">
                      Nombre del Asset *
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-purple-500/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Ej: Torre Empresarial Manhattan"
                    />
                  </div>

                  <div>
                    <label htmlFor="asset_type" className="block text-gray-300 mb-2">
                      Tipo de Asset *
                    </label>
                    <select
                      id="asset_type"
                      required
                      value={formData.asset_type}
                      onChange={(e) => setFormData({...formData, asset_type: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-purple-500/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem'
                      }}
                    >
                      <option value="">Selecciona el tipo</option>
                      <option value="real_estate">Bienes Raíces</option>
                      <option value="commodity">Commodity</option>
                      <option value="art">Arte</option>
                      <option value="bond">Bono</option>
                      <option value="equity">Equity</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-gray-300 mb-2">
                      Descripción *
                    </label>
                    <textarea
                      id="description"
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-purple-500/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Describe tu activo en detalle..."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="value_usd" className="block text-gray-300 mb-2">
                        Valor (USD) *
                      </label>
                      <input
                        id="value_usd"
                        type="number"
                        required
                        step="0.01"
                        value={formData.value_usd}
                        onChange={(e) => setFormData({...formData, value_usd: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-purple-500/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="50000000"
                      />
                    </div>

                    <div>
                      <label htmlFor="location" className="block text-gray-300 mb-2">
                        Ubicación *
                      </label>
                      <input
                        id="location"
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-purple-500/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Manhattan, Nueva York"
                      />
                    </div>
                  </div>
                </div>

                {/* Token Info */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
                    Detalles de Tokenización
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="token_symbol" className="block text-gray-300 mb-2">
                        Símbolo del Token *
                      </label>
                      <input
                        id="token_symbol"
                        type="text"
                        required
                        value={formData.token_symbol}
                        onChange={(e) => setFormData({...formData, token_symbol: e.target.value.toUpperCase()})}
                        className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-purple-500/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="TMPZ"
                        maxLength={10}
                      />
                    </div>

                    <div>
                      <label htmlFor="blockchain" className="block text-gray-300 mb-2">
                        Blockchain *
                      </label>
                      <select
                        id="blockchain"
                        required
                        value={formData.blockchain}
                        onChange={(e) => setFormData({...formData, blockchain: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-purple-500/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                          backgroundPosition: 'right 0.5rem center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '1.5em 1.5em',
                          paddingRight: '2.5rem'
                        }}
                      >
                        <option value="ethereum">Ethereum</option>
                        <option value="polygon">Polygon</option>
                        <option value="avalanche">Avalanche</option>
                        <option value="binance">Binance Smart Chain</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="total_supply" className="block text-gray-300 mb-2">
                        Supply Total *
                      </label>
                      <input
                        id="total_supply"
                        type="number"
                        required
                        value={formData.total_supply}
                        onChange={(e) => setFormData({...formData, total_supply: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-purple-500/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="5000000"
                      />
                    </div>

                    <div>
                      <label htmlFor="price_per_token" className="block text-gray-300 mb-2">
                        Precio por Token (USD) *
                      </label>
                      <input
                        id="price_per_token"
                        type="number"
                        required
                        step="0.01"
                        value={formData.price_per_token}
                        onChange={(e) => setFormData({...formData, price_per_token: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-purple-500/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="10.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="token_name" className="block text-gray-300 mb-2">
                      Nombre del Token *
                    </label>
                    <input
                      id="token_name"
                      type="text"
                      required
                      value={formData.token_name}
                      onChange={(e) => setFormData({...formData, token_name: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-purple-500/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Torre Manhattan Plaza Token"
                    />
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 qpc-gradient text-white py-6 text-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creando Asset...
                      </>
                    ) : (
                      "Crear Asset"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </PageLayout>
    </ProtectedRoute>
  );
}
