"use client";

import { Card, CardContent } from "@/components/ui/card";
import { PageLayout } from "@/components/page-layout";
import { DemoPlayer } from "@/components/demo-player";

export default function DemoPage() {
  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Demostración de la Plataforma</h1>
            <p className="text-gray-400">Vea QuantPay Chain en acción</p>
          </div>

          <DemoPlayer />

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
