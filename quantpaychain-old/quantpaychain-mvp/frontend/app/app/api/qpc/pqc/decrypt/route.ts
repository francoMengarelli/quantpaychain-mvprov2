

/**
 * API Route: Decrypt Data with PQC
 * POST /api/qpc/pqc/decrypt
 */

import { NextRequest, NextResponse } from 'next/server';
import { decryptPQC } from '@/lib/qpc-wrappers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { encryptedData, privateKey } = body;
    
    if (!encryptedData || !privateKey) {
      return NextResponse.json(
        { success: false, error: 'Encrypted data and private key are required' },
        { status: 400 }
      );
    }
    
    // Decrypt data
    const decrypted = await decryptPQC(encryptedData, privateKey);
    
    return NextResponse.json({
      success: true,
      data: decrypted,
    });
  } catch (error) {
    console.error('Error decrypting data:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
