

/**
 * API Route: Sign Data with PQC
 * POST /api/qpc/pqc/sign
 */

import { NextRequest, NextResponse } from 'next/server';
import { signPQC } from '@/lib/qpc-wrappers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, privateKey } = body;
    
    if (!data || !privateKey) {
      return NextResponse.json(
        { success: false, error: 'Data and private key are required' },
        { status: 400 }
      );
    }
    
    // Sign data
    const signature = await signPQC(data, privateKey);
    
    return NextResponse.json({
      success: true,
      data: signature,
    });
  } catch (error) {
    console.error('Error signing data:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
