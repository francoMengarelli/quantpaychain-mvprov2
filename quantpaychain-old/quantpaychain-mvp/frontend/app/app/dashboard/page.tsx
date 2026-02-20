

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-config';
// DISABLED FOR COMPILATION: import { prisma } from '@/lib/db';
import { DashboardClient } from './_components/dashboard-client';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  // STUB: Prisma disabled for compilation - using mock data
  const transformedUserData = {
    id: session.user.id || 'mock-user-id',
    email: session.user.email || 'user@example.com',
    name: session.user.name ?? 'Demo User',
    plan: 'free',
    walletAddress: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    documents: [],
    _count: { documents: 0 }
  };

  return <DashboardClient user={transformedUserData} />;
}
