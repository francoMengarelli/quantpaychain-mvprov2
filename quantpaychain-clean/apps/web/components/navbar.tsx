"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { WalletButton } from "./wallet-button";
import { Button } from "./ui/button";
import { Network, Menu, User, LogOut } from "lucide-react";
import { useState, memo } from "react";
import { useAuth } from "@/hooks/useAuth";

interface NavbarProps {
  showWalletButton?: boolean;
}

function NavbarComponent({ showWalletButton = false }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuth();
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
                Marketplace
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                Dashboard
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                Docs
              </Button>
            </Link>
            
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <User size={16} />
                  <span>{user?.email?.split('@')[0]}</span>
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
            
            <WalletButton />
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
              Marketplace
            </Link>
            <Link href="/dashboard" className="block px-4 py-2 text-gray-300 hover:bg-purple-500/10 rounded">
              Dashboard
            </Link>
            <Link href="/docs" className="block px-4 py-2 text-gray-300 hover:bg-purple-500/10 rounded">
              Docs
            </Link>
            
            {isAuthenticated ? (
              <>
                <div className="px-4 py-2 text-gray-300 text-sm flex items-center gap-2">
                  <User size={16} />
                  <span>{user?.email?.split('@')[0]}</span>
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
            
            <div className="px-4 py-2">
              <WalletButton />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export const Navbar = memo(NavbarComponent);
