import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Zap, Globe, TrendingUp, Lock, Users } from 'lucide-react';

const LandingPage = () => {
  const { user, login, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = () => {
    const redirectUrl = `${window.location.origin}/auth/callback`;
    login(redirectUrl);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading text-blue-600 text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4" data-testid="hero-section">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative max-w-6xl mx-auto text-center fade-in">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent" data-testid="hero-title">
            Tokeniza Activos Reales
            <br />
            en Múltiples Blockchains
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-3xl mx-auto" data-testid="hero-subtitle">
            QuantPayChain es la plataforma multicadena para tokenizar RWA (Real World Assets). 
            Compatible con ISO 20022, integrado con sistemas de pago reales.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl"
              onClick={handleLogin}
              data-testid="get-started-btn"
            >
              Comenzar Ahora
              <ArrowRight className="ml-2" size={20} />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              data-testid="learn-more-btn"
            >
              Conocer Más
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
            <div className="glass rounded-2xl p-6" data-testid="stat-blockchains">
              <div className="text-3xl font-bold text-blue-600">6+</div>
              <div className="text-sm text-gray-600 mt-1">Blockchains</div>
            </div>
            <div className="glass rounded-2xl p-6" data-testid="stat-iso">
              <div className="text-3xl font-bold text-emerald-600">ISO 20022</div>
              <div className="text-sm text-gray-600 mt-1">Compliant</div>
            </div>
            <div className="glass rounded-2xl p-6" data-testid="stat-assets">
              <div className="text-3xl font-bold text-blue-600">4</div>
              <div className="text-sm text-gray-600 mt-1">Tipos de RWA</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4" data-testid="features-section">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-4">Características Principales</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">Todo lo que necesitas para tokenizar activos del mundo real</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass rounded-3xl p-8 hover:shadow-2xl transition-all" data-testid="feature-multichain">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
                <Globe className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Multicadena</h3>
              <p className="text-gray-600">
                Elige entre Ethereum, Polygon, BSC, Solana, Avalanche y Arbitrum. Como elegir método de pago.
              </p>
            </div>

            <div className="glass rounded-3xl p-8 hover:shadow-2xl transition-all" data-testid="feature-rwa">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                <TrendingUp className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Múltiples RWA</h3>
              <p className="text-gray-600">
                Tokeniza bienes raíces, commodities, facturas y otros activos del mundo real.
              </p>
            </div>

            <div className="glass rounded-3xl p-8 hover:shadow-2xl transition-all" data-testid="feature-iso">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4">
                <Shield className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">ISO 20022</h3>
              <p className="text-gray-600">
                Reportes y mensajería financiera compatibles con estándares ISO 20022.
              </p>
            </div>

            <div className="glass rounded-3xl p-8 hover:shadow-2xl transition-all" data-testid="feature-payments">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4">
                <Zap className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Pagos Reales</h3>
              <p className="text-gray-600">
                Integrado con Stripe para procesar pagos con tarjeta y criptomonedas.
              </p>
            </div>

            <div className="glass rounded-3xl p-8 hover:shadow-2xl transition-all" data-testid="feature-security">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                <Lock className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Seguridad Avanzada</h3>
              <p className="text-gray-600">
                Autenticación OAuth con Google y sesión segura. Máxima protección de datos.
              </p>
            </div>

            <div className="glass rounded-3xl p-8 hover:shadow-2xl transition-all" data-testid="feature-ai">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
                <Users className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Análisis con IA</h3>
              <p className="text-gray-600">
                Validación y análisis de activos potenciado por inteligencia artificial.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4" data-testid="cta-section">
        <div className="max-w-4xl mx-auto glass rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">¿Listo para Comenzar?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Únete a la revolución de tokenización de activos reales. Acceso instantáneo.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white px-12 py-6 text-lg shadow-lg hover:shadow-xl"
            onClick={handleLogin}
            data-testid="cta-btn"
          >
            Crear Cuenta Gratis
            <ArrowRight className="ml-2" size={20} />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200" data-testid="footer">
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          <p>© 2025 QuantPayChain. Plataforma de tokenización RWA multicadena.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
