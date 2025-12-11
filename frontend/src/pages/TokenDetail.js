import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ShoppingCart, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const TokenDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [asset, setAsset] = useState(null);
  const [blockchains, setBlockchains] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedBlockchain, setSelectedBlockchain] = useState('');
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
  const API = BACKEND_URL.endsWith('/api') ? BACKEND_URL : `${BACKEND_URL}/api`;

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tokenRes, blockchainsRes] = await Promise.all([
        axios.get(`${API}/tokens/${id}`),
        axios.get(`${API}/blockchains`)
      ]);
      
      setToken(tokenRes.data);
      setBlockchains(blockchainsRes.data);
      setSelectedBlockchain(tokenRes.data.blockchain_network);
      
      // Fetch asset details
      const assetRes = await axios.get(`${API}/assets/${tokenRes.data.asset_id}`);
      setAsset(assetRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error al cargar detalles del token');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (quantity < 1 || quantity > token.available_supply) {
      toast.error('Cantidad inválida');
      return;
    }

    try {
      setPurchasing(true);
      const originUrl = window.location.origin;
      
      const response = await axios.post(
        `${API}/payments/checkout`,
        {
          token_id: token.id,
          quantity: parseInt(quantity),
          origin_url: originUrl
        },
        { withCredentials: true }
      );

      // Redirect to Stripe
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Error al procesar la compra');
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-300 rounded-3xl"></div>
              <div className="h-96 bg-gray-300 rounded-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 pb-12 px-4 text-center">
          <p className="text-xl text-gray-600">Token no encontrado</p>
        </div>
      </div>
    );
  }

  const blockchain = blockchains.find(b => b.id === token.blockchain_network);
  const totalPrice = token.price_per_token * quantity;

  return (
    <div className="min-h-screen" data-testid="token-detail-page">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/marketplace')}
          className="mb-6"
          data-testid="back-btn"
        >
          <ArrowLeft className="mr-2" size={18} />
          Volver al Marketplace
        </Button>

        <div className="grid lg:grid-cols-2 gap-8 fade-in">
          {/* Token Info */}
          <Card className="glass" data-testid="token-info-card">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                  {token.token_symbol}
                </h1>
                {blockchain && (
                  <div className="text-3xl" title={blockchain.name}>
                    {blockchain.icon}
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Precio por Token:</span>
                  <span className="text-xl font-bold text-blue-600">${token.price_per_token.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Disponibles:</span>
                  <span className="text-xl font-bold">{token.available_supply.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Total Supply:</span>
                  <span className="text-xl font-bold">{token.total_supply.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Blockchain:</span>
                  <span className="font-semibold">{blockchain?.name}</span>
                </div>
                
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600">Contract Address:</span>
                  <span className="font-mono text-xs">{token.contract_address.substring(0, 10)}...</span>
                </div>
              </div>

              {asset && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <h3 className="font-bold mb-2">Activo Subyacente</h3>
                  <p className="text-sm text-gray-700 mb-1"><strong>Nombre:</strong> {asset.name}</p>
                  <p className="text-sm text-gray-700 mb-1"><strong>Tipo:</strong> {asset.asset_type}</p>
                  <p className="text-sm text-gray-700 mb-1"><strong>Valor:</strong> ${asset.value_usd.toLocaleString()}</p>
                  <p className="text-sm text-gray-700"><strong>Descripción:</strong> {asset.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Purchase Form */}
          <Card className="glass" data-testid="purchase-form-card">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">Comprar Tokens</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Cantidad</label>
                  <Input
                    type="number"
                    min="1"
                    max={token.available_supply}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="text-lg"
                    data-testid="quantity-input"
                  />
                  <p className="text-xs text-gray-500 mt-1">Máximo: {token.available_supply.toLocaleString()}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Blockchain</label>
                  <Select value={selectedBlockchain} onValueChange={setSelectedBlockchain}>
                    <SelectTrigger data-testid="blockchain-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {blockchains.map(chain => (
                        <SelectItem key={chain.id} value={chain.id}>
                          {chain.icon} {chain.name} (Fee: ~${chain.gas_fee_estimate})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    Elige la blockchain donde deseas recibir los tokens
                  </p>
                </div>

                <div className="p-4 bg-emerald-50 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Subtotal:</span>
                    <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Gas Fee (estimado):</span>
                    <span className="font-semibold">
                      ${blockchains.find(b => b.id === selectedBlockchain)?.gas_fee_estimate.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-emerald-200">
                    <span className="font-bold">Total:</span>
                    <span className="text-xl font-bold text-emerald-600">
                      ${(totalPrice + (blockchains.find(b => b.id === selectedBlockchain)?.gas_fee_estimate || 0)).toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white py-6 text-lg"
                  onClick={handlePurchase}
                  disabled={purchasing || quantity < 1 || quantity > token.available_supply}
                  data-testid="purchase-btn"
                >
                  {purchasing ? (
                    'Procesando...'
                  ) : (
                    <>
                      <ShoppingCart className="mr-2" size={20} />
                      Comprar Ahora
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-gray-500">
                  Serás redirigido a Stripe para completar el pago de forma segura
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TokenDetail;
