import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, walletAddress } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // STUB: Database disabled - return mock success
    return NextResponse.json({
      message: 'User registration successful (simulated)',
      user: {
        id: 'mock-user-' + Date.now(),
        email,
        name: `${firstName} ${lastName}`,
        walletAddress: walletAddress || null
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
