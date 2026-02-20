
// API Route: POST /api/auth/signup - User registration

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/backend/src/utils/db';
import { logger } from '@/backend/src/utils/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, country } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email and password are required',
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: 'Password must be at least 8 characters',
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'User already exists with this email',
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: firstName || null,
        lastName: lastName || null,
        name: firstName && lastName ? `${firstName} ${lastName}` : email,
        country: country || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });

    logger.info('New user registered', { userId: user.id, email: user.email });

    return NextResponse.json({
      success: true,
      data: user,
      message: 'Account created successfully',
    });
  } catch (error) {
    logger.error('Error in POST /api/auth/signup', { error });
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create account',
      },
      { status: 500 }
    );
  }
}

