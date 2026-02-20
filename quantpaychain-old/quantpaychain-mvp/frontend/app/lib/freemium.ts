
export interface Plan {
  id: string;
  name: string;
  price: number;
  documentsPerMonth: number;
  features: string[];
  popular?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    documentsPerMonth: 3,
    features: [
      '3 documents/month',
      'Basic blockchain verification', 
      'IPFS storage',
      'Email support'
    ],
  },
  {
    id: 'starter', 
    name: 'Starter',
    price: 99,
    documentsPerMonth: 50,
    features: [
      '50 documents/month',
      'Advanced verification',
      'Custom templates', 
      'Priority support',
      'API access'
    ],
    popular: true,
  },
  {
    id: 'professional',
    name: 'Professional', 
    price: 499,
    documentsPerMonth: 500,
    features: [
      '500 documents/month',
      'White-label solution',
      'Advanced analytics',
      '24/7 support', 
      'Custom integrations'
    ],
  },
];

export function getPlanById(planId: string): Plan | undefined {
  return PLANS.find(plan => plan.id === planId);
}

export function canCreateDocument(currentPlan: string, documentsThisMonth: number): boolean {
  const plan = getPlanById(currentPlan);
  if (!plan) return false;
  
  return documentsThisMonth < plan.documentsPerMonth;
}

export function getRemainingDocuments(currentPlan: string, documentsThisMonth: number): number {
  const plan = getPlanById(currentPlan);
  if (!plan) return 0;
  
  return Math.max(0, plan.documentsPerMonth - documentsThisMonth);
}

export function isFreePlan(planId: string): boolean {
  return planId === 'free';
}

export function getNextPlan(currentPlanId: string): Plan | null {
  const currentIndex = PLANS.findIndex(plan => plan.id === currentPlanId);
  if (currentIndex === -1 || currentIndex === PLANS.length - 1) return null;
  
  return PLANS[currentIndex + 1];
}
