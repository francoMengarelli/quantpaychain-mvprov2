/**
 * API Configuration for QuantPayChain Backend
 * Backend deployed on Render: https://quantpaychain-api.onrender.com
 */

export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001',
  endpoints: {
    // AI Services
    aiAdvisor: '/api/ai/advisor',
    aiGamificationTips: '/api/ai/gamification-tips',
    
    // KYC/AML
    kycVerify: '/api/kyc/verify',
    
    // Purchase Flow
    purchaseCreateIntent: '/api/purchase/create-intent',
    purchaseConfirm: '/api/purchase/confirm',
    
    // PQC
    pqcGenerateKeypair: '/api/pqc/generate-keypair',
    pqcEncrypt: '/api/pqc/encrypt',
    
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
