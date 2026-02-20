
// API Route: GET /api/properties/[id] - Get property by ID

import { NextRequest, NextResponse } from 'next/server';
import PropertyService from '@/backend/src/services/PropertyService';
import { logger } from '@/backend/src/utils/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const property = await PropertyService.getPropertyById(params.id);

    return NextResponse.json({
      success: true,
      data: property,
    });
  } catch (error) {
    logger.error('Error in GET /api/properties/[id]', { error, id: params.id });
    
    const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch property',
      },
      { status: statusCode }
    );
  }
}

