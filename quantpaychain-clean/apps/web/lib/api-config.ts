/**
 * API Configuration for QuantPayChain Backend
 * Backend can be deployed on Render or Emergent Preview
 */

export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://institutional-rwa.preview.emergentagent.com',
  endpoints: {
    // AI Services
    aiAdvisor: '/api/ai/advisor',
    aiGamificationTips: '/api/ai/gamification-tips',
    aiJurisdictionalAnalysis: '/api/ai/jurisdictional-analysis',
    
    // KYC/AML - NEW
    kycCheckSanctions: '/api/kyc/check-sanctions',
    kycVerifyIdentity: '/api/kyc/verify-identity',
    kycHighRiskCountries: '/api/kyc/high-risk-countries',
    amlAnalyzeTransaction: '/api/aml/analyze-transaction',
    
    // PQC (Post-Quantum Cryptography) - NEW
    pqcAlgorithms: '/api/pqc/algorithms',
    pqcGenerateKemKeypair: '/api/pqc/generate-kem-keypair',
    pqcGenerateSignatureKeypair: '/api/pqc/generate-signature-keypair',
    pqcEncapsulate: '/api/pqc/encapsulate',
    pqcDecapsulate: '/api/pqc/decapsulate',
    pqcSign: '/api/pqc/sign',
    pqcVerify: '/api/pqc/verify',
    pqcSignTokenization: '/api/pqc/sign-tokenization',
    pqcVerifyTokenization: '/api/pqc/verify-tokenization',
    
    // Purchase Flow
    purchaseCreateIntent: '/api/purchase/create-intent',
    purchaseConfirm: '/api/purchase/confirm',
    
    // ISO 20022
    iso20022GenerateReport: '/api/iso20022/generate-report',
    
    // Test endpoints
    testAiStatus: '/api/test/ai-status',
    testAiAdvisor: '/api/test/ai-advisor',
    testKycAnalysis: '/api/test/kyc-analysis',
  }
} as const;

/**
 * Helper function to build full API URL
 */
export function getApiUrl(endpoint: string): string {
  return `${API_CONFIG.baseURL}${endpoint}`;
}

/**
 * Helper function for API calls with error handling
 */
export async function apiCall<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = getApiUrl(endpoint);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
}
