
// API Route: POST /api/investments - Create new investment

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import InvestmentService from '@/backend/src/services/InvestmentService';
import { logger } from '@/backend/src/utils/logger';

export async function POST(request: NextRequest) {
  try {
    // Get session (user authentication)
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized - Please sign in',
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { propertyId, amount, paymentMethod } = body;

    // Validation
    if (!propertyId || !amount || !paymentMethod) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: propertyId, amount, paymentMethod',
        },
        { status: 400 }
      );
    }

    // Create investment
    const investment = await InvestmentService.createInvestment({
      userId: (session.user as any).id,
      propertyId,
      amount: Number(amount),
      paymentMethod,
    });

    return NextResponse.json({
      success: true,
      data: investment,
      message: 'Investment created successfully',
    });
  } catch (error) {
    logger.error('Error in POST /api/investments', { error });
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create investment',
      },
      { status: 500 }
    );
  }
}

// GET /api/investments - Get user's investments
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

    const investments = await InvestmentService.getUserInvestments((session.user as any).id);

    return NextResponse.json({
      success: true,
      data: investments,
    });
  } catch (error) {
    logger.error('Error in GET /api/investments', { error });
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch investments',
      },
      { status: 500 }
    );
  }
}

