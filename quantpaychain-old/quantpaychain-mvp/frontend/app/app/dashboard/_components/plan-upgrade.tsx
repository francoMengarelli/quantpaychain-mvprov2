

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Check,
  CreditCard,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Star
} from 'lucide-react';
import { toast } from 'sonner';

interface PlanUpgradeProps {
  currentPlan: string;
  currentUsage: number;
}

export function PlanUpgrade({ currentPlan, currentUsage }: PlanUpgradeProps) {
  const [isLoading, setIsLoading] = useState('');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: '/month',
      description: 'Perfect for getting started',
      features: [
        '3 documents/month',
        'Basic blockchain verification',
        'IPFS storage',
        'Email support'
      ],
      popular: false,
      buttonText: 'Current Plan',
      buttonVariant: 'outline' as const
    },
    {
      id: 'starter',
      name: 'Starter',
      price: 99,
      period: '/month',
      description: 'For small teams and businesses',
      features: [
        '50 documents/month',
        'Advanced verification',
        'Custom templates',
        'Priority support',
        'API access',
        'Multi-signature workflows'
      ],
      popular: true,
      buttonText: 'Upgrade to Starter',
      buttonVariant: 'default' as const
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 299,
      period: '/month',
      description: 'For growing enterprises',
      features: [
        '500 documents/month',
        'White-label solution',
        'Advanced analytics',
        '24/7 support',
        'Custom integrations',
        'SLA guarantee',
        'Dedicated account manager'
      ],
      popular: false,
      buttonText: 'Upgrade to Pro',
      buttonVariant: 'outline' as const
    }
  ];

  const handleUpgrade = async (planId: string) => {
    if (planId === currentPlan) return;

    setIsLoading(planId);
    
    try {
      // Simulate API call - In real app, integrate with Stripe
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Redirecting to payment...');
      
      // Placeholder for Stripe integration
      toast.info('Payment integration coming soon!');
      
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading('');
    }
  };

  const getRecommendation = () => {
    if (currentUsage >= 2 && currentPlan === 'free') {
      return {
        plan: 'starter',
        reason: 'You\'re using most of your free tier. Upgrade for more documents and features.'
      };
    }
    return null;
  };

  const recommendation = getRecommendation();

  return (
    <div className="space-y-6">
      {/* Current Usage Alert */}
      {recommendation && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900">Upgrade Recommendation</h3>
                <p className="text-blue-700 text-sm mt-1">{recommendation.reason}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative ${plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''} ${
              currentPlan === plan.id ? 'border-green-500 bg-green-50' : ''
            }`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                <Star className="h-3 w-3 mr-1" />
                Most Popular
              </Badge>
            )}
            
            {currentPlan === plan.id && (
              <Badge className="absolute -top-3 right-4 bg-green-500">
                Current Plan
              </Badge>
            )}

            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-gray-500">{plan.period}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
            </CardHeader>

            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700' : ''}`}
                variant={currentPlan === plan.id ? 'outline' : plan.buttonVariant}
                onClick={() => handleUpgrade(plan.id)}
                disabled={currentPlan === plan.id || isLoading === plan.id}
              >
                {isLoading === plan.id ? (
                  <>
                    <CreditCard className="h-4 w-4 mr-2 animate-pulse" />
                    Processing...
                  </>
                ) : currentPlan === plan.id ? (
                  'Current Plan'
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    {plan.buttonText}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enterprise Option */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center space-x-2">
              <Users className="h-6 w-6 text-purple-600" />
              <h3 className="text-2xl font-bold text-gray-900">Enterprise</h3>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Need unlimited documents, custom features, or dedicated support? 
              Contact our team for a custom enterprise solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline">
                Contact Sales
              </Button>
              <Button size="lg" variant="outline">
                Schedule Demo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900">How does billing work?</h4>
            <p className="text-sm text-gray-600 mt-1">
              You're billed monthly and your document limit resets each billing cycle. 
              You can upgrade or downgrade at any time.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">What happens to my documents if I downgrade?</h4>
            <p className="text-sm text-gray-600 mt-1">
              All your documents remain accessible. You'll just have a lower monthly limit 
              for new documents going forward.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Is there a setup fee?</h4>
            <p className="text-sm text-gray-600 mt-1">
              No setup fees. You only pay the monthly subscription fee for your chosen plan.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
