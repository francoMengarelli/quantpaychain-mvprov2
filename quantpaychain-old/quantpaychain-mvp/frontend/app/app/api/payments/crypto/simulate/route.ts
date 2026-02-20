
// API Route: POST /api/payments/crypto/simulate - Simulate crypto payment (for MVP demo)

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import PaymentService from '@/backend/src/services/PaymentService';
import { logger } from '@/backend/src/utils/logger';
import crypto from 'crypto';

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
    const { paymentId } = body;

    if (!paymentId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: paymentId',
        },
        { status: 400 }
      );
    }

    // Generate simulated transaction hash
    const txHash = '0x' + crypto.randomBytes(32).toString('hex');

    const payment = await PaymentService.simulateCryptoPayment(paymentId, txHash);

    return NextResponse.json({
      success: true,
      data: payment,
      message: 'Crypto payment simulated successfully',
    });
  } catch (error) {
    logger.error('Error in POST /api/payments/crypto/simulate', { error });
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to simulate crypto payment',
      },
      { status: 500 }
    );
  }
}

