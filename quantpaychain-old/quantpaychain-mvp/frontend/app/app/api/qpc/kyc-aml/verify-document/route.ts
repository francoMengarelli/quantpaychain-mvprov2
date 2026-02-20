

/**
 * API Route: Verify Document
 * POST /api/qpc/kyc-aml/verify-document
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyDocument } from '@/lib/qpc-wrappers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { document } = body;
    
    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Document data is required' },
        { status: 400 }
      );
    }
    
    // Verify document
    const result = await verifyDocument(document);
    
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error verifying document:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
