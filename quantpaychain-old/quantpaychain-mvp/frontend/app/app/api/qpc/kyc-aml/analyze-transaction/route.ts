

/**
 * API Route: Analyze Transaction AML
 * POST /api/qpc/kyc-aml/analyze-transaction
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyzeTransactionAML } from '@/lib/qpc-wrappers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transaction } = body;
    
    if (!transaction) {
      return NextResponse.json(
        { success: false, error: 'Transaction data is required' },
        { status: 400 }
      );
    }
    
    // Analyze transaction
    const result = await analyzeTransactionAML(transaction);
    
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error analyzing transaction:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
