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
import { Home, ShoppingCart, Package, FileText, User, LogOut, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="glass fixed top-0 left-0 right-0 z-50" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2" data-testid="logo-link">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
              QuantPayChain
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/dashboard" data-testid="nav-dashboard">
              <Button variant="ghost" className="flex items-center space-x-2">
                <Home size={18} />
                <span>Dashboard</span>
              </Button>
            </Link>
            
            <Link to="/marketplace" data-testid="nav-marketplace">
              <Button variant="ghost" className="flex items-center space-x-2">
                <ShoppingCart size={18} />
                <span>Marketplace</span>
              </Button>
            </Link>
            
            <Link to="/portfolio" data-testid="nav-portfolio">
              <Button variant="ghost" className="flex items-center space-x-2">
                <Package size={18} />
                <span>Portfolio</span>
              </Button>
            </Link>
            
            <Link to="/reports" data-testid="nav-reports">
              <Button variant="ghost" className="flex items-center space-x-2">
                <FileText size={18} />
                <span>Reportes</span>
              </Button>
            </Link>
            
            <Link to="/create-asset" data-testid="nav-create-asset">
              <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white ml-2 flex items-center space-x-2">
                <PlusCircle size={18} />
                <span>Crear Activo</span>
              </Button>
            </Link>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full" data-testid="user-menu-trigger">
                <Avatar>
                  <AvatarImage src={user?.picture} alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-2 border-b">
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <DropdownMenuItem onClick={() => navigate('/portfolio')} data-testid="dropdown-portfolio">
                <User className="mr-2" size={16} />
                Mi Portfolio
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="text-red-600" data-testid="dropdown-logout">
                <LogOut className="mr-2" size={16} />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
