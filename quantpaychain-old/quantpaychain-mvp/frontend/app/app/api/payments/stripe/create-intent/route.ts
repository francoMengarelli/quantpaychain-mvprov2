
// API Route: POST /api/payments/stripe/create-intent - Create Stripe payment intent

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import PaymentService from '@/backend/src/services/PaymentService';
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
    const { investmentId, amount, currency } = body;

    if (!investmentId || !amount) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: investmentId, amount',
        },
        { status: 400 }
      );
    }

    const paymentIntent = await PaymentService.createStripePaymentIntent({
      userId: (session.user as any).id,
      investmentId,
      amount: Number(amount),
      currency: currency || 'USD',
    });

    return NextResponse.json({
      success: true,
      data: paymentIntent,
      message: 'Payment intent created successfully',
    });
  } catch (error) {
    logger.error('Error in POST /api/payments/stripe/create-intent', { error });
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create payment intent',
      },
      { status: 500 }
    );
  }
}

