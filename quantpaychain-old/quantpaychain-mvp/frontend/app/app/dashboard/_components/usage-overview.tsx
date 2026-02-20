

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Calendar,
  ArrowUpRight,
  Shield,
  Database,
  Clock
} from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';

interface UsageOverviewProps {
  user: any;
}

export function UsageOverview({ user }: UsageOverviewProps) {
  const planLimits = {
    free: 3,
    starter: 50,
    professional: 500
  };
  
  const currentLimit = planLimits[user.plan as keyof typeof planLimits] || 3;
  const usagePercentage = (user.contractsUsed / currentLimit) * 100;
  
  const currentMonth = format(new Date(), 'MMMM yyyy');
  const resetDate = format(endOfMonth(new Date()), 'MMM d');

  const features = [
    {
      icon: Shield,
      title: 'Blockchain Verification',
      description: 'All documents cryptographically secured',
      status: 'active'
    },
    {
      icon: Database,
      title: 'IPFS Storage',
      description: 'Decentralized document storage',
      status: 'active'
    },
    {
      icon: Clock,
      title: 'Real-time Tracking',
      description: 'Monitor document status instantly',
      status: 'active'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Current Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Current Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {user.contractsUsed} / {currentLimit}
                </p>
                <p className="text-sm text-gray-600">Documents this month</p>
              </div>
              <Badge variant={usagePercentage > 80 ? 'destructive' : 'secondary'}>
                {Math.round(usagePercentage)}% used
              </Badge>
            </div>
            
            <Progress value={usagePercentage} className="w-full" />
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Period: {currentMonth}</span>
              <span>Resets on {resetDate}</span>
            </div>

            {usagePercentage > 80 && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">
                  You're approaching your monthly limit. Consider upgrading for unlimited access.
                </p>
                <Button size="sm" className="mt-2" variant="outline">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  Upgrade Plan
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Plan Features */}
      <Card>
        <CardHeader>
          <CardTitle>Your Plan Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <feature.icon className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{feature.title}</p>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
                <Badge variant="outline" className="text-green-600">
                  Active
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{user._count.documents}</p>
              <p className="text-sm text-gray-600">Total Documents</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {user.documents.filter((d: any) => d.blockchainTxHash).length}
              </p>
              <p className="text-sm text-gray-600">Verified</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
