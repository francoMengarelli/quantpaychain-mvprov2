
/**
 * API Route: Verify Customer KYC
 * POST /api/qpc/kyc-aml/verify-customer
 */

import { NextRequest, NextResponse } from 'next/server';
import { performKYCVerification, checkSanctions, detectFraud } from '@/lib/qpc-wrappers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer } = body;
    
    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer data is required' },
        { status: 400 }
      );
    }
    
    // Perform KYC verification
    const kycResult = await performKYCVerification(customer);
    
    // Check sanctions
    const sanctionsResult = await checkSanctions(customer);
    
    // Detect fraud
    const fraudResult = await detectFraud(customer);
    
    return NextResponse.json({
      success: true,
      data: {
        kyc: kycResult,
        sanctions: sanctionsResult,
        fraud: fraudResult,
      },
    });
  } catch (error) {
    console.error('Error verifying customer:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
