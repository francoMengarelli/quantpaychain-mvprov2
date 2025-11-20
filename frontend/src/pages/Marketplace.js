import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const Marketplace = () => {
  const [tokens, setTokens] = useState([]);
  const [blockchains, setBlockchains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlockchain, setSelectedBlockchain] = useState('all');
  const navigate = useNavigate();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const API = `${BACKEND_URL}/api`;

  useEffect(() => {
    fetchBlockchains();
    fetchTokens();
  }, [selectedBlockchain]);

  const fetchBlockchains = async () => {
    try {
      const response = await axios.get(`${API}/blockchains`);
      setBlockchains(response.data);
    } catch (error) {
      console.error('Error fetching blockchains:', error);
    }
  };

  const fetchTokens = async () => {
    try {
      setLoading(true);
      const params = selectedBlockchain !== 'all' ? `?blockchain=${selectedBlockchain}` : '';
      const response = await axios.get(`${API}/tokens${params}`);
      setTokens(response.data);
    } catch (error) {
      console.error('Error fetching tokens:', error);
      toast.error('Error al cargar tokens');
    } finally {
      setLoading(false);
    }
  };

  const filteredTokens = tokens.filter(token =>
    token.token_symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen" data-testid="marketplace-page">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8 fade-in">
          <h1 className="text-4xl font-bold mb-2" data-testid="marketplace-title">Marketplace</h1>
          <p className="text-gray-600">Explora y compra tokens de activos del mundo real</p>
        </div>

        {/* Filters */}
        <div className="glass rounded-2xl p-6 mb-8 fade-in" data-testid="filters-section">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Buscar por símbolo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="search-input"
              />
            </div>
            
            <Select value={selectedBlockchain} onValueChange={setSelectedBlockchain}>
              <SelectTrigger data-testid="blockchain-filter">
                <SelectValue placeholder="Seleccionar blockchain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Blockchains</SelectItem>
                {blockchains.map(chain => (
                  <SelectItem key={chain.id} value={chain.id}>
                    {chain.icon} {chain.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tokens Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="glass animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
                  <div className="h-10 bg-gray-300 rounded w-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredTokens.length === 0 ? (
          <div className="text-center py-12 glass rounded-2xl" data-testid="no-tokens">
            <p className="text-gray-600 text-lg">No se encontraron tokens</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in" data-testid="tokens-grid">
            {filteredTokens.map(token => {
              const blockchain = blockchains.find(b => b.id === token.blockchain_network);
              return (
                <Card
                  key={token.id}
                  className="glass hover:shadow-2xl transition-all cursor-pointer token-card"
                  onClick={() => navigate(`/token/${token.id}`)}
                  data-testid={`token-card-${token.id}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                        {token.token_symbol}
                      </div>
                      {blockchain && (
                        <div className="text-xl" title={blockchain.name}>
                          {blockchain.icon}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Precio por Token:</span>
                        <span className="font-semibold">${token.price_per_token.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Disponibles:</span>
                        <span className="font-semibold">{token.available_supply.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Supply:</span>
                        <span className="font-semibold">{token.total_supply.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/token/${token.id}`);
                      }}
                      data-testid={`view-token-btn-${token.id}`}
                    >
                      <TrendingUp className="mr-2" size={18} />
                      Ver Detalles
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
