
/**
 * API Route: Transform ISO 20022 to Blockchain
 * POST /api/qpc/iso20022/transform
 */

import { NextRequest, NextResponse } from 'next/server';
import { transformToBlockchain } from '@/lib/qpc-wrappers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { xml } = body;
    
    if (!xml) {
      return NextResponse.json(
        { success: false, error: 'XML message is required' },
        { status: 400 }
      );
    }
    
    // Transform to blockchain format (transformToBlockchain handles parsing internally)
    const transformation = await transformToBlockchain(xml);
    
    return NextResponse.json({
      success: true,
      data: transformation,
    });
  } catch (error) {
    console.error('Error transforming ISO 20022 message:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
