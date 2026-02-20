"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "./ui/button";
import { Network, Menu, User, LogOut, Shield, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { useState, memo } from "react";
import { useAuth } from "@/hooks/useAuth";

// Importar WalletButton dinámicamente para evitar cargar RainbowKit en páginas sin Web3Provider
const WalletButton = dynamic(
  () => import("./wallet-button").then((mod) => ({ default: mod.WalletButton })),
  { ssr: false }
);

interface NavbarProps {
  showWalletButton?: boolean;
}

// KYC Badge Component
function KYCBadge({ status, compact = false }: { status: string | null; compact?: boolean }) {
  if (!status) {
    return (
      <Link href="/security" className="group">
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-gray-500/20 border border-gray-500/30 hover:bg-gray-500/30 transition-colors ${compact ? 'text-xs' : 'text-xs'}`}>
          <AlertTriangle className="h-3 w-3 text-gray-400" />
          {!compact && <span className="text-gray-400">Sin KYC</span>}
        </div>
      </Link>
    );
  }

  if (status === 'APPROVED') {
    return (
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30 ${compact ? 'text-xs' : 'text-xs'}`}>
        <CheckCircle className="h-3 w-3 text-green-400" />
        {!compact && <span className="text-green-400">KYC Verificado</span>}
      </div>
    );
  }

  if (status === 'PENDING_REVIEW' || status === 'PENDING') {
    return (
      <Link href="/security" className="group">
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 hover:bg-yellow-500/30 transition-colors ${compact ? 'text-xs' : 'text-xs'}`}>
          <Clock className="h-3 w-3 text-yellow-400" />
          {!compact && <span className="text-yellow-400">KYC Pendiente</span>}
        </div>
      </Link>
    );
  }

  if (status === 'REJECTED') {
    return (
      <Link href="/security" className="group">
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-colors ${compact ? 'text-xs' : 'text-xs'}`}>
          <AlertTriangle className="h-3 w-3 text-red-400" />
          {!compact && <span className="text-red-400">KYC Rechazado</span>}
        </div>
      </Link>
    );
  }

  return null;
}

function NavbarComponent({ showWalletButton = false }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, signOut, kycStatus } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-800/50 bg-slate-950/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Network className="h-8 w-8 text-purple-500" />
            <span className="text-xl font-bold qpc-gradient-text">QuantPay Chain</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/marketplace">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                Mercado
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                Panel
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                Portafolio
              </Button>
            </Link>
            <Link href="/earnings">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                Ganancias
              </Button>
            </Link>
            <Link href="/reports">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                Reportes
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                Documentos
              </Button>
            </Link>
            <Link href="/security">
              <Button variant="ghost" className="text-gray-300 hover:text-white flex items-center gap-1">
                <Shield className="h-4 w-4 text-purple-400" />
                Seguridad
              </Button>
            </Link>
            
            {isAuthenticated ? (
              <>
                {/* User info with KYC badge */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <User size={16} />
                    <span>{user?.email?.split('@')[0]}</span>
                  </div>
                  <KYCBadge status={kycStatus.status} />
                </div>
                <Button 
                  variant="ghost" 
                  className="text-gray-300 hover:text-white"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2" size={16} />
                  Salir
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button className="qpc-gradient text-white">
                  Iniciar Sesión
                </Button>
              </Link>
            )}
            
            {showWalletButton && <WalletButton />}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 py-4 space-y-2">
            <Link href="/marketplace" className="block px-4 py-2 text-gray-300 hover:bg-purple-500/10 rounded">
              Mercado
            </Link>
            <Link href="/dashboard" className="block px-4 py-2 text-gray-300 hover:bg-purple-500/10 rounded">
              Panel
            </Link>
            <Link href="/portfolio" className="block px-4 py-2 text-gray-300 hover:bg-purple-500/10 rounded">
              Portafolio
            </Link>
            <Link href="/earnings" className="block px-4 py-2 text-gray-300 hover:bg-purple-500/10 rounded">
              Ganancias
            </Link>
            <Link href="/reports" className="block px-4 py-2 text-gray-300 hover:bg-purple-500/10 rounded">
              Reportes
            </Link>
            <Link href="/docs" className="block px-4 py-2 text-gray-300 hover:bg-purple-500/10 rounded">
              Documentos
            </Link>
            <Link href="/security" className="block px-4 py-2 text-gray-300 hover:bg-purple-500/10 rounded flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-400" />
              Seguridad
            </Link>
            
            {isAuthenticated ? (
              <>
                <div className="px-4 py-2 flex items-center justify-between">
                  <div className="text-gray-300 text-sm flex items-center gap-2">
                    <User size={16} />
                    <span>{user?.email?.split('@')[0]}</span>
                  </div>
                  <KYCBadge status={kycStatus.status} compact />
                </div>
                <button 
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-gray-300 hover:bg-purple-500/10 rounded flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Salir
                </button>
              </>
            ) : (
              <Link href="/login" className="block px-4 py-2">
                <Button className="w-full qpc-gradient text-white">
                  Iniciar Sesión
                </Button>
              </Link>
            )}
            
            {showWalletButton && (
              <div className="px-4 py-2">
                <WalletButton />
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export const Navbar = memo(NavbarComponent);
