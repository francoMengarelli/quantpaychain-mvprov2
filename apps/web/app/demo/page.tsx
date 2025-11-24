"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, ArrowLeft, Network } from "lucide-react";
import Link from "next/link";

export default function DemoPage() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header simple sin RainbowKit */}
      <nav className="sticky top-0 z-50 w-full border-b border-gray-800/50 bg-slate-950/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Network className="h-8 w-8 text-purple-500" />
              <span className="text-xl font-bold qpc-gradient-text">QuantPay Chain</span>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                <ArrowLeft className="mr-2" size={18} />
                Volver al Inicio
              </Button>
            </Link>
          </div>
        </div>
      </nav>

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
                    type="button"
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
                    type="button"
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
                <h3 className="text-lg font-bold text-white mb-2">Tokenización de Activos</h3>
                <p className="text-sm text-gray-400">Observe cómo los activos del mundo real se convierten en tokens digitales</p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-purple-500/20">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🔐</div>
                <h3 className="text-lg font-bold text-white mb-2">Seguridad Post-Cuántica</h3>
                <p className="text-sm text-gray-400">Vea cómo los algoritmos aprobados por NIST protegen sus activos</p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-purple-500/20">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">💳</div>
                <h3 className="text-lg font-bold text-white mb-2">Procesamiento de Pagos</h3>
                <p className="text-sm text-gray-400">Explore flujos de pago multi-moneda y liquidaciones</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
