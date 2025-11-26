"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Target, Zap, Award, TrendingUp } from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  reward?: string;
  progress?: string;
}

interface GamificationPanelProps {
  userId?: string;
}

export function GamificationPanel({ userId }: GamificationPanelProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "first_asset",
      name: "🌟 Primer Asset",
      description: "Tokeniza tu primer activo",
      unlocked: false,
      reward: "+100 XP"
    },
    {
      id: "diversifier",
      name: "🎯 Diversificador",
      description: "Crea assets en 3 categorías diferentes",
      unlocked: false,
      progress: "0/3"
    },
    {
      id: "high_value",
      name: "💎 Alto Valor",
      description: "Tokeniza un asset valorado en $1M+",
      unlocked: false,
      reward: "+500 XP"
    }
  ]);

  const [stats, setStats] = useState({
    level: 1,
    xp: 0,
    xpToNextLevel: 1000,
    rank: 0,
    totalUsers: 0
  });

  const xpPercentage = (stats.xp / stats.xpToNextLevel) * 100;

  return (
    <Card className="glass-effect border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-400" />
          Tu Progreso
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Level & XP */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-purple-400" />
              <span className="text-white font-semibold">Nivel {stats.level}</span>
            </div>
            <span className="text-sm text-gray-400">{stats.xp} / {stats.xpToNextLevel} XP</span>
          </div>
          <Progress value={xpPercentage} className="h-2 bg-slate-800">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: `${xpPercentage}%` }} />
          </Progress>
        </div>

        {/* Achievements */}
        <div>
          <h4 className="text-sm font-semibold text-gray-400 mb-3">Logros</h4>
          <div className="space-y-2">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-3 rounded-lg border ${
                  achievement.unlocked
                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30"
                    : "bg-slate-900/30 border-gray-700/30"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white">{achievement.name}</span>
                      {achievement.unlocked && (
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                          Desbloqueado
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{achievement.description}</p>
                    {achievement.progress && !achievement.unlocked && (
                      <p className="text-xs text-purple-400 mt-1">Progreso: {achievement.progress}</p>
                    )}
                  </div>
                  {achievement.reward && (
                    <Badge variant="outline" className="border-yellow-500/30 text-yellow-300 text-xs">
                      {achievement.reward}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-3 border border-blue-500/20">
          <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-400" />
            Próxima Acción
          </h4>
          <p className="text-xs text-gray-300 mb-2">💰 Vende tu primer token</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Dificultad: Medio</span>
            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs">
              +200 XP
            </Badge>
          </div>
        </div>

        {/* Leaderboard Position */}
        {stats.rank > 0 && (
          <div className="text-center py-2 bg-slate-900/50 rounded-lg border border-purple-500/20">
            <p className="text-xs text-gray-400 mb-1">Tu Posición</p>
            <div className="flex items-center justify-center gap-2">
              <Award className="h-4 w-4 text-purple-400" />
              <span className="text-white font-semibold">#{stats.rank}</span>
              <span className="text-xs text-gray-400">de {stats.totalUsers}</span>
            </div>
            <p className="text-xs text-emerald-400 mt-1">🚀 ¡Estás en el top 30%!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}