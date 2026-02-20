
/**
 * KYC/AML Wrappers
 * Simplified functions wrapping the QPC v2 Core classes
 */

import { AIKYCAMLEngine } from '@/qpc-v2-core/core/ai-kyc-aml';
import { Customer, Transaction } from '@/qpc-v2-core/core/ai-kyc-aml/types';

// Create singleton instance
const kycAmlEngine = new AIKYCAMLEngine({
  sanctionsCheckEnabled: true,
  pepCheckEnabled: true,
  adverseMediaCheckEnabled: true,
  transactionMonitoringEnabled: true,
  documentVerificationEnabled: true,
});

/**
 * Perform KYC verification on a customer
 */
export async function performKYCVerification(customer: Customer) {
  // Use a dummy transaction for customer verification
  const dummyTransaction: Transaction = {
    id: `verify-${customer.id}-${Date.now()}`,
    customerId: customer.id,
    type: 'transfer',
    sender: {
      name: customer.name,
      accountId: customer.id,
      country: customer.nationality || customer.address?.country,
    },
    receiver: {
      name: 'System',
      accountId: 'system',
      country: 'US',
    },
    amount: 0,
    currency: 'USD',
    description: 'KYC Verification',
    timestamp: new Date().toISOString(),
  };
  
  return kycAmlEngine.performComplianceCheck(dummyTransaction, customer);
}

/**
 * Check if a customer is on sanctions lists (simplified wrapper)
 */
export async function checkSanctions(customer: Customer) {
  const result = await performKYCVerification(customer);
  const sanctionFlags = result.flags.filter((flag: any) => 
    flag.type === 'SANCTIONS_CHECK' || flag.description?.includes('sanction')
  );
  
  return {
    hasSanctions: sanctionFlags.length > 0,
    matches: sanctionFlags,
  };
}

/**
 * Check if a customer is a PEP (Politically Exposed Person)
 */
export async function checkPEP(customer: Customer) {
  const result = await performKYCVerification(customer);
  const pepFlags = result.flags.filter((flag: any) => 
    flag.type === 'PEP_CHECK' || flag.description?.includes('PEP')
  );
  
  return {
    isPEP: pepFlags.length > 0,
    details: pepFlags,
  };
}

/**
 * Check if a jurisdiction is high-risk
 */
export async function checkHighRiskJurisdiction(countryCode: string) {
  const highRiskCountries = ['KP', 'IR', 'SY', 'CU', 'VE'];
  
  return {
    isHighRisk: highRiskCountries.includes(countryCode.toUpperCase()),
    countryCode,
    riskLevel: highRiskCountries.includes(countryCode.toUpperCase()) ? 'HIGH' : 'LOW',
  };
}

/**
 * Detect fraud patterns in customer data
 */
export async function detectFraud(customer: Customer) {
  const result = await performKYCVerification(customer);
  
  return {
    fraudDetected: result.flags.some((flag: any) => flag.severity === 'HIGH' || flag.severity === 'CRITICAL'),
    patterns: result.flags.filter((flag: any) => flag.severity === 'HIGH' || flag.severity === 'CRITICAL'),
    riskScore: result.riskScore,
  };
}

/**
 * Analyze a transaction for AML compliance
 */
export async function analyzeTransactionAML(transaction: Transaction) {
  // Create a dummy customer for transaction analysis
  const dummyCustomer: Customer = {
    id: transaction.customerId || transaction.sender.accountId,
    name: transaction.sender.name,
    nationality: transaction.sender.country,
    accountCreatedAt: new Date().toISOString(),
  };
  
  return kycAmlEngine.performComplianceCheck(transaction, dummyCustomer);
}

/**
 * Verify a document
 */
export async function verifyDocument(documentRequest: any) {
  // Create a dummy customer for document verification
  const dummyCustomer: Customer = {
    id: documentRequest.customerId,
    name: 'Customer',
    nationality: 'US',
    accountCreatedAt: new Date().toISOString(),
  };
  
  return kycAmlEngine.verifyDocument(documentRequest, dummyCustomer);
}
