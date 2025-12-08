
/**
 * AI KYC/AML Types and Interfaces
 * Defines structures for compliance and risk assessment
 */

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum TransactionStatus {
  APPROVED = 'approved',
  PENDING_REVIEW = 'pending_review',
  REJECTED = 'rejected',
  FLAGGED = 'flagged',
}

export enum ComplianceCheckType {
  SANCTIONS = 'sanctions',
  PEP = 'pep', // Politically Exposed Person
  ADVERSE_MEDIA = 'adverse_media',
  TRANSACTION_MONITORING = 'transaction_monitoring',
  DOCUMENT_VERIFICATION = 'document_verification',
}

export interface Customer {
  id: string;
  name: string;
  dateOfBirth?: string;
  nationality?: string;
  address?: Address;
  identification?: Identification;
  accountCreatedAt: string;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country: string;
}

export interface Identification {
  type: 'passport' | 'national_id' | 'drivers_license';
  number: string;
  issuingCountry: string;
  expiryDate?: string;
}

export interface Transaction {
  id: string;
  customerId: string;
  amount: number;
  currency: string;
  sender: TransactionParty;
  receiver: TransactionParty;
  description?: string;
  timestamp: string;
  type: 'credit' | 'debit' | 'transfer';
}

export interface TransactionParty {
  name: string;
  accountId: string;
  country?: string;
  bankId?: string;
}

export interface RiskAssessment {
  transactionId: string;
  customerId: string;
  riskLevel: RiskLevel;
  riskScore: number; // 0-100
  factors: RiskFactor[];
  flags: ComplianceFlag[];
  recommendation: TransactionStatus;
  assessedAt: string;
  assessedBy: 'ai' | 'manual' | 'hybrid';
}

export interface RiskFactor {
  type: string;
  description: string;
  impact: number; // 0-100
  weight: number; // 0-1
}

export interface ComplianceFlag {
  type: ComplianceCheckType;
  severity: RiskLevel;
  description: string;
  details?: any;
  flaggedAt: string;
}

export interface SanctionsList {
  id: string;
  source: string;
  entities: SanctionedEntity[];
  lastUpdated: string;
}

export interface SanctionedEntity {
  name: string;
  aliases?: string[];
  dateOfBirth?: string;
  nationality?: string;
  type: 'individual' | 'organization';
  sanctionType: string;
  addedDate: string;
}

export interface SanctionMatch {
  entity: SanctionedEntity;
  matchScore: number; // 0-100
  matchType: 'exact' | 'fuzzy' | 'alias';
  matchedFields: string[];
}

export interface Pattern {
  id: string;
  name: string;
  description: string;
  type: 'suspicious' | 'normal';
  indicators: string[];
  threshold: number;
}

export interface PatternMatch {
  pattern: Pattern;
  confidence: number; // 0-100
  matchedIndicators: string[];
  transactions: string[];
}

export interface DocumentVerificationRequest {
  customerId: string;
  documentType: string;
  documentImage?: Uint8Array;
  documentData?: any;
}

export interface DocumentVerificationResult {
  isValid: boolean;
  confidence: number; // 0-100
  extractedData?: any;
  issues: string[];
  verifiedAt: string;
}

export interface ComplianceReport {
  id: string;
  period: {
    startDate: string;
    endDate: string;
  };
  statistics: {
    totalTransactions: number;
    flaggedTransactions: number;
    approvedTransactions: number;
    rejectedTransactions: number;
    averageRiskScore: number;
  };
  topRiskFactors: Array<{ factor: string; count: number }>;
  sanctionMatches: number;
  generatedAt: string;
}

export interface AMLRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  conditions: AMLCondition[];
  action: RuleAction;
  priority: number;
}

export interface AMLCondition {
  field: string;
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'matches_pattern';
  value: any;
}

export interface RuleAction {
  type: 'flag' | 'reject' | 'review' | 'approve';
  severity?: RiskLevel;
  message?: string;
}

export interface AMLConfig {
  sanctionsCheckEnabled: boolean;
  pepCheckEnabled: boolean;
  adverseMediaCheckEnabled: boolean;
  transactionMonitoringEnabled: boolean;
  documentVerificationEnabled: boolean;
  highRiskCountries: string[];
  transactionThresholds: {
    low: number;
    medium: number;
    high: number;
  };
  autoApprovalThreshold: number; // Risk score below this is auto-approved
  autoRejectionThreshold: number; // Risk score above this is auto-rejected
}
