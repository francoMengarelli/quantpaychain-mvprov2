import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('checking');
  const [paymentData, setPaymentData] = useState(null);
  const sessionId = searchParams.get('session_id');
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const API = `${BACKEND_URL}/api`;

  useEffect(() => {
    if (sessionId) {
      pollPaymentStatus();
    }
  }, [sessionId]);

  const pollPaymentStatus = async (attempts = 0) => {
    const maxAttempts = 5;
    
    if (attempts >= maxAttempts) {
      setStatus('timeout');
      return;
    }

    try {
      const response = await axios.get(
        `${API}/payments/status/${sessionId}`,
        { withCredentials: true }
      );

      setPaymentData(response.data);

      if (response.data.payment_status === 'paid') {
        setStatus('success');
      } else if (response.data.status === 'expired') {
        setStatus('failed');
      } else {
        // Continue polling
        setTimeout(() => pollPaymentStatus(attempts + 1), 2000);
      }
    } catch (error) {
      console.error('Error checking payment:', error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen" data-testid="payment-success-page">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        <Card className="glass" data-testid="payment-status-card">
          <CardContent className="p-12 text-center">
            {status === 'checking' && (
              <div data-testid="status-checking">
                <Loader2 className="animate-spin h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Verificando Pago...</h2>
                <p className="text-gray-600">Por favor espera mientras confirmamos tu transacción</p>
              </div>
            )}

            {status === 'success' && (
              <div className="fade-in" data-testid="status-success">
                <CheckCircle className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2 text-emerald-600">¡Pago Exitoso!</h2>
                <p className="text-gray-600 mb-6">
                  Tu compra de tokens ha sido completada exitosamente.
                </p>
                
                {paymentData && (
                  <div className="bg-emerald-50 rounded-xl p-6 mb-6 text-left">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Monto Total:</span>
                      <span className="font-bold">${(paymentData.amount_total / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <span className="font-bold text-emerald-600">Pagado</span>
                    </div>
                  </div>
                )}

                <div className="flex space-x-4">
                  <Button
                    onClick={() => navigate('/portfolio')}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-500 text-white"
                    data-testid="view-portfolio-btn"
                  >
                    Ver Mi Portfolio
                  </Button>
                  <Button
                    onClick={() => navigate('/marketplace')}
                    variant="outline"
                    className="flex-1"
                    data-testid="back-marketplace-btn"
                  >
                    Volver al Marketplace
                  </Button>
                </div>
              </div>
            )}

            {status === 'failed' && (
              <div className="fade-in" data-testid="status-failed">
                <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2 text-red-600">Pago Fallido</h2>
                <p className="text-gray-600 mb-6">
                  No se pudo completar el pago. Por favor intenta nuevamente.
                </p>
                <Button
                  onClick={() => navigate('/marketplace')}
                  className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white"
                  data-testid="retry-btn"
                >
                  Intentar Nuevamente
                </Button>
              </div>
            )}

            {status === 'timeout' && (
              <div className="fade-in" data-testid="status-timeout">
                <XCircle className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2 text-yellow-600">Tiempo Agotado</h2>
                <p className="text-gray-600 mb-6">
                  No pudimos verificar el estado del pago. Por favor revisa tu email de confirmación.
                </p>
                <Button
                  onClick={() => navigate('/portfolio')}
                  className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white"
                  data-testid="check-portfolio-btn"
                >
                  Revisar Portfolio
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="fade-in" data-testid="status-error">
                <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2 text-red-600">Error</h2>
                <p className="text-gray-600 mb-6">
                  Ocurrió un error al verificar el pago. Por favor contacta soporte.
                </p>
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white"
                  data-testid="go-dashboard-btn"
                >
                  Ir al Dashboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
