
// API Route: GET /api/investments/stats - Get user investment statistics

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import InvestmentService from '@/backend/src/services/InvestmentService';
import { logger } from '@/backend/src/utils/logger';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    const stats = await InvestmentService.getUserInvestmentStats((session.user as any).id);

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    logger.error('Error in GET /api/investments/stats', { error });
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch investment stats',
      },
      { status: 500 }
    );
  }
}

