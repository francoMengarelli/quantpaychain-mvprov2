
/**
 * Custom error classes for AI KYC/AML Engine
 */

export class AMLError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AMLError';
    Object.setPrototypeOf(this, AMLError.prototype);
  }
}

export class SanctionsCheckError extends AMLError {
  constructor(message: string) {
    super(message);
    this.name = 'SanctionsCheckError';
    Object.setPrototypeOf(this, SanctionsCheckError.prototype);
  }
}

export class RiskAssessmentError extends AMLError {
  constructor(message: string) {
    super(message);
    this.name = 'RiskAssessmentError';
    Object.setPrototypeOf(this, RiskAssessmentError.prototype);
  }
}

export class PatternDetectionError extends AMLError {
  constructor(message: string) {
    super(message);
    this.name = 'PatternDetectionError';
    Object.setPrototypeOf(this, PatternDetectionError.prototype);
  }
}

export class DocumentVerificationError extends AMLError {
  constructor(message: string) {
    super(message);
    this.name = 'DocumentVerificationError';
    Object.setPrototypeOf(this, DocumentVerificationError.prototype);
  }
}

export class ComplianceReportError extends AMLError {
  constructor(message: string) {
    super(message);
    this.name = 'ComplianceReportError';
    Object.setPrototypeOf(this, ComplianceReportError.prototype);
  }
}
