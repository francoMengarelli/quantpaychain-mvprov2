
// API Route: GET /api/properties - List all properties with filters

import { NextRequest, NextResponse } from 'next/server';
import PropertyService from '@/backend/src/services/PropertyService';
import { logger } from '@/backend/src/utils/logger';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse filters
    const filters = {
      propertyType: searchParams.get('propertyType')?.split(','),
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      minReturn: searchParams.get('minReturn') ? Number(searchParams.get('minReturn')) : undefined,
      city: searchParams.get('city')?.split(','),
      country: searchParams.get('country')?.split(','),
      status: searchParams.get('status')?.split(','),
      search: searchParams.get('search') || undefined,
    };

    // Parse pagination
    const pagination = {
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 20,
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    };

    const result = await PropertyService.getProperties(filters, pagination);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('Error in GET /api/properties', { error });
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch properties',
      },
      { status: 500 }
    );
  }
}

