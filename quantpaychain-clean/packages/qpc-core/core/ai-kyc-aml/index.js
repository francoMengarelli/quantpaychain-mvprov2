"use strict";
/**
 * AI KYC/AML Engine
 * Main entry point for compliance and risk assessment operations
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceReporter = exports.AMLRulesEngine = exports.DocumentVerifier = exports.PatternDetector = exports.SanctionsChecker = exports.AIRiskScorer = exports.AIKYCAMLEngine = void 0;
const winston_1 = require("winston");
const risk_scorer_1 = require("./risk-scorer");
const sanctions_checker_1 = require("./sanctions-checker");
const pattern_detector_1 = require("./pattern-detector");
const document_verifier_1 = require("./document-verifier");
const rules_engine_1 = require("./rules-engine");
const compliance_reporter_1 = require("./compliance-reporter");
const types_1 = require("./types");
class AIKYCAMLEngine {
    constructor(config) {
        this.config = {
            sanctionsCheckEnabled: config?.sanctionsCheckEnabled !== false,
            pepCheckEnabled: config?.pepCheckEnabled !== false,
            adverseMediaCheckEnabled: config?.adverseMediaCheckEnabled !== false,
            transactionMonitoringEnabled: config?.transactionMonitoringEnabled !== false,
            documentVerificationEnabled: config?.documentVerificationEnabled !== false,
            highRiskCountries: config?.highRiskCountries || ['KP', 'IR', 'SY'],
            transactionThresholds: config?.transactionThresholds || {
                low: 10000,
                medium: 50000,
                high: 100000,
            },
            autoApprovalThreshold: config?.autoApprovalThreshold || 30,
            autoRejectionThreshold: config?.autoRejectionThreshold || 80,
        };
        this.riskScorer = new risk_scorer_1.AIRiskScorer(this.config);
        this.sanctionsChecker = new sanctions_checker_1.SanctionsChecker();
        this.patternDetector = new pattern_detector_1.PatternDetector();
        this.documentVerifier = new document_verifier_1.DocumentVerifier();
        this.rulesEngine = new rules_engine_1.AMLRulesEngine();
        this.complianceReporter = new compliance_reporter_1.ComplianceReporter();
        this.logger = (0, winston_1.createLogger)({
            level: 'info',
            format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.errors({ stack: true }), winston_1.format.json()),
            transports: [
                new winston_1.transports.Console({
                    format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.simple()),
                }),
            ],
        });
        this.logger.info('AI KYC/AML Engine initialized', { config: this.config });
    }
    /**
     * Perform comprehensive compliance check on a transaction
     * @param transaction - Transaction to check
     * @param customer - Customer information
     * @param transactionHistory - Optional transaction history for pattern detection
     * @returns Complete risk assessment
     */
    async performComplianceCheck(transaction, customer, transactionHistory) {
        this.logger.info('Performing compliance check', {
            transactionId: transaction.id,
            customerId: customer.id,
        });
        try {
            // 1. Risk Scoring
            const assessment = await this.riskScorer.assessRisk(transaction, customer);
            const flags = [];
            // 2. Sanctions Check
            if (this.config.sanctionsCheckEnabled) {
                const sanctionMatches = await this.checkSanctions(transaction, customer);
                if (sanctionMatches.length > 0) {
                    flags.push({
                        type: types_1.ComplianceCheckType.SANCTIONS,
                        severity: types_1.RiskLevel.CRITICAL,
                        description: `Sanctions match found: ${sanctionMatches.length} match(es)`,
                        details: sanctionMatches,
                        flaggedAt: new Date().toISOString(),
                    });
                    assessment.riskScore = Math.max(assessment.riskScore, 95);
                    assessment.recommendation = types_1.TransactionStatus.REJECTED;
                }
            }
            // 3. Pattern Detection
            if (this.config.transactionMonitoringEnabled) {
                const patterns = await this.patternDetector.detectPatterns(transaction, customer, transactionHistory);
                if (patterns.length > 0) {
                    flags.push({
                        type: types_1.ComplianceCheckType.TRANSACTION_MONITORING,
                        severity: types_1.RiskLevel.HIGH,
                        description: `Suspicious patterns detected: ${patterns.length} pattern(s)`,
                        details: patterns,
                        flaggedAt: new Date().toISOString(),
                    });
                    assessment.riskScore = Math.min(assessment.riskScore + 20, 100);
                }
            }
            // 4. Rules Engine
            const ruleResults = this.rulesEngine.evaluateRules(transaction, customer, {
                transactionCount24h: transactionHistory?.length || 0,
            });
            for (const result of ruleResults) {
                if (result.matched && result.action) {
                    flags.push({
                        type: types_1.ComplianceCheckType.TRANSACTION_MONITORING,
                        severity: result.action.severity || types_1.RiskLevel.MEDIUM,
                        description: result.action.message || result.rule.description,
                        details: { rule: result.rule.name },
                        flaggedAt: new Date().toISOString(),
                    });
                }
            }
            // Update assessment with flags
            assessment.flags = flags;
            // Re-evaluate recommendation based on flags
            if (flags.some(f => f.severity === types_1.RiskLevel.CRITICAL)) {
                assessment.recommendation = types_1.TransactionStatus.REJECTED;
                assessment.riskLevel = types_1.RiskLevel.CRITICAL;
            }
            else if (flags.some(f => f.severity === types_1.RiskLevel.HIGH)) {
                assessment.recommendation = types_1.TransactionStatus.PENDING_REVIEW;
                assessment.riskLevel = types_1.RiskLevel.HIGH;
            }
            // Record assessment
            this.complianceReporter.recordAssessment(assessment);
            this.complianceReporter.recordTransaction(transaction);
            this.logger.info('Compliance check complete', {
                transactionId: transaction.id,
                riskScore: assessment.riskScore,
                riskLevel: assessment.riskLevel,
                recommendation: assessment.recommendation,
                flagCount: flags.length,
            });
            return assessment;
        }
        catch (error) {
            this.logger.error('Compliance check failed', {
                transactionId: transaction.id,
                error,
            });
            throw error;
        }
    }
    /**
     * Check sanctions for transaction and customer
     */
    async checkSanctions(transaction, customer) {
        const matches = [];
        // Check customer
        const customerMatches = await this.sanctionsChecker.checkCustomer(customer);
        matches.push(...customerMatches);
        // Check transaction parties
        const senderMatches = await this.sanctionsChecker.checkTransactionParty(transaction.sender);
        matches.push(...senderMatches);
        const receiverMatches = await this.sanctionsChecker.checkTransactionParty(transaction.receiver);
        matches.push(...receiverMatches);
        return matches;
    }
    /**
     * Verify customer documents
     * @param request - Document verification request
     * @param customer - Customer information
     * @returns Verification result
     */
    async verifyDocument(request, customer) {
        this.logger.info('Verifying document', {
            customerId: request.customerId,
            documentType: request.documentType,
        });
        return this.documentVerifier.verifyDocument(request, customer);
    }
    /**
     * Generate compliance report
     * @param startDate - Start date (ISO string)
     * @param endDate - End date (ISO string)
     * @returns Compliance report
     */
    generateComplianceReport(startDate, endDate) {
        this.logger.info('Generating compliance report', { startDate, endDate });
        return this.complianceReporter.generateReport(startDate, endDate);
    }
    /**
     * Get compliance summary
     */
    getComplianceSummary() {
        return this.complianceReporter.getComplianceSummary();
    }
    /**
     * Get risk scorer instance
     */
    getRiskScorer() {
        return this.riskScorer;
    }
    /**
     * Get sanctions checker instance
     */
    getSanctionsChecker() {
        return this.sanctionsChecker;
    }
    /**
     * Get pattern detector instance
     */
    getPatternDetector() {
        return this.patternDetector;
    }
    /**
     * Get document verifier instance
     */
    getDocumentVerifier() {
        return this.documentVerifier;
    }
    /**
     * Get rules engine instance
     */
    getRulesEngine() {
        return this.rulesEngine;
    }
    /**
     * Get compliance reporter instance
     */
    getComplianceReporter() {
        return this.complianceReporter;
    }
    /**
     * Get configuration
     */
    getConfig() {
        return { ...this.config };
    }
}
exports.AIKYCAMLEngine = AIKYCAMLEngine;
// Re-export types and classes
__exportStar(require("./types"), exports);
__exportStar(require("./errors"), exports);
var risk_scorer_2 = require("./risk-scorer");
Object.defineProperty(exports, "AIRiskScorer", { enumerable: true, get: function () { return risk_scorer_2.AIRiskScorer; } });
var sanctions_checker_2 = require("./sanctions-checker");
Object.defineProperty(exports, "SanctionsChecker", { enumerable: true, get: function () { return sanctions_checker_2.SanctionsChecker; } });
var pattern_detector_2 = require("./pattern-detector");
Object.defineProperty(exports, "PatternDetector", { enumerable: true, get: function () { return pattern_detector_2.PatternDetector; } });
var document_verifier_2 = require("./document-verifier");
Object.defineProperty(exports, "DocumentVerifier", { enumerable: true, get: function () { return document_verifier_2.DocumentVerifier; } });
var rules_engine_2 = require("./rules-engine");
Object.defineProperty(exports, "AMLRulesEngine", { enumerable: true, get: function () { return rules_engine_2.AMLRulesEngine; } });
var compliance_reporter_2 = require("./compliance-reporter");
Object.defineProperty(exports, "ComplianceReporter", { enumerable: true, get: function () { return compliance_reporter_2.ComplianceReporter; } });
