"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageLayout } from "@/components/page-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { v4 as uuidv4 } from 'uuid';
import { AIAdvisorPanel } from "@/components/ai-advisor-panel";
import { NativeSelect } from "@/components/native-select";

export default function CreateAssetPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    asset_type: "",
    description: "",
    value_usd: "",
    location: "",
    legal_documents: "",
    token_symbol: "",
    total_supply: "",
    price_per_token: "",
    blockchain: "ethereum"
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) {
        toast.error("Debes iniciar sesión para crear un asset");
        return;
      }

      // Crear el asset en Supabase
      const assetId = uuidv4();
      const { data: asset, error: assetError } = await supabase
        .from('rwa_assets')
        .insert([
          {
            id: assetId,
            name: formData.name,
            asset_type: formData.asset_type,
            description: formData.description,
            value_usd: parseFloat(formData.value_usd),
            location: formData.location,
            legal_documents: formData.legal_documents || null,
            status: 'pending',
            owner_id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ])
        .select();

      if (assetError) throw assetError;

      // Crear el token asociado
      const tokenId = uuidv4();
      const { data: token, error: tokenError } = await supabase
        .from('tokens')
        .insert([
          {
            id: tokenId,
            asset_id: assetId,
            token_symbol: formData.token_symbol.toUpperCase(),
            total_supply: parseInt(formData.total_supply),
            available_supply: parseInt(formData.total_supply),
            price_per_token: parseFloat(formData.price_per_token),
            blockchain_network: formData.blockchain,
            contract_address: null, // Se generará después
            created_at: new Date().toISOString(),
          }
        ])
        .select();

      if (tokenError) throw tokenError;

      toast.success("¡Asset creado exitosamente!");
      
      // Reset form
      setFormData({
        name: "",
        asset_type: "",
        description: "",
        value_usd: "",
        location: "",
        legal_documents: "",
        token_symbol: "",
        total_supply: "",
        price_per_token: "",
        blockchain: "ethereum"
      });

      // Redirect to dashboard after 1 second
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
      
    } catch (error: any) {
      console.error('Error creating asset:', error);
      toast.error(error.message || "Error al crear el asset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <PageLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Crear Asset
            </h1>
            <p className="text-gray-400">Tokeniza un nuevo activo del mundo real</p>
          </div>

          {/* AI Advisor Panel */}
          <div className="mb-8">
            <AIAdvisorPanel
              assetType={formData.asset_type}
              description={formData.description}
              valueUsd={formData.value_usd}
              location={formData.location}
            />
          </div>

        <div className="max-w-3xl mx-auto">
          <Card className="glass-effect border-purple-500/20">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Asset Details */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Detalles del Asset</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-300">Nombre del Asset *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="bg-slate-900/50 border-purple-500/20 text-white"
                        placeholder="Ej: Edificio Comercial Manhattan"
                      />
                    </div>

                    <div>
                      <Label htmlFor="asset_type" className="text-gray-300">Tipo de Asset *</Label>
                      {!mounted ? (
                        <div className="h-10 bg-slate-900/50 border border-purple-500/20 rounded-md animate-pulse"></div>
                      ) : (
                      <Select
                        value={formData.asset_type}
                        onValueChange={(value) => setFormData({...formData, asset_type: value})}
                      >
                        <SelectTrigger className="bg-slate-900/50 border-purple-500/20 text-white">
                          <SelectValue placeholder="Selecciona el tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="real_estate">Bienes Raíces</SelectItem>
                          <SelectItem value="commodity">Commodity</SelectItem>
                          <SelectItem value="art">Arte</SelectItem>
                          <SelectItem value="bond">Bono</SelectItem>
                          <SelectItem value="equity">Equity</SelectItem>
                          <SelectItem value="other">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-gray-300">Descripción *</Label>
                      <Textarea
                        id="description"
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="bg-slate-900/50 border-purple-500/20 text-white"
                        placeholder="Descripción detallada del activo"
                        rows={4}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="value_usd" className="text-gray-300">Valor del Asset (USD) *</Label>
                        <Input
                          id="value_usd"
                          type="number"
                          required
                          value={formData.value_usd}
                          onChange={(e) => setFormData({...formData, value_usd: e.target.value})}
                          className="bg-slate-900/50 border-purple-500/20 text-white"
                          placeholder="10000000"
                        />
                      </div>

                      <div>
                        <Label htmlFor="location" className="text-gray-300">Ubicación *</Label>
                        <Input
                          id="location"
                          required
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          className="bg-slate-900/50 border-purple-500/20 text-white"
                          placeholder="Nueva York, USA"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tokenization Details */}
                <div className="pt-6 border-t border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-4">Detalles de Tokenización</h3>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="token_symbol" className="text-gray-300">Símbolo del Token *</Label>
                        <Input
                          id="token_symbol"
                          required
                          value={formData.token_symbol}
                          onChange={(e) => setFormData({...formData, token_symbol: e.target.value})}
                          className="bg-slate-900/50 border-purple-500/20 text-white"
                          placeholder="MCB"
                          maxLength={10}
                        />
                      </div>

                      <div>
                        <Label htmlFor="blockchain" className="text-gray-300">Blockchain *</Label>
                        {!mounted ? (
                          <div className="h-10 bg-slate-900/50 border border-purple-500/20 rounded-md animate-pulse"></div>
                        ) : (
                        <Select
                          value={formData.blockchain}
                          onValueChange={(value) => setFormData({...formData, blockchain: value})}
                        >
                          <SelectTrigger className="bg-slate-900/50 border-purple-500/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ethereum">Ethereum</SelectItem>
                            <SelectItem value="polygon">Polygon</SelectItem>
                            <SelectItem value="avalanche">Avalanche</SelectItem>
                            <SelectItem value="binance">Binance Smart Chain</SelectItem>
                          </SelectContent>
                        </Select>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="total_supply" className="text-gray-300">Supply Total *</Label>
                        <Input
                          id="total_supply"
                          type="number"
                          required
                          min="1"
                          value={formData.total_supply}
                          onChange={(e) => setFormData({...formData, total_supply: e.target.value})}
                          className="bg-slate-900/50 border-purple-500/20 text-white"
                          placeholder="1000000"
                        />
                      </div>

                      <div>
                        <Label htmlFor="price_per_token" className="text-gray-300">Precio por Token (USD) *</Label>
                        <Input
                          id="price_per_token"
                          type="number"
                          step="0.01"
                          required
                          min="0.01"
                          value={formData.price_per_token}
                          onChange={(e) => setFormData({...formData, price_per_token: e.target.value})}
                          className="bg-slate-900/50 border-purple-500/20 text-white"
                          placeholder="10.00"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="qpc-gradient text-white flex-1"
                  >
                    {loading && <Loader2 className="mr-2 animate-spin" size={18} />}
                    {loading ? "Creando..." : "Crear Asset"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/dashboard")}
                    className="border-purple-500/30 text-white hover:bg-purple-500/10"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </PageLayout>
    </ProtectedRoute>
  );
}
