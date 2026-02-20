
// API Route: POST /api/ai-auditor/analyze - Analyze contract with AI

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import AIAuditorService from '@/backend/src/services/AIAuditorService';
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
    const { contractId, analysisType } = body;

    if (!contractId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: contractId',
        },
        { status: 400 }
      );
    }

    const result = await AIAuditorService.analyzeContract(
      contractId,
      analysisType || 'full'
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Contract analysis completed',
    });
  } catch (error) {
    logger.error('Error in POST /api/ai-auditor/analyze', { error });
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to analyze contract',
      },
      { status: 500 }
    );
  }
}

