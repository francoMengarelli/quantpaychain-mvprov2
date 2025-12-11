import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, TrendingUp, Coins, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';

const Marketplace = () => {
  const [tokens, setTokens] = useState([]);
  const [blockchains, setBlockchains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlockchain, setSelectedBlockchain] = useState('all');
  const navigate = useNavigate();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
  const API = BACKEND_URL.endsWith('/api') ? BACKEND_URL : `${BACKEND_URL}/api`;

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
    <div className="min-h-screen bg-[#0a0118]" data-testid="marketplace-page">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2" data-testid="marketplace-title">Marketplace</h1>
          <p className="text-gray-400">Explora y compra tokens de activos del mundo real</p>
        </div>

        {/* Filters */}
        <div className="bg-[#1a0a2e]/50 border border-purple-500/20 rounded-2xl p-6 mb-8" data-testid="filters-section">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Buscar por símbolo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#1a0a2e] border-purple-500/30 text-white placeholder:text-gray-500 focus:border-purple-500"
                data-testid="search-input"
              />
            </div>
            
            <Select value={selectedBlockchain} onValueChange={setSelectedBlockchain}>
              <SelectTrigger 
                className="bg-[#1a0a2e] border-purple-500/30 text-white"
                data-testid="blockchain-filter"
              >
                <SelectValue placeholder="Seleccionar blockchain" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a0a2e] border-purple-500/30 text-white">
                <SelectItem value="all" className="text-white hover:bg-purple-500/20">Todas las Blockchains</SelectItem>
                {blockchains.map(chain => (
                  <SelectItem key={chain.id} value={chain.id} className="text-white hover:bg-purple-500/20">
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
              <Card key={i} className="bg-[#1a0a2e]/50 border-purple-500/20 animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-purple-500/20 rounded w-1/2 mb-4"></div>
                  <div className="h-6 bg-purple-500/20 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-purple-500/20 rounded w-full mb-4"></div>
                  <div className="h-10 bg-purple-500/20 rounded w-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredTokens.length === 0 ? (
          <div className="text-center py-12 bg-[#1a0a2e]/50 border border-purple-500/20 rounded-2xl" data-testid="no-tokens">
            <Coins className="h-12 w-12 mx-auto mb-4 text-purple-400 opacity-50" />
            <p className="text-gray-400 text-lg">No se encontraron tokens</p>
            <p className="text-gray-500 text-sm mt-2">Intenta con otros filtros</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="tokens-grid">
            {filteredTokens.map(token => {
              const blockchain = blockchains.find(b => b.id === token.blockchain_network);
              return (
                <Card
                  key={token.id}
                  className="group bg-[#1a0a2e]/50 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 cursor-pointer overflow-hidden"
                  onClick={() => navigate(`/token/${token.id}`)}
                  data-testid={`token-card-${token.id}`}
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        {token.token_symbol}
                      </div>
                      {blockchain && (
                        <div className="text-xl bg-purple-500/20 p-2 rounded-lg" title={blockchain.name}>
                          {blockchain.icon}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Precio por Token:</span>
                        <span className="font-semibold text-white">${token.price_per_token.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Disponibles:</span>
                        <span className="font-semibold text-emerald-400">{token.available_supply.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Supply:</span>
                        <span className="font-semibold text-white">{token.total_supply.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/token/${token.id}`);
                      }}
                      data-testid={`view-token-btn-${token.id}`}
                    >
                      <TrendingUp className="mr-2" size={18} />
                      Ver Detalles
                      <ArrowUpRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
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
