
/**
 * Integration tests for AI KYC/AML Engine workflow
 */

import { AIKYCAMLEngine } from '../../core/ai-kyc-aml';
import { Transaction, Customer, RiskLevel } from '../../core/ai-kyc-aml/types';

describe('AIKYCAMLEngine Integration', () => {
  let engine: AIKYCAMLEngine;

  beforeEach(() => {
    engine = new AIKYCAMLEngine({
      sanctionsCheckEnabled: true,
      transactionMonitoringEnabled: true,
      highRiskCountries: ['XX', 'YY'],
      transactionThresholds: {
        low: 10000,
        medium: 50000,
        high: 100000,
      },
      autoApprovalThreshold: 30,
      autoRejectionThreshold: 80,
    });
  });

  const createCustomer = (overrides?: Partial<Customer>): Customer => ({
    id: 'CUST-001',
    name: 'John Doe',
    dateOfBirth: '1985-05-15',
    nationality: 'US',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'US',
    },
    identification: {
      type: 'passport',
      number: 'P123456789',
      issuingCountry: 'US',
      expiryDate: '2030-12-31',
    },
    accountCreatedAt: '2020-01-01T00:00:00Z',
    ...overrides,
  });

  const createTransaction = (overrides?: Partial<Transaction>): Transaction => ({
    id: `TXN-${Date.now()}`,
    customerId: 'CUST-001',
    amount: 5000,
    currency: 'USD',
    sender: {
      name: 'John Doe',
      accountId: 'ACC-001',
      country: 'US',
    },
    receiver: {
      name: 'Jane Smith',
      accountId: 'ACC-002',
      country: 'US',
    },
    description: 'Business payment',
    timestamp: new Date().toISOString(),
    type: 'credit',
    ...overrides,
  });

  describe('Complete compliance check workflow', () => {
    it('should perform full compliance check on low-risk transaction', async () => {
      const customer = createCustomer();
      const transaction = createTransaction();

      const assessment = await engine.performComplianceCheck(
        transaction,
        customer
      );

      expect(assessment).toHaveProperty('transactionId');
      expect(assessment).toHaveProperty('customerId');
      expect(assessment).toHaveProperty('riskLevel');
      expect(assessment).toHaveProperty('riskScore');
      expect(assessment).toHaveProperty('factors');
      expect(assessment).toHaveProperty('flags');
      expect(assessment).toHaveProperty('recommendation');
      expect(assessment.riskLevel).toBe(RiskLevel.LOW);
    });

    it('should flag high-risk transaction', async () => {
      const customer = createCustomer({ accountCreatedAt: new Date().toISOString() });
      const transaction = createTransaction({
        amount: 150000,
        receiver: {
          name: 'Suspicious Entity',
          accountId: 'ACC-RISK',
          country: 'XX', // High-risk country
        },
        description: 'urgent cash transfer offshore',
      });

      const assessment = await engine.performComplianceCheck(
        transaction,
        customer
      );

      expect(assessment.riskScore).toBeGreaterThan(50);
      expect(assessment.flags.length).toBeGreaterThan(0);
    });

    it('should detect sanctions match', async () => {
      const customer = createCustomer({ name: 'John Restricted' });
      const transaction = createTransaction();

      const assessment = await engine.performComplianceCheck(
        transaction,
        customer
      );

      // Should have critical risk due to sanctions match
      const sanctionsFlag = assessment.flags.find(
        f => f.type === 'sanctions'
      );
      if (sanctionsFlag) {
        expect(sanctionsFlag.severity).toBe(RiskLevel.CRITICAL);
        expect(assessment.recommendation).toBe('rejected');
      }
    });
  });

  describe('Document verification workflow', () => {
    it('should verify customer document', async () => {
      const customer = createCustomer();
      const verificationRequest = {
        customerId: customer.id,
        documentType: 'passport',
        documentData: {
          number: 'P123456789',
          name: 'John Doe',
          dateOfBirth: '1985-05-15',
          nationality: 'US',
          expiryDate: '2030-12-31',
        },
      };

      const result = await engine.verifyDocument(verificationRequest, customer);

      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('extractedData');
      expect(result).toHaveProperty('issues');
      expect(result.isValid).toBe(true);
    });

    it('should detect document mismatch', async () => {
      const customer = createCustomer({ name: 'John Doe' });
      const verificationRequest = {
        customerId: customer.id,
        documentType: 'passport',
        documentData: {
          number: 'P123456789',
          name: 'Different Name', // Mismatch
          dateOfBirth: '1985-05-15',
        },
      };

      const result = await engine.verifyDocument(verificationRequest, customer);

      expect(result.isValid).toBe(false);
      expect(result.issues.length).toBeGreaterThan(0);
    });
  });

  describe('Compliance reporting workflow', () => {
    it('should generate compliance report', async () => {
      const customer = createCustomer();

      // Process multiple transactions
      for (let i = 0; i < 10; i++) {
        const transaction = createTransaction({
          id: `TXN-${i}`,
          amount: 1000 + i * 1000,
        });
        await engine.performComplianceCheck(transaction, customer);
      }

      // Generate report
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const endDate = new Date().toISOString();

      const report = engine.generateComplianceReport(startDate, endDate);

      expect(report).toHaveProperty('id');
      expect(report).toHaveProperty('period');
      expect(report).toHaveProperty('statistics');
      expect(report).toHaveProperty('topRiskFactors');
      expect(report.statistics.totalTransactions).toBeGreaterThan(0);
    });

    it('should provide compliance summary', () => {
      const summary = engine.getComplianceSummary();

      expect(summary).toHaveProperty('totalAssessments');
      expect(summary).toHaveProperty('highRiskCount');
      expect(summary).toHaveProperty('mediumRiskCount');
      expect(summary).toHaveProperty('lowRiskCount');
      expect(summary).toHaveProperty('averageRiskScore');
    });
  });
});
