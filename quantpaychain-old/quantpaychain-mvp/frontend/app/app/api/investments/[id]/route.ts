
// API Route: GET /api/investments/[id] - Get investment by ID

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import InvestmentService from '@/backend/src/services/InvestmentService';
import { logger } from '@/backend/src/utils/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const investment = await InvestmentService.getInvestmentById(
      params.id,
      (session.user as any).id
    );

    return NextResponse.json({
      success: true,
      data: investment,
    });
  } catch (error) {
    logger.error('Error in GET /api/investments/[id]', { error, id: params.id });
    
    const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch investment',
      },
      { status: statusCode }
    );
  }
}

