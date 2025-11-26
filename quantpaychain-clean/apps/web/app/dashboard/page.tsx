"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageLayout } from "@/components/page-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { TrendingUp, Wallet, FileText, Activity, Plus, User, Building2, Loader2, ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import Link from "next/link";

interface Asset {
  id: string;
  name: string;
  asset_type: string;
  description: string;
  value_usd: number;
  location: string;
  status: string;
  created_at: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalValue: 0,
    totalAssets: 0,
    activeAssets: 0
  });

  useEffect(() => {
    if (user) {
      fetchUserAssets();
    }
  }, [user]);

  const fetchUserAssets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('rwa_assets')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAssets(data || []);
      
      // Calculate stats
      const totalValue = data?.reduce((sum, asset) => sum + Number(asset.value_usd), 0) || 0;
      const activeAssets = data?.filter(asset => asset.status === 'active').length || 0;
      
      setStats({
        totalValue,
        totalAssets: data?.length || 0,
        activeAssets
      });
    } catch (error: any) {
      console.error('Error fetching assets:', error);
      toast.error('Error al cargar tus assets');
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

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { bg: string; text: string; label: string }> = {
      'pending': { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: 'Pendiente' },
      'active': { bg: 'bg-green-500/10', text: 'text-green-400', label: 'Activo' },
      'sold': { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'Vendido' },
      'inactive': { bg: 'bg-gray-500/10', text: 'text-gray-400', label: 'Inactivo' }
    };
    const variant = variants[status] || variants['pending'];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variant.bg} ${variant.text}`}>
        {variant.label}
      </span>
    );
  };

  return (
    <ProtectedRoute>
      <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Bienvenido, {user?.user_metadata?.name || user?.email?.split('@')[0]}
                </h1>
                <p className="text-gray-400">Tu portafolio y resumen de inversiones</p>
              </div>
              <Link href="/create-asset">
                <Button className="qpc-gradient text-white">
                  <Plus className="mr-2" size={18} />
                  Crear Asset
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="glass-effect border-purple-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Value</CardTitle>
                <Wallet className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">$0.00</div>
                <p className="text-xs text-gray-500 mt-1">Connect wallet to see balance</p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-purple-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Assets Owned</CardTitle>
                <FileText className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">0</div>
                <p className="text-xs text-gray-500 mt-1">No assets yet</p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-purple-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Earnings</CardTitle>
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">$0.00</div>
                <p className="text-xs text-emerald-500 mt-1">+0%</p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-purple-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Active Investments</CardTitle>
                <Activity className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">0</div>
                <p className="text-xs text-gray-500 mt-1">No active investments</p>
              </CardContent>
            </Card>
          </div>

          {/* User Info Card */}
          <Card className="glass-effect border-purple-500/20 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Información de la Cuenta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Estado de la cuenta</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                    Verificada
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Miembro desde</p>
                  <p className="text-white">{new Date(user?.created_at || '').toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Getting Started */}
          <Card className="glass-effect border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Comienza a Tokenizar</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-6">
                ¿Listo para tokenizar tus primeros activos del mundo real? Empieza creando tu primer asset.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <Link href="/create-asset" className="block">
                  <Card className="glass-effect border-purple-500/10 hover:border-purple-500/30 transition-colors cursor-pointer h-full">
                    <CardContent className="p-6">
                      <FileText className="h-8 w-8 text-purple-400 mb-3" />
                      <h4 className="text-white font-semibold mb-2">Crear Asset</h4>
                      <p className="text-sm text-gray-400">Tokeniza un activo del mundo real</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/marketplace" className="block">
                  <Card className="glass-effect border-purple-500/10 hover:border-purple-500/30 transition-colors cursor-pointer h-full">
                    <CardContent className="p-6">
                      <Activity className="h-8 w-8 text-blue-400 mb-3" />
                      <h4 className="text-white font-semibold mb-2">Explorar Marketplace</h4>
                      <p className="text-sm text-gray-400">Descubre assets disponibles</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/docs" className="block">
                  <Card className="glass-effect border-purple-500/10 hover:border-purple-500/30 transition-colors cursor-pointer h-full">
                    <CardContent className="p-6">
                      <FileText className="h-8 w-8 text-green-400 mb-3" />
                      <h4 className="text-white font-semibold mb-2">Documentación</h4>
                      <p className="text-sm text-gray-400">Aprende cómo funciona</p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
    </ProtectedRoute>
  );
}
