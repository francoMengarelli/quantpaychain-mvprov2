

/**
 * API Route: Verify PQC Signature
 * POST /api/qpc/pqc/verify
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyPQC } from '@/lib/qpc-wrappers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, signatureResult } = body;
    
    if (!data || !signatureResult) {
      return NextResponse.json(
        { success: false, error: 'Data and signatureResult are required' },
        { status: 400 }
      );
    }
    
    // Verify signature
    const result = await verifyPQC(data, signatureResult);
    
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error verifying signature:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
