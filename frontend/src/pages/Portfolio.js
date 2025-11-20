import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, TrendingUp, Clock } from 'lucide-react';
import { toast } from 'sonner';

const Portfolio = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const API = `${BACKEND_URL}/api`;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assetsRes, transactionsRes] = await Promise.all([
        axios.get(`${API}/assets`, { withCredentials: true }),
        axios.get(`${API}/transactions`, { withCredentials: true })
      ]);
      
      setAssets(assetsRes.data);
      setTransactions(transactionsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error al cargar portfolio');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen" data-testid="portfolio-page">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8 fade-in">
          <h1 className="text-4xl font-bold mb-2" data-testid="portfolio-title">Mi Portfolio</h1>
          <p className="text-gray-600">Gestiona tus activos y transacciones</p>
        </div>

        <Tabs defaultValue="assets" className="space-y-6">
          <TabsList className="glass" data-testid="portfolio-tabs">
            <TabsTrigger value="assets" data-testid="assets-tab">Mis Activos</TabsTrigger>
            <TabsTrigger value="transactions" data-testid="transactions-tab">Transacciones</TabsTrigger>
          </TabsList>

          {/* Assets Tab */}
          <TabsContent value="assets" className="space-y-6" data-testid="assets-content">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="glass animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-full"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : assets.length === 0 ? (
              <Card className="glass" data-testid="no-assets">
                <CardContent className="p-12 text-center">
                  <Package className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="text-gray-600 mb-4">No tienes activos aún</p>
                  <Button
                    onClick={() => navigate('/create-asset')}
                    className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white"
                    data-testid="create-first-asset-btn"
                  >
                    Crear Primer Activo
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in">
                {assets.map(asset => (
                  <Card key={asset.id} className="glass hover:shadow-xl transition-all" data-testid={`asset-card-${asset.id}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">{asset.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          asset.status === 'tokenized' ? 'bg-emerald-100 text-emerald-700' :
                          asset.status === 'active' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {asset.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tipo:</span>
                          <span className="font-semibold capitalize">{asset.asset_type}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Valor:</span>
                          <span className="font-semibold">${asset.value_usd.toLocaleString()}</span>
                        </div>
                        {asset.blockchain_network && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Blockchain:</span>
                            <span className="font-semibold capitalize">{asset.blockchain_network}</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{asset.description}</p>
                      
                      <div className="text-xs text-gray-500">
                        Creado: {formatDate(asset.created_at)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6" data-testid="transactions-content">
            {loading ? (
              <Card className="glass animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-16 bg-gray-300 rounded"></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : transactions.length === 0 ? (
              <Card className="glass" data-testid="no-transactions">
                <CardContent className="p-12 text-center">
                  <TrendingUp className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="text-gray-600 mb-4">No tienes transacciones aún</p>
                  <Button
                    onClick={() => navigate('/marketplace')}
                    className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white"
                    data-testid="browse-marketplace-btn"
                  >
                    Explorar Marketplace
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="glass fade-in">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {transactions.map(tx => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-emerald-50 hover:from-blue-100 hover:to-emerald-100 transition-all"
                        data-testid={`transaction-${tx.id}`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            tx.transaction_type === 'buy' ? 'bg-emerald-200' : 'bg-blue-200'
                          }`}>
                            {tx.transaction_type === 'buy' ? (
                              <TrendingUp className="text-emerald-700" size={24} />
                            ) : (
                              <Package className="text-blue-700" size={24} />
                            )}
                          </div>
                          
                          <div>
                            <div className="font-semibold capitalize">{tx.transaction_type}</div>
                            <div className="text-sm text-gray-600">Cantidad: {tx.quantity}</div>
                            <div className="text-xs text-gray-500 flex items-center mt-1">
                              <Clock size={12} className="mr-1" />
                              {formatDate(tx.created_at)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-xl font-bold text-emerald-600">
                            ${tx.total_amount.toFixed(2)}
                          </div>
                          <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                            tx.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                            tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {tx.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Portfolio;
