"use strict";
/**
 * Custom error classes for AI KYC/AML Engine
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceReportError = exports.DocumentVerificationError = exports.PatternDetectionError = exports.RiskAssessmentError = exports.SanctionsCheckError = exports.AMLError = void 0;
class AMLError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AMLError';
        Object.setPrototypeOf(this, AMLError.prototype);
    }
}
exports.AMLError = AMLError;
class SanctionsCheckError extends AMLError {
    constructor(message) {
        super(message);
        this.name = 'SanctionsCheckError';
        Object.setPrototypeOf(this, SanctionsCheckError.prototype);
    }
}
exports.SanctionsCheckError = SanctionsCheckError;
class RiskAssessmentError extends AMLError {
    constructor(message) {
        super(message);
        this.name = 'RiskAssessmentError';
        Object.setPrototypeOf(this, RiskAssessmentError.prototype);
    }
}
exports.RiskAssessmentError = RiskAssessmentError;
class PatternDetectionError extends AMLError {
    constructor(message) {
        super(message);
        this.name = 'PatternDetectionError';
        Object.setPrototypeOf(this, PatternDetectionError.prototype);
    }
}
exports.PatternDetectionError = PatternDetectionError;
class DocumentVerificationError extends AMLError {
    constructor(message) {
        super(message);
        this.name = 'DocumentVerificationError';
        Object.setPrototypeOf(this, DocumentVerificationError.prototype);
    }
}
exports.DocumentVerificationError = DocumentVerificationError;
class ComplianceReportError extends AMLError {
    constructor(message) {
        super(message);
        this.name = 'ComplianceReportError';
        Object.setPrototypeOf(this, ComplianceReportError.prototype);
    }
}
exports.ComplianceReportError = ComplianceReportError;
