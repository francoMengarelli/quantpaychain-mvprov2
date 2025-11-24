"use client";

import { useState, useCallback, memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

function DemoPlayerComponent() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPlaying(prev => !prev);
  }, []);

  const handleRestart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPlaying(false);
  }, []);

  return (
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
                onClick={handlePlayPause}
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
                onClick={handleRestart}
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
  );
}

export const DemoPlayer = memo(DemoPlayerComponent);
