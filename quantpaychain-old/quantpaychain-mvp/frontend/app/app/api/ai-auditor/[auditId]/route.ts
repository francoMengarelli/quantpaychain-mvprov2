
// API Route: GET /api/ai-auditor/[auditId] - Get audit results by ID

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import AIAuditorService from '@/backend/src/services/AIAuditorService';
import { logger } from '@/backend/src/utils/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: { auditId: string } }
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

    const audit = await AIAuditorService.getAuditById(params.auditId);

    return NextResponse.json({
      success: true,
      data: audit,
    });
  } catch (error) {
    logger.error('Error in GET /api/ai-auditor/[auditId]', { error, auditId: params.auditId });
    
    const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch audit',
      },
      { status: statusCode }
    );
  }
}

