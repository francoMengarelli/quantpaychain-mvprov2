"use strict";
/**
 * AI KYC/AML Types and Interfaces
 * Defines structures for compliance and risk assessment
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceCheckType = exports.TransactionStatus = exports.RiskLevel = void 0;
var RiskLevel;
(function (RiskLevel) {
    RiskLevel["LOW"] = "low";
    RiskLevel["MEDIUM"] = "medium";
    RiskLevel["HIGH"] = "high";
    RiskLevel["CRITICAL"] = "critical";
})(RiskLevel || (exports.RiskLevel = RiskLevel = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["APPROVED"] = "approved";
    TransactionStatus["PENDING_REVIEW"] = "pending_review";
    TransactionStatus["REJECTED"] = "rejected";
    TransactionStatus["FLAGGED"] = "flagged";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
var ComplianceCheckType;
(function (ComplianceCheckType) {
    ComplianceCheckType["SANCTIONS"] = "sanctions";
    ComplianceCheckType["PEP"] = "pep";
    ComplianceCheckType["ADVERSE_MEDIA"] = "adverse_media";
    ComplianceCheckType["TRANSACTION_MONITORING"] = "transaction_monitoring";
    ComplianceCheckType["DOCUMENT_VERIFICATION"] = "document_verification";
})(ComplianceCheckType || (exports.ComplianceCheckType = ComplianceCheckType = {}));
