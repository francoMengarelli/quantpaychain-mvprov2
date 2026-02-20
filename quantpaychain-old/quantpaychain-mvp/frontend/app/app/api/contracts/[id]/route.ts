
// API Route: GET /api/contracts/[id] - Get contract by ID

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import ContractService from '@/backend/src/services/ContractService';
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

    const contract = await ContractService.getContractById(
      params.id,
      (session.user as any).id
    );

    return NextResponse.json({
      success: true,
      data: contract,
    });
  } catch (error) {
    logger.error('Error in GET /api/contracts/[id]', { error, id: params.id });
    
    const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch contract',
      },
      { status: statusCode }
    );
  }
}

