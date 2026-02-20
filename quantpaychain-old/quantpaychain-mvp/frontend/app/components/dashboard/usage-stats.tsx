
"use client";

import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { PLANS, getPlanById } from "@/lib/freemium";

interface UsageStatsProps {
  user: {
    plan: string;
    documentsThisMonth: number;
    totalDocuments: number;
  };
  onUpgrade: () => void;
}

export function UsageStats({ user, onUpgrade }: UsageStatsProps) {
  const { t } = useTranslation();
  const currentPlan = getPlanById(user.plan);
  
  if (!currentPlan) return null;

  const usagePercentage = (user.documentsThisMonth / currentPlan.documentsPerMonth) * 100;
  const remainingDocuments = Math.max(0, currentPlan.documentsPerMonth - user.documentsThisMonth);
  const isNearLimit = usagePercentage >= 80;
  const isAtLimit = usagePercentage >= 100;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Current Plan */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('common.currentPlan')}</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{currentPlan.name}</span>
              {currentPlan.popular && (
                <Badge variant="default" className="text-xs">Popular</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              ${currentPlan.price}/month
            </p>
            {user.plan === 'free' && (
              <Button size="sm" onClick={onUpgrade} className="w-full">
                {t('common.upgrade')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Documents This Month */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('dashboard.documentsThisMonth')}</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">{user.documentsThisMonth}</div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{t('dashboard.documentsUsed')}</span>
                <span>{user.documentsThisMonth}/{currentPlan.documentsPerMonth}</span>
              </div>
              <Progress 
                value={usagePercentage} 
                className={`h-2 ${isAtLimit ? '[&>div]:bg-red-500' : isNearLimit ? '[&>div]:bg-yellow-500' : ''}`}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Remaining Documents */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('dashboard.documentsRemaining')}</CardTitle>
          {isAtLimit ? (
            <AlertTriangle className="h-4 w-4 text-red-500" />
          ) : (
            <Clock className="h-4 w-4 text-muted-foreground" />
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className={`text-2xl font-bold ${isAtLimit ? 'text-red-500' : ''}`}>
              {remainingDocuments}
            </div>
            <p className="text-xs text-muted-foreground">
              {isAtLimit 
                ? t('dashboard.planLimitReached')
                : `${remainingDocuments} documents left this month`
              }
            </p>
            {isAtLimit && (
              <Button size="sm" onClick={onUpgrade} className="w-full">
                {t('common.upgrade')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Total Documents */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('dashboard.totalDocuments')}</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">{user.totalDocuments}</div>
            <p className="text-xs text-muted-foreground">
              All time documents
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
