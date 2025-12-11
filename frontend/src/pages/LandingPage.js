import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Shield, 
  Coins, 
  Globe, 
  FileCheck, 
  Network, 
  Brain,
  Sparkles,
  Wallet,
  CheckCircle2
} from 'lucide-react';

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
      <div className="min-h-screen bg-[#0a0118] flex items-center justify-center">
        <div className="text-purple-400 text-xl animate-pulse">Cargando...</div>
      </div>
    );
  }

  const stats = [
    { value: 'Más de 24 mil millones de dólares', label: 'Mercado de RWA 2024', highlight: true },
    { value: '10K+', label: 'Capacidad TPS' },
    { value: '99.99%', label: 'Acuerdo de nivel de servicio de tiempo de actividad' },
    { value: '6+', label: 'Cadenas de bloques' },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Seguridad post-cuántica',
      description: 'Criptografía aprobada por el NIST resistente a ataques de computación cuántica, utilizando algoritmos CRYSTALS-Dilithium y SPHINCS+.',
      badge: 'Certificado de calidad del NIST',
      badgeIcon: CheckCircle2,
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Coins,
      title: 'Tokenización de RWA',
      description: 'Transforme activos del mundo real en valores digitales con propiedad fraccionada y distribución automatizada.',
      badge: 'Activos',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Globe,
      title: 'Pagos en múltiples divisas',
      description: 'Infraestructura de transacciones transfronterizas para múltiples monedas fiduciarias y criptomonedas con liquidación instantánea.',
      badge: '6+',
      badgeLabel: 'Cadenas de bloques',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      icon: FileCheck,
      title: 'Norma ISO 20022',
      description: 'Integración con la infraestructura de mensajería financiera global para la conectividad financiera tradicional.',
      badge: 'Puente',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Network,
      title: 'Protocolo entre cadenas',
      description: 'Puente interoperable para conectar con Ethereum, Polygon, Avalanche y otras blockchains importantes.',
      badge: 'Multicadena',
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      icon: Brain,
      title: 'Análisis impulsado por IA',
      description: 'Análisis impulsado por GPT-4 para validación de activos, evaluación de riesgos e informes automatizados.',
      badge: 'GPT-4',
      color: 'from-violet-500 to-violet-600'
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0118] text-white overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0118]/80 backdrop-blur-xl border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-purple-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Cadena QuantiPay
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Mercado</a>
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Panel</a>
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Documentos</a>
            </div>

            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                className="border-purple-500 text-purple-400 hover:bg-purple-500/20"
                onClick={handleLogin}
              >
                Iniciar sesión
              </Button>
              <Button 
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                onClick={handleLogin}
              >
                <Wallet className="mr-2 h-4 w-4" />
                Conectar billetera
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-16">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full filter blur-[128px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full filter blur-[128px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-purple-900/20 to-transparent rounded-full"></div>
        </div>

        <div className="relative max-w-6xl mx-auto text-center z-10">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-8">
            <Sparkles className="h-4 w-4 text-purple-400 mr-2" />
            <span className="text-sm text-purple-300">Seguridad post-cuántica • Cumple con la norma ISO 20022</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-purple-400 italic">El futuro de</span>
            <br />
            <span className="text-white">la tokenización de activos</span>
          </h1>
          
          <p className="text-lg text-gray-400 mb-8 max-w-3xl mx-auto">
            Plataforma empresarial que combina <span className="text-purple-400">criptografía postcuántica</span> con
            tokenización de activos del mundo real para finanzas institucionales.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-6 text-lg"
              onClick={handleLogin}
            >
              Crear cuenta gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800/50 px-8 py-6 text-lg"
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
            >
              Ver documentación
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`rounded-xl p-6 border ${
                  stat.highlight 
                    ? 'bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-500/30' 
                    : 'bg-[#1a0a2e]/50 border-purple-500/20'
                } backdrop-blur-sm`}
              >
                <div className={`text-2xl font-bold ${stat.highlight ? 'text-purple-400' : 'text-white'}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Capacidades <span className="text-purple-400 italic">básicas</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Infraestructura de nivel empresarial para la próxima generación de finanzas digitales
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-[#1a0a2e]/50 border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all duration-300 hover:bg-[#1a0a2e]/70"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{feature.description}</p>
                
                <div className="flex items-center text-sm">
                  <span className="text-purple-400">{feature.badge}</span>
                  {feature.badgeLabel && (
                    <span className="text-gray-500 ml-1">{feature.badgeLabel}</span>
                  )}
                  {feature.badgeIcon && (
                    <feature.badgeIcon className="h-4 w-4 text-emerald-400 ml-2" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-purple-900/50 to-[#1a0a2e] border border-purple-500/30 rounded-3xl p-12 text-center overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-purple-600/30 blur-[100px]"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                ¿Listo para <span className="text-purple-400 italic">transformar</span> las finanzas?
              </h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Únase a las instituciones líderes que construyen el futuro de la tokenización de activos
                con seguridad resistente a la tecnología cuántica.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8"
                  onClick={handleLogin}
                >
                  Empezar
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800/50 px-8"
                >
                  Contactar ventas
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Sparkles className="h-6 w-6 text-purple-400" />
            <span className="font-bold text-white">QuantPayChain</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2024 QuantPayChain. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
