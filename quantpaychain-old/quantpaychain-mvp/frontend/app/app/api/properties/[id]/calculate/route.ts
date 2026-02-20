
// API Route: POST /api/properties/[id]/calculate - Calculate investment projections

import { NextRequest, NextResponse } from 'next/server';
import PropertyService from '@/backend/src/services/PropertyService';
import { logger } from '@/backend/src/utils/logger';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { amount } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Valid investment amount is required',
        },
        { status: 400 }
      );
    }

    const property = await PropertyService.getPropertyById(params.id);
    const projection = PropertyService.calculateInvestmentProjection(property, amount);

    return NextResponse.json({
      success: true,
      data: projection,
    });
  } catch (error) {
    logger.error('Error in POST /api/properties/[id]/calculate', { error, id: params.id });
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to calculate projection',
      },
      { status: 500 }
    );
  }
}

