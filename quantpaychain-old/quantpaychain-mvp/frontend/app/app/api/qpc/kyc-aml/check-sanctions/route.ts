

/**
 * API Route: Check Sanctions
 * POST /api/qpc/kyc-aml/check-sanctions
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkSanctions, checkPEP, checkHighRiskJurisdiction } from '@/lib/qpc-wrappers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer, includeAllChecks = true } = body;
    
    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer data is required' },
        { status: 400 }
      );
    }
    
    const results: any = {};
    
    // Check sanctions
    results.sanctions = await checkSanctions(customer);
    
    if (includeAllChecks) {
      // Check PEP
      results.pep = await checkPEP(customer);
      
      // Check high-risk jurisdiction
      if (customer.country) {
        results.jurisdiction = await checkHighRiskJurisdiction(customer.country);
      }
    }
    
    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Error checking sanctions:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
