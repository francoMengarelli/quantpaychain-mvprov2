
/**
 * API Route: Encrypt Data with PQC
 * POST /api/qpc/pqc/encrypt
 */

import { NextRequest, NextResponse } from 'next/server';
import { encryptPQC } from '@/lib/qpc-wrappers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, publicKey } = body;
    
    if (!data || !publicKey) {
      return NextResponse.json(
        { success: false, error: 'Data and public key are required' },
        { status: 400 }
      );
    }
    
    // Encrypt data
    const encrypted = await encryptPQC(data, publicKey);
    
    return NextResponse.json({
      success: true,
      data: encrypted,
    });
  } catch (error) {
    console.error('Error encrypting data:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
