
/**
 * AI KYC/AML Engine
 * Main entry point for compliance and risk assessment operations
 */

import { createLogger, format, transports } from 'winston';
import { AIRiskScorer } from './risk-scorer';
import { SanctionsChecker } from './sanctions-checker';
import { PatternDetector } from './pattern-detector';
import { DocumentVerifier } from './document-verifier';
import { AMLRulesEngine } from './rules-engine';
import { ComplianceReporter } from './compliance-reporter';
import {
  Transaction,
  Customer,
  RiskAssessment,
  ComplianceFlag,
  ComplianceCheckType,
  RiskLevel,
  TransactionStatus,
  SanctionMatch,
  PatternMatch,
  DocumentVerificationRequest,
  DocumentVerificationResult,
  AMLConfig,
  ComplianceReport,
} from './types';

export class AIKYCAMLEngine {
  private riskScorer: AIRiskScorer;
  private sanctionsChecker: SanctionsChecker;
  private patternDetector: PatternDetector;
  private documentVerifier: DocumentVerifier;
  private rulesEngine: AMLRulesEngine;
  private complianceReporter: ComplianceReporter;
  private config: AMLConfig;
  private logger: any;

  constructor(config?: Partial<AMLConfig>) {
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

    this.riskScorer = new AIRiskScorer(this.config);
    this.sanctionsChecker = new SanctionsChecker();
    this.patternDetector = new PatternDetector();
    this.documentVerifier = new DocumentVerifier();
    this.rulesEngine = new AMLRulesEngine();
    this.complianceReporter = new ComplianceReporter();

    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json()
      ),
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.simple()
          ),
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
  public async performComplianceCheck(
    transaction: Transaction,
    customer: Customer,
    transactionHistory?: Transaction[]
  ): Promise<RiskAssessment> {
    this.logger.info('Performing compliance check', {
      transactionId: transaction.id,
      customerId: customer.id,
    });

    try {
      // 1. Risk Scoring
      const assessment = await this.riskScorer.assessRisk(transaction, customer);
      const flags: ComplianceFlag[] = [];

      // 2. Sanctions Check
      if (this.config.sanctionsCheckEnabled) {
        const sanctionMatches = await this.checkSanctions(transaction, customer);
        if (sanctionMatches.length > 0) {
          flags.push({
            type: ComplianceCheckType.SANCTIONS,
            severity: RiskLevel.CRITICAL,
            description: `Sanctions match found: ${sanctionMatches.length} match(es)`,
            details: sanctionMatches,
            flaggedAt: new Date().toISOString(),
          });
          assessment.riskScore = Math.max(assessment.riskScore, 95);
          assessment.recommendation = TransactionStatus.REJECTED;
        }
      }

      // 3. Pattern Detection
      if (this.config.transactionMonitoringEnabled) {
        const patterns = await this.patternDetector.detectPatterns(
          transaction,
          customer,
          transactionHistory
        );
        if (patterns.length > 0) {
          flags.push({
            type: ComplianceCheckType.TRANSACTION_MONITORING,
            severity: RiskLevel.HIGH,
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
            type: ComplianceCheckType.TRANSACTION_MONITORING,
            severity: result.action.severity || RiskLevel.MEDIUM,
            description: result.action.message || result.rule.description,
            details: { rule: result.rule.name },
            flaggedAt: new Date().toISOString(),
          });
        }
      }

      // Update assessment with flags
      assessment.flags = flags;

      // Re-evaluate recommendation based on flags
      if (flags.some(f => f.severity === RiskLevel.CRITICAL)) {
        assessment.recommendation = TransactionStatus.REJECTED;
        assessment.riskLevel = RiskLevel.CRITICAL;
      } else if (flags.some(f => f.severity === RiskLevel.HIGH)) {
        assessment.recommendation = TransactionStatus.PENDING_REVIEW;
        assessment.riskLevel = RiskLevel.HIGH;
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
    } catch (error) {
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
  private async checkSanctions(
    transaction: Transaction,
    customer: Customer
  ): Promise<SanctionMatch[]> {
    const matches: SanctionMatch[] = [];

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
  public async verifyDocument(
    request: DocumentVerificationRequest,
    customer: Customer
  ): Promise<DocumentVerificationResult> {
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
  public generateComplianceReport(startDate: string, endDate: string): ComplianceReport {
    this.logger.info('Generating compliance report', { startDate, endDate });
    return this.complianceReporter.generateReport(startDate, endDate);
  }

  /**
   * Get compliance summary
   */
  public getComplianceSummary(): any {
    return this.complianceReporter.getComplianceSummary();
  }

  /**
   * Get risk scorer instance
   */
  public getRiskScorer(): AIRiskScorer {
    return this.riskScorer;
  }

  /**
   * Get sanctions checker instance
   */
  public getSanctionsChecker(): SanctionsChecker {
    return this.sanctionsChecker;
  }

  /**
   * Get pattern detector instance
   */
  public getPatternDetector(): PatternDetector {
    return this.patternDetector;
  }

  /**
   * Get document verifier instance
   */
  public getDocumentVerifier(): DocumentVerifier {
    return this.documentVerifier;
  }

  /**
   * Get rules engine instance
   */
  public getRulesEngine(): AMLRulesEngine {
    return this.rulesEngine;
  }

  /**
   * Get compliance reporter instance
   */
  public getComplianceReporter(): ComplianceReporter {
    return this.complianceReporter;
  }

  /**
   * Get configuration
   */
  public getConfig(): AMLConfig {
    return { ...this.config };
  }
}

// Re-export types and classes
export * from './types';
export * from './errors';
export { AIRiskScorer } from './risk-scorer';
export { SanctionsChecker } from './sanctions-checker';
export { PatternDetector } from './pattern-detector';
export { DocumentVerifier } from './document-verifier';
export { AMLRulesEngine } from './rules-engine';
export { ComplianceReporter } from './compliance-reporter';
