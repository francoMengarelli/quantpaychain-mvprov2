
/**
 * Unit tests for AI Risk Scorer
 */

import { AIRiskScorer } from '../../core/ai-kyc-aml/risk-scorer';
import { Transaction, Customer, AMLConfig } from '../../core/ai-kyc-aml/types';

describe('AIRiskScorer', () => {
  let scorer: AIRiskScorer;
  let config: AMLConfig;

  beforeEach(() => {
    config = {
      sanctionsCheckEnabled: true,
      pepCheckEnabled: true,
      adverseMediaCheckEnabled: true,
      transactionMonitoringEnabled: true,
      documentVerificationEnabled: true,
      highRiskCountries: ['XX', 'YY', 'ZZ'],
      transactionThresholds: {
        low: 10000,
        medium: 50000,
        high: 100000,
      },
      autoApprovalThreshold: 30,
      autoRejectionThreshold: 80,
    };

    scorer = new AIRiskScorer(config);
  });

  const createMockCustomer = (): Customer => ({
    id: 'CUST123',
    name: 'John Doe',
    dateOfBirth: '1990-01-01',
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
      number: 'P123456',
      issuingCountry: 'US',
    },
    accountCreatedAt: '2020-01-01T00:00:00Z',
  });

  const createMockTransaction = (overrides?: Partial<Transaction>): Transaction => ({
    id: 'TXN123',
    customerId: 'CUST123',
    amount: 5000,
    currency: 'USD',
    sender: {
      name: 'John Doe',
      accountId: 'ACC123',
      country: 'US',
    },
    receiver: {
      name: 'Jane Smith',
      accountId: 'ACC456',
      country: 'US',
    },
    timestamp: new Date().toISOString(),
    type: 'credit',
    ...overrides,
  });

  describe('assessRisk', () => {
    it('should assess low risk for normal transaction', async () => {
      const transaction = createMockTransaction();
      const customer = createMockCustomer();

      const assessment = await scorer.assessRisk(transaction, customer);

      expect(assessment).toHaveProperty('transactionId');
      expect(assessment).toHaveProperty('customerId');
      expect(assessment).toHaveProperty('riskLevel');
      expect(assessment).toHaveProperty('riskScore');
      expect(assessment).toHaveProperty('factors');
      expect(assessment.riskScore).toBeLessThan(30);
    });

    it('should assess higher risk for large transaction', async () => {
      const transaction = createMockTransaction({ amount: 150000 });
      const customer = createMockCustomer();

      const assessment = await scorer.assessRisk(transaction, customer);

      expect(assessment.riskScore).toBeGreaterThan(30);
      const amountFactor = assessment.factors.find(f => f.type === 'amount');
      expect(amountFactor).toBeDefined();
    });

    it('should assess higher risk for high-risk country', async () => {
      const transaction = createMockTransaction({
        receiver: {
          name: 'Jane Smith',
          accountId: 'ACC456',
          country: 'XX', // High-risk country
        },
      });
      const customer = createMockCustomer();

      const assessment = await scorer.assessRisk(transaction, customer);

      const geoFactor = assessment.factors.find(f => f.type === 'geographic');
      expect(geoFactor).toBeDefined();
      expect(geoFactor?.impact).toBeGreaterThan(50);
    });

    it('should assess higher risk for new customer', async () => {
      const transaction = createMockTransaction();
      const customer = createMockCustomer();
      customer.accountCreatedAt = new Date().toISOString(); // Very new account

      const assessment = await scorer.assessRisk(transaction, customer);

      const profileFactor = assessment.factors.find(f => f.type === 'customer_profile');
      expect(profileFactor).toBeDefined();
    });

    it('should recommend approval for low risk', async () => {
      const transaction = createMockTransaction({ amount: 100 });
      const customer = createMockCustomer();

      const assessment = await scorer.assessRisk(transaction, customer);

      expect(assessment.recommendation).toBe('approved');
    });

    it('should recommend rejection for very high risk', async () => {
      const transaction = createMockTransaction({
        amount: 200000,
        receiver: { name: 'Test', accountId: 'TEST', country: 'XX' },
        description: 'cash urgent offshore',
      });
      const customer = createMockCustomer();
      customer.accountCreatedAt = new Date().toISOString();
      customer.address = undefined;
      customer.identification = undefined;

      const assessment = await scorer.assessRisk(transaction, customer);

      // This should have high risk score
      expect(assessment.riskScore).toBeGreaterThan(60);
    });
  });
});
