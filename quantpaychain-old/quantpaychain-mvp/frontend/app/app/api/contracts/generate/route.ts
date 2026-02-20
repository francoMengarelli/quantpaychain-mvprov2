
// API Route: POST /api/contracts/generate - Generate investment contract

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import ContractService from '@/backend/src/services/ContractService';
import { logger } from '@/backend/src/utils/logger';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { investmentId, propertyId } = body;

    if (!investmentId || !propertyId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: investmentId, propertyId',
        },
        { status: 400 }
      );
    }

    const contract = await ContractService.generateInvestmentContract({
      investmentId,
      propertyId,
      userId: (session.user as any).id,
    });

    return NextResponse.json({
      success: true,
      data: contract,
      message: 'Contract generated successfully',
    });
  } catch (error) {
    logger.error('Error in POST /api/contracts/generate', { error });
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate contract',
      },
      { status: 500 }
    );
  }
}

