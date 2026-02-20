
// API Route: GET /api/properties/featured - Get featured properties

import { NextRequest, NextResponse } from 'next/server';
import PropertyService from '@/backend/src/services/PropertyService';
import { logger } from '@/backend/src/utils/logger';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 6;

    const properties = await PropertyService.getFeaturedProperties(limit);

    return NextResponse.json({
      success: true,
      data: properties,
    });
  } catch (error) {
    logger.error('Error in GET /api/properties/featured', { error });
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch featured properties',
      },
      { status: 500 }
    );
  }
}

