
/**
 * API Route: Generate PQC Key Pair
 * POST /api/qpc/pqc/generate-keys
 */

import { NextRequest, NextResponse } from 'next/server';
import { generatePQCKeyPair, generateHybridKeyPair } from '@/lib/qpc-wrappers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { algorithm = 'kyber768', hybrid = false } = body;
    
    let keyPair;
    
    if (hybrid) {
      // Generate hybrid key pair
      keyPair = await generateHybridKeyPair(algorithm);
    } else {
      // Generate PQC key pair
      keyPair = await generatePQCKeyPair(algorithm);
    }
    
    return NextResponse.json({
      success: true,
      data: keyPair,
    });
  } catch (error) {
    console.error('Error generating PQC key pair:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
