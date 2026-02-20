
// API Route: POST /api/payments/crypto/create-request - Create crypto payment request

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

    if (!investmentId || !amount || !currency) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: investmentId, amount, currency',
        },
        { status: 400 }
      );
    }

    const validCurrencies = ['ETH', 'USDC', 'DAI', 'BTC'];
    if (!validCurrencies.includes(currency)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid currency. Must be one of: ${validCurrencies.join(', ')}`,
        },
        { status: 400 }
      );
    }

    const paymentRequest = await PaymentService.createCryptoPaymentRequest({
      userId: (session.user as any).id,
      investmentId,
      amount: Number(amount),
      currency,
    });

    return NextResponse.json({
      success: true,
      data: paymentRequest,
      message: 'Crypto payment request created successfully',
    });
  } catch (error) {
    logger.error('Error in POST /api/payments/crypto/create-request', { error });
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create crypto payment request',
      },
      { status: 500 }
    );
  }
}

