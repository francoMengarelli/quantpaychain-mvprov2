"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, TrendingUp, Activity, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    my_assets: 0,
    total_invested: 0,
    transactions_count: 0,
    available_tokens: 0
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-400">Welcome to your QuantPay Chain dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="glass-effect border-purple-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-sm font-medium text-gray-400">
                <Package className="mr-2 text-blue-400" size={18} />
                My Assets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.my_assets}</div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-purple-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-sm font-medium text-gray-400">
                <TrendingUp className="mr-2 text-emerald-400" size={18} />
                Total Invested
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">${stats.total_invested.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-purple-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-sm font-medium text-gray-400">
                <Activity className="mr-2 text-blue-400" size={18} />
                Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.transactions_count}</div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-purple-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-sm font-medium text-gray-400">
                <ShoppingCart className="mr-2 text-emerald-400" size={18} />
                Available Tokens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.available_tokens}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="glass-effect border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/marketplace">
                <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 hover:border-blue-500/40 transition-all cursor-pointer">
                  <ShoppingCart className="text-blue-400 mb-3" size={28} />
                  <h3 className="font-bold text-lg text-white mb-1">Explore Marketplace</h3>
                  <p className="text-sm text-gray-400">Browse and purchase tokenized assets</p>
                </div>
              </Link>

              <Link href="/create-asset">
                <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 hover:border-emerald-500/40 transition-all cursor-pointer">
                  <Package className="text-emerald-400 mb-3" size={28} />
                  <h3 className="font-bold text-lg text-white mb-1">Create Asset</h3>
                  <p className="text-sm text-gray-400">Tokenize a new real-world asset</p>
                </div>
              </Link>

              <Link href="/reports">
                <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer">
                  <Activity className="text-purple-400 mb-3" size={28} />
                  <h3 className="font-bold text-lg text-white mb-1">View Reports</h3>
                  <p className="text-sm text-gray-400">Generate ISO 20022 reports</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
