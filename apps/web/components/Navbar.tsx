"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ShoppingCart, Package, FileText, Sparkles } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-purple-500/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold qpc-gradient-text">
              QuantPayChain
            </div>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-purple-500/10">
                <Home size={18} className="mr-2" />
                Dashboard
              </Button>
            </Link>

            <Link href="/marketplace">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-purple-500/10">
                <ShoppingCart size={18} className="mr-2" />
                Marketplace
              </Button>
            </Link>

            <Link href="/create-asset">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-purple-500/10">
                <Package size={18} className="mr-2" />
                Create Asset
              </Button>
            </Link>

            <Link href="/reports">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-purple-500/10">
                <FileText size={18} className="mr-2" />
                Reports
              </Button>
            </Link>

            <Link href="/demo">
              <Button className="ml-2 qpc-gradient text-white">
                <Sparkles size={18} className="mr-2" />
                Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
