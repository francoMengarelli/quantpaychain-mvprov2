
// QuantPayChain - TypeScript Types
// Shared types for backend services

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Property related types
export interface PropertyFilters {
  propertyType?: string[];
  minPrice?: number;
  maxPrice?: number;
  minReturn?: number;
  city?: string[];
  country?: string[];
  status?: string[];
  search?: string;
}

export interface InvestmentCalculation {
  investmentAmount: number;
  tokensReceived: number;
  ownershipPercentage: number;
  estimatedMonthlyReturn: number;
  estimatedAnnualReturn: number;
  projectedValue: number;
}

// Payment types
export interface StripePaymentIntent {
  paymentIntentId: string;
  clientSecret: string;
  amount: number;
  currency: string;
}

export interface CryptoPaymentRequest {
  amount: number;
  currency: string;
  network: string;
  receiverAddress: string;
  memo?: string;
}

// Contract types
export interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  template: string; // HTML template with placeholders
  variables: string[]; // List of required variables
}

export interface ContractGenerationParams {
  userId: string;
  propertyId: string;
  investmentId: string;
  templateId?: string;
  customData?: Record<string, any>;
}

export interface PQCSignatureData {
  algorithm: string;
  publicKey: string;
  signature: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// AI Auditor types
export interface AIAuditRequest {
  contractId: string;
  contractContent: string;
  analysisType?: 'full' | 'quick' | 'compliance';
}

export interface AIAuditResult {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  complianceScore: number;
  issues: AIIssue[];
  recommendations: AIRecommendation[];
  summary: string;
}

export interface AIIssue {
  severity: 'info' | 'warning' | 'error' | 'critical';
  category: string;
  description: string;
  location?: string;
  suggestedFix?: string;
}

export interface AIRecommendation {
  priority: 'low' | 'medium' | 'high';
  category: string;
  description: string;
  implementation?: string;
}

// Blockchain types
export interface BlockchainTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed?: string;
  blockNumber?: number;
  timestamp?: number;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface TokenMintRequest {
  propertyId: string;
  investorAddress: string;
  tokenAmount: number;
  investmentId: string;
}

