"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/page-layout";
import { TrendingUp, Wallet, FileText, Activity, Plus, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Bienvenido, {user?.user_metadata?.name || user?.email?.split('@')[0]}
                </h1>
                <p className="text-gray-400">Tu portafolio y resumen de inversiones</p>
              </div>
              <Link href="/create-asset">
                <Button className="qpc-gradient text-white">
                  <Plus className="mr-2" size={18} />
                  Crear Asset
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="glass-effect border-purple-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Value</CardTitle>
                <Wallet className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">$0.00</div>
                <p className="text-xs text-gray-500 mt-1">Connect wallet to see balance</p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-purple-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Assets Owned</CardTitle>
                <FileText className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">0</div>
                <p className="text-xs text-gray-500 mt-1">No assets yet</p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-purple-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Earnings</CardTitle>
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">$0.00</div>
                <p className="text-xs text-emerald-500 mt-1">+0%</p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-purple-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Active Investments</CardTitle>
                <Activity className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">0</div>
                <p className="text-xs text-gray-500 mt-1">No active investments</p>
              </CardContent>
            </Card>
          </div>

          {/* Empty State */}
          <Card className="glass-effect border-purple-500/20">
            <CardContent className="p-12 text-center">
              <Wallet className="w-16 h-16 mx-auto mb-4 text-purple-400 opacity-50" />
              <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
              <p className="text-gray-400 mb-6">Connect your wallet to view your portfolio and start investing in tokenized assets</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
