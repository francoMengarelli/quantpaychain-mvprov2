import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Package, ShoppingCart, Activity } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const API = `${BACKEND_URL}/api`;

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/dashboard/stats`, {
        withCredentials: true
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" data-testid="dashboard-page">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8 fade-in">
          <h1 className="text-4xl font-bold mb-2" data-testid="dashboard-title">Dashboard</h1>
          <p className="text-gray-600">Resumen de tu actividad en QuantPayChain</p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="glass animate-pulse">
                <CardHeader className="pb-3">
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 fade-in">
            <Card className="glass hover:shadow-xl transition-all" data-testid="stat-card-assets">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                  <Package className="mr-2 text-blue-600" size={18} />
                  Mis Activos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{stats?.my_assets || 0}</div>
              </CardContent>
            </Card>

            <Card className="glass hover:shadow-xl transition-all" data-testid="stat-card-invested">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                  <TrendingUp className="mr-2 text-emerald-600" size={18} />
                  Total Invertido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600">
                  ${stats?.total_invested?.toFixed(2) || '0.00'}
                </div>
              </CardContent>
            </Card>

            <Card className="glass hover:shadow-xl transition-all" data-testid="stat-card-transactions">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                  <Activity className="mr-2 text-blue-600" size={18} />
                  Transacciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{stats?.transactions_count || 0}</div>
              </CardContent>
            </Card>

            <Card className="glass hover:shadow-xl transition-all" data-testid="stat-card-available">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                  <ShoppingCart className="mr-2 text-emerald-600" size={18} />
                  Tokens Disponibles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600">{stats?.available_tokens || 0}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 glass rounded-3xl p-8" data-testid="quick-actions">
          <h2 className="text-2xl font-bold mb-6">Acciones Rápidas</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <a
              href="/marketplace"
              className="block p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all"
              data-testid="action-marketplace"
            >
              <ShoppingCart className="text-blue-600 mb-3" size={28} />
              <h3 className="font-bold text-lg mb-1">Explorar Marketplace</h3>
              <p className="text-sm text-gray-600">Compra tokens de activos tokenizados</p>
            </a>

            <a
              href="/create-asset"
              className="block p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 transition-all"
              data-testid="action-create"
            >
              <Package className="text-emerald-600 mb-3" size={28} />
              <h3 className="font-bold text-lg mb-1">Crear Activo</h3>
              <p className="text-sm text-gray-600">Tokeniza un nuevo activo del mundo real</p>
            </a>

            <a
              href="/reports"
              className="block p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-emerald-100 hover:from-blue-100 hover:to-emerald-200 transition-all"
              data-testid="action-reports"
            >
              <Activity className="text-blue-600 mb-3" size={28} />
              <h3 className="font-bold text-lg mb-1">Ver Reportes</h3>
              <p className="text-sm text-gray-600">Genera reportes ISO 20022</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
