
/**
 * Unit tests for Sanctions Checker
 */

import { SanctionsChecker } from '../../core/ai-kyc-aml/sanctions-checker';
import { Customer, TransactionParty } from '../../core/ai-kyc-aml/types';

describe('SanctionsChecker', () => {
  let checker: SanctionsChecker;

  beforeEach(() => {
    checker = new SanctionsChecker();
  });

  const createMockCustomer = (name: string, dob?: string): Customer => ({
    id: 'CUST123',
    name,
    dateOfBirth: dob,
    nationality: 'US',
    accountCreatedAt: '2020-01-01T00:00:00Z',
  });

  const createMockParty = (name: string): TransactionParty => ({
    name,
    accountId: 'ACC123',
    country: 'US',
  });

  describe('checkCustomer', () => {
    it('should return no matches for clean customer', async () => {
      const customer = createMockCustomer('Normal Person');
      const matches = await checker.checkCustomer(customer);

      expect(matches).toHaveLength(0);
    });

    it('should detect sanctions match', async () => {
      const customer = createMockCustomer('John Restricted');
      const matches = await checker.checkCustomer(customer);

      expect(matches.length).toBeGreaterThan(0);
      if (matches.length > 0) {
        expect(matches[0]).toHaveProperty('entity');
        expect(matches[0]).toHaveProperty('matchScore');
        expect(matches[0]).toHaveProperty('matchType');
        expect(matches[0].matchScore).toBeGreaterThan(70);
      }
    });

    it('should detect exact name match', async () => {
      const customer = createMockCustomer('John Restricted', '1970-01-01');
      const matches = await checker.checkCustomer(customer);

      if (matches.length > 0) {
        const exactMatch = matches.find(m => m.matchType === 'exact');
        expect(exactMatch).toBeDefined();
      }
    });
  });

  describe('checkTransactionParty', () => {
    it('should return no matches for clean party', async () => {
      const party = createMockParty('Normal Company');
      const matches = await checker.checkTransactionParty(party);

      expect(matches).toHaveLength(0);
    });

    it('should detect sanctioned entity', async () => {
      const party = createMockParty('Restricted Entity Alpha');
      const matches = await checker.checkTransactionParty(party);

      expect(matches.length).toBeGreaterThan(0);
    });
  });

  describe('sanctions list management', () => {
    it('should return default sanctions lists', () => {
      const lists = checker.getSanctionsLists();

      expect(lists.length).toBeGreaterThan(0);
      expect(lists[0]).toHaveProperty('id');
      expect(lists[0]).toHaveProperty('source');
      expect(lists[0]).toHaveProperty('entities');
    });

    it('should add custom sanctions list', () => {
      checker.addSanctionsList({
        id: 'custom-list',
        source: 'Test Source',
        entities: [
          {
            name: 'Test Entity',
            type: 'individual',
            sanctionType: 'Test',
            addedDate: '2024-01-01',
          },
        ],
        lastUpdated: new Date().toISOString(),
      });

      const list = checker.getSanctionsList('custom-list');
      expect(list).toBeDefined();
      expect(list?.id).toBe('custom-list');
    });
  });
});
