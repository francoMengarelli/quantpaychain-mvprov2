"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/page-layout";
import { Play, Pause, RotateCcw } from "lucide-react";

export default function DemoPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Demostración de la Plataforma</h1>
              <p className="text-gray-400">Cargando...</p>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Demostración de la Plataforma</h1>
            <p className="text-gray-400">Vea QuantPay Chain en acción</p>
          </div>

          <Card className="glass-effect border-purple-500/20 mb-8">
            <CardContent className="p-8">
              <div className="aspect-video bg-slate-900/50 rounded-lg flex items-center justify-center border border-purple-500/20">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                    {isPlaying ? (
                      <Pause className="text-purple-400" size={32} />
                    ) : (
                      <Play className="text-purple-400" size={32} />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Recorrido por la Plataforma</h3>
                  <p className="text-gray-400 mb-4">Próximamente habrá una demostración interactiva</p>
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="qpc-gradient text-white"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="mr-2" size={18} />
                          Pausar
                        </>
                      ) : (
                        <>
                          <Play className="mr-2" size={18} />
                          Jugar Demo
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => setIsPlaying(false)}
                      variant="outline"
                      className="border-purple-500/30 text-white hover:bg-purple-500/10"
                    >
                      <RotateCcw className="mr-2" size={18} />
                      Reiniciar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="glass-effect border-purple-500/20">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🏢</div>
                <h3 className="text-lg font-bold text-white mb-2">Asset Tokenization</h3>
                <p className="text-sm text-gray-400">Watch how real-world assets are converted into digital tokens</p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-purple-500/20">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🔐</div>
                <h3 className="text-lg font-bold text-white mb-2">Post-Quantum Security</h3>
                <p className="text-sm text-gray-400">See how NIST-approved algorithms protect your assets</p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-purple-500/20">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">💳</div>
                <h3 className="text-lg font-bold text-white mb-2">Payment Processing</h3>
                <p className="text-sm text-gray-400">Explore multi-currency payment flows and settlements</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
