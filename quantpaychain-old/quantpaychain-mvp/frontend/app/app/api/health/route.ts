import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // STUB: Database check disabled
    const status = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'simulated',
      environment: process.env.NODE_ENV || 'development'
    };

    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    );
  }
}
