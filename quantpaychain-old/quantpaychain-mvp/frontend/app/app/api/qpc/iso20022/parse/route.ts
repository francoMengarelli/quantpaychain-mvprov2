
/**
 * API Route: Parse ISO 20022 Message
 * POST /api/qpc/iso20022/parse
 */

import { NextRequest, NextResponse } from 'next/server';
import { parseISO20022Message, validateISO20022Message } from '@/lib/qpc-wrappers';

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
    
    // Parse message
    const message = await parseISO20022Message(xml);
    
    // Validate message
    const validation = await validateISO20022Message(message);
    
    return NextResponse.json({
      success: true,
      data: {
        message,
        validation,
      },
    });
  } catch (error) {
    console.error('Error parsing ISO 20022 message:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
