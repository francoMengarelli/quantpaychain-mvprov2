
/**
 * API Route: Create ISO 20022 Message
 * POST /api/qpc/iso20022/create
 */

import { NextRequest, NextResponse } from 'next/server';
import { createPain001Message } from '@/lib/qpc-wrappers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messageType, data } = body;
    
    if (!messageType || !data) {
      return NextResponse.json(
        { success: false, error: 'Message type and data are required' },
        { status: 400 }
      );
    }
    
    // Currently only support pain.001
    if (messageType !== 'pain.001') {
      return NextResponse.json(
        { success: false, error: 'Only pain.001 message type is currently supported' },
        { status: 400 }
      );
    }
    
    // Create message
    const xml = createPain001Message(data);
    
    return NextResponse.json({
      success: true,
      data: { xml },
    });
  } catch (error) {
    console.error('Error creating ISO 20022 message:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
