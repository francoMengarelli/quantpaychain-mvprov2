
/**
 * Sanctions List Checker
 * Checks entities against sanctions lists
 */

import {
  SanctionsList,
  SanctionedEntity,
  SanctionMatch,
  Customer,
  TransactionParty,
} from './types';
import { SanctionsCheckError } from './errors';

export class SanctionsChecker {
  private sanctionsLists: Map<string, SanctionsList>;

  constructor() {
    this.sanctionsLists = new Map();
    this.initializeDefaultSanctions();
  }

  /**
   * Initialize with default sanctions lists (for demonstration)
   */
  private initializeDefaultSanctions(): void {
    // In production, this would load from actual sanctions databases
    const defaultList: SanctionsList = {
      id: 'default',
      source: 'OFAC/UN/EU Consolidated',
      entities: [
        {
          name: 'Restricted Entity Alpha',
          aliases: ['REA', 'Entity A'],
          type: 'organization',
          sanctionType: 'Financial sanctions',
          addedDate: '2020-01-01',
        },
        {
          name: 'John Restricted',
          dateOfBirth: '1970-01-01',
          nationality: 'XX',
          type: 'individual',
          sanctionType: 'Asset freeze',
          addedDate: '2019-06-15',
        },
      ],
      lastUpdated: new Date().toISOString(),
    };

    this.sanctionsLists.set(defaultList.id, defaultList);
  }

  /**
   * Check customer against sanctions lists
   * @param customer - Customer to check
   * @returns Array of sanction matches
   */
  public async checkCustomer(customer: Customer): Promise<SanctionMatch[]> {
    try {
      const matches: SanctionMatch[] = [];

      for (const list of this.sanctionsLists.values()) {
        for (const entity of list.entities) {
          const match = this.matchEntity(customer.name, customer.dateOfBirth, entity);
          if (match) {
            matches.push(match);
          }
        }
      }

      return matches;
    } catch (error) {
      throw new SanctionsCheckError(
        `Sanctions check failed: ${(error as Error).message}`
      );
    }
  }

  /**
   * Check transaction party against sanctions lists
   * @param party - Transaction party to check
   * @returns Array of sanction matches
   */
  public async checkTransactionParty(party: TransactionParty): Promise<SanctionMatch[]> {
    try {
      const matches: SanctionMatch[] = [];

      for (const list of this.sanctionsLists.values()) {
        for (const entity of list.entities) {
          const match = this.matchEntity(party.name, undefined, entity);
          if (match) {
            matches.push(match);
          }
        }
      }

      return matches;
    } catch (error) {
      throw new SanctionsCheckError(
        `Transaction party sanctions check failed: ${(error as Error).message}`
      );
    }
  }

  /**
   * Match an entity against sanctioned entity
   */
  private matchEntity(
    name: string,
    dateOfBirth: string | undefined,
    sanctionedEntity: SanctionedEntity
  ): SanctionMatch | null {
    const matchedFields: string[] = [];
    let matchScore = 0;
    let matchType: 'exact' | 'fuzzy' | 'alias' = 'exact';

    // Exact name match
    if (name.toLowerCase() === sanctionedEntity.name.toLowerCase()) {
      matchScore += 100;
      matchedFields.push('name');
    }
    // Alias match
    else if (sanctionedEntity.aliases?.some(alias => 
      name.toLowerCase().includes(alias.toLowerCase()) ||
      alias.toLowerCase().includes(name.toLowerCase())
    )) {
      matchScore += 80;
      matchedFields.push('alias');
      matchType = 'alias';
    }
    // Fuzzy name match
    else {
      const similarity = this.calculateStringSimilarity(name, sanctionedEntity.name);
      if (similarity > 0.8) {
        matchScore += Math.round(similarity * 70);
        matchedFields.push('name_fuzzy');
        matchType = 'fuzzy';
      } else {
        return null; // No significant match
      }
    }

    // Date of birth match (if available)
    if (dateOfBirth && sanctionedEntity.dateOfBirth) {
      if (dateOfBirth === sanctionedEntity.dateOfBirth) {
        matchScore = Math.min(matchScore + 20, 100);
        matchedFields.push('dateOfBirth');
      }
    }

    // Only return matches with score > 70
    if (matchScore > 70) {
      return {
        entity: sanctionedEntity,
        matchScore,
        matchType,
        matchedFields,
      };
    }

    return null;
  }

  /**
   * Calculate string similarity using Levenshtein distance
   */
  private calculateStringSimilarity(str1: string, str2: string): number {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();

    const costs: number[] = [];
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
      if (i > 0) {
        costs[s2.length] = lastValue;
      }
    }

    const maxLength = Math.max(s1.length, s2.length);
    return maxLength === 0 ? 1 : 1 - (costs[s2.length] / maxLength);
  }

  /**
   * Add a sanctions list
   * @param list - Sanctions list to add
   */
  public addSanctionsList(list: SanctionsList): void {
    this.sanctionsLists.set(list.id, list);
  }

  /**
   * Update sanctions list
   * @param listId - List ID
   * @param entities - Updated entities
   */
  public updateSanctionsList(listId: string, entities: SanctionedEntity[]): void {
    const list = this.sanctionsLists.get(listId);
    if (!list) {
      throw new SanctionsCheckError(`Sanctions list not found: ${listId}`);
    }

    list.entities = entities;
    list.lastUpdated = new Date().toISOString();
    this.sanctionsLists.set(listId, list);
  }

  /**
   * Get all sanctions lists
   */
  public getSanctionsLists(): SanctionsList[] {
    return Array.from(this.sanctionsLists.values());
  }

  /**
   * Get sanctions list by ID
   */
  public getSanctionsList(listId: string): SanctionsList | undefined {
    return this.sanctionsLists.get(listId);
  }
}
