import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Home, ShoppingCart, Package, FileText, User, LogOut, PlusCircle, Sparkles, PieChart, Wallet } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0118]/80 backdrop-blur-xl border-b border-purple-500/20" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2" data-testid="logo-link">
            <Sparkles className="h-8 w-8 text-purple-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Cadena QuantiPay
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/dashboard" data-testid="nav-dashboard">
              <Button variant="ghost" className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-purple-500/20">
                <Home size={18} />
                <span>Dashboard</span>
              </Button>
            </Link>
            
            <Link to="/marketplace" data-testid="nav-marketplace">
              <Button variant="ghost" className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-purple-500/20">
                <ShoppingCart size={18} />
                <span>Mercado</span>
              </Button>
            </Link>
            
            <Link to="/portfolio" data-testid="nav-portfolio">
              <Button variant="ghost" className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-purple-500/20">
                <Package size={18} />
                <span>Portfolio</span>
              </Button>
            </Link>
            
            <Link to="/earnings" data-testid="nav-earnings">
              <Button variant="ghost" className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-purple-500/20">
                <PieChart size={18} />
                <span>Ganancias</span>
              </Button>
            </Link>
            
            <Link to="/reports" data-testid="nav-reports">
              <Button variant="ghost" className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-purple-500/20">
                <FileText size={18} />
                <span>Reportes</span>
              </Button>
            </Link>
            
            <Link to="/create-asset" data-testid="nav-create-asset">
              <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white ml-2 flex items-center space-x-2">
                <PlusCircle size={18} />
                <span>Crear Activo</span>
              </Button>
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              className="hidden sm:flex border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Conectar
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-purple-500/30 hover:border-purple-500/50" data-testid="user-menu-trigger">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.picture} alt={user?.name} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-cyan-600 text-white">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#1a0a2e] border-purple-500/30 text-white">
                <div className="px-3 py-3 border-b border-purple-500/20">
                  <p className="text-sm font-semibold text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
                <DropdownMenuItem 
                  onClick={() => navigate('/portfolio')} 
                  className="text-gray-300 hover:text-white hover:bg-purple-500/20 cursor-pointer"
                  data-testid="dropdown-portfolio"
                >
                  <User className="mr-2" size={16} />
                  Mi Portfolio
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate('/earnings')} 
                  className="text-gray-300 hover:text-white hover:bg-purple-500/20 cursor-pointer"
                  data-testid="dropdown-earnings"
                >
                  <PieChart className="mr-2" size={16} />
                  Mis Ganancias
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={logout} 
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/20 cursor-pointer"
                  data-testid="dropdown-logout"
                >
                  <LogOut className="mr-2" size={16} />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
