"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageLayout } from "@/components/page-layout";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateAssetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Integrate with backend API when deployed
      toast.info("Backend API integration pending");
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Asset creation feature coming soon!");
      
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
    } catch (error) {
      toast.error("Error creating asset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Create Asset
          </h1>
          <p className="text-gray-400">Tokenize a new real-world asset</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="glass-effect border-purple-500/20">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Asset Details */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Asset Details</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-300">Asset Name *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="bg-slate-900/50 border-purple-500/20 text-white"
                        placeholder="e.g., Manhattan Commercial Building"
                      />
                    </div>

                    <div>
                      <Label htmlFor="asset_type" className="text-gray-300">Asset Type *</Label>
                      <Select
                        value={formData.asset_type}
                        onValueChange={(value) => setFormData({...formData, asset_type: value})}
                      >
                        <SelectTrigger className="bg-slate-900/50 border-purple-500/20 text-white">
                          <SelectValue placeholder="Select asset type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="real_estate">Real Estate</SelectItem>
                          <SelectItem value="commodity">Commodity</SelectItem>
                          <SelectItem value="art">Art</SelectItem>
                          <SelectItem value="bond">Bond</SelectItem>
                          <SelectItem value="equity">Equity</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-gray-300">Description *</Label>
                      <Textarea
                        id="description"
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="bg-slate-900/50 border-purple-500/20 text-white"
                        placeholder="Detailed description of the asset"
                        rows={4}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="value_usd" className="text-gray-300">Asset Value (USD) *</Label>
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
                        <Label htmlFor="location" className="text-gray-300">Location *</Label>
                        <Input
                          id="location"
                          required
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          className="bg-slate-900/50 border-purple-500/20 text-white"
                          placeholder="New York, USA"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tokenization Details */}
                <div className="pt-6 border-t border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-4">Tokenization Details</h3>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="token_symbol" className="text-gray-300">Token Symbol *</Label>
                        <Input
                          id="token_symbol"
                          required
                          value={formData.token_symbol}
                          onChange={(e) => setFormData({...formData, token_symbol: e.target.value})}
                          className="bg-slate-900/50 border-purple-500/20 text-white"
                          placeholder="MCB"
                        />
                      </div>

                      <div>
                        <Label htmlFor="blockchain" className="text-gray-300">Blockchain *</Label>
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
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="total_supply" className="text-gray-300">Total Supply *</Label>
                        <Input
                          id="total_supply"
                          type="number"
                          required
                          value={formData.total_supply}
                          onChange={(e) => setFormData({...formData, total_supply: e.target.value})}
                          className="bg-slate-900/50 border-purple-500/20 text-white"
                          placeholder="1000000"
                        />
                      </div>

                      <div>
                        <Label htmlFor="price_per_token" className="text-gray-300">Price per Token (USD) *</Label>
                        <Input
                          id="price_per_token"
                          type="number"
                          step="0.01"
                          required
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
                    Create Asset
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/dashboard")}
                    className="border-purple-500/30 text-white hover:bg-purple-500/10"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
