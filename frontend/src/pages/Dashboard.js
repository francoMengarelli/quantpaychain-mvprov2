import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Package, ShoppingCart, Activity, Wallet, FileText, PieChart, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
  const API = BACKEND_URL.endsWith('/api') ? BACKEND_URL : `${BACKEND_URL}/api`;

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

  const statCards = [
    {
      title: 'Mis Activos',
      value: stats?.my_assets || 0,
      icon: Package,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-400'
    },
    {
      title: 'Total Invertido',
      value: `$${stats?.total_invested?.toFixed(2) || '0.00'}`,
      icon: TrendingUp,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-400'
    },
    {
      title: 'Transacciones',
      value: stats?.transactions_count || 0,
      icon: Activity,
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-500/10',
      textColor: 'text-cyan-400'
    },
    {
      title: 'Tokens Disponibles',
      value: stats?.available_tokens || 0,
      icon: Wallet,
      color: 'from-violet-500 to-violet-600',
      bgColor: 'bg-violet-500/10',
      textColor: 'text-violet-400'
    }
  ];

  const quickActions = [
    {
      title: 'Explorar Marketplace',
      description: 'Compra tokens de activos tokenizados',
      href: '/marketplace',
      icon: ShoppingCart,
      color: 'from-purple-600 to-blue-600'
    },
    {
      title: 'Crear Activo',
      description: 'Tokeniza un nuevo activo del mundo real',
      href: '/create-asset',
      icon: Package,
      color: 'from-emerald-600 to-cyan-600'
    },
    {
      title: 'Ver Reportes',
      description: 'Genera reportes ISO 20022',
      href: '/reports',
      icon: FileText,
      color: 'from-violet-600 to-purple-600'
    },
    {
      title: 'Ganancias',
      description: 'Ver dividendos y ROI',
      href: '/earnings',
      icon: PieChart,
      color: 'from-cyan-600 to-blue-600'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0118]" data-testid="dashboard-page">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2" data-testid="dashboard-title">Dashboard</h1>
          <p className="text-gray-400">Resumen de tu actividad en QuantPayChain</p>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="bg-[#1a0a2e]/50 border-purple-500/20 animate-pulse">
                <CardHeader className="pb-3">
                  <div className="h-4 bg-purple-500/20 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-purple-500/20 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
              <Card 
                key={index}
                className="bg-[#1a0a2e]/50 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
                data-testid={`stat-card-${index}`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-sm font-medium text-gray-400">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mr-3`}>
                      <stat.icon className="text-white" size={16} />
                    </div>
                    {stat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-white mb-6">Acciones Rápidas</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="quick-actions">
            {quickActions.map((action, index) => (
              <a
                key={index}
                href={action.href}
                className="group relative bg-[#1a0a2e]/50 border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all duration-300 overflow-hidden"
                data-testid={`action-${index}`}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4`}>
                  <action.icon className="text-white" size={24} />
                </div>
                
                <h3 className="font-semibold text-white mb-1 flex items-center">
                  {action.title}
                  <ArrowUpRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-sm text-gray-400">{action.description}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="mt-12">
          <Card className="bg-[#1a0a2e]/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Activity className="mr-2 h-5 w-5 text-purple-400" />
                Actividad Reciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-400">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>No hay actividad reciente</p>
                <p className="text-sm mt-2">Tus transacciones aparecerán aquí</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
