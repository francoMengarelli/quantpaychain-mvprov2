import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // STUB: SIWE authentication disabled
    return NextResponse.json({
      message: 'SIWE authentication simulated',
      session: {
        address: '0x0000000000000000000000000000000000000000',
        chainId: 1
      }
    });
  } catch (error) {
    console.error('SIWE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
