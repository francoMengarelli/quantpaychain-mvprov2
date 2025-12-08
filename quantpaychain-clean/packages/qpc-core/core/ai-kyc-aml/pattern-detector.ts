
/**
 * Pattern Detector
 * Detects suspicious patterns in transactions
 */

import {
  Transaction,
  Pattern,
  PatternMatch,
  Customer,
} from './types';
import { PatternDetectionError } from './errors';

export class PatternDetector {
  private patterns: Map<string, Pattern>;

  constructor() {
    this.patterns = new Map();
    this.initializeDefaultPatterns();
  }

  /**
   * Initialize default suspicious patterns
   */
  private initializeDefaultPatterns(): void {
    const patterns: Pattern[] = [
      {
        id: 'structuring',
        name: 'Structuring/Smurfing',
        description: 'Multiple transactions just below reporting threshold',
        type: 'suspicious',
        indicators: [
          'multiple_small_transactions',
          'amounts_below_threshold',
          'short_time_window',
        ],
        threshold: 0.7,
      },
      {
        id: 'round_tripping',
        name: 'Round Tripping',
        description: 'Funds transferred out and returned quickly',
        type: 'suspicious',
        indicators: [
          'reciprocal_transactions',
          'same_day_reversal',
          'similar_amounts',
        ],
        threshold: 0.75,
      },
      {
        id: 'layering',
        name: 'Layering',
        description: 'Complex series of transactions to obscure origin',
        type: 'suspicious',
        indicators: [
          'multiple_intermediaries',
          'cross_border_chains',
          'rapid_movement',
        ],
        threshold: 0.65,
      },
      {
        id: 'velocity',
        name: 'Rapid Velocity',
        description: 'Unusually high transaction frequency',
        type: 'suspicious',
        indicators: [
          'high_frequency',
          'above_normal_volume',
          'new_account',
        ],
        threshold: 0.6,
      },
      {
        id: 'dormancy_break',
        name: 'Dormancy Break',
        description: 'Sudden activity after long dormancy',
        type: 'suspicious',
        indicators: [
          'long_inactive_period',
          'sudden_large_transaction',
          'pattern_change',
        ],
        threshold: 0.7,
      },
    ];

    for (const pattern of patterns) {
      this.patterns.set(pattern.id, pattern);
    }
  }

  /**
   * Detect patterns in a transaction
   * @param transaction - Transaction to analyze
   * @param customer - Customer information
   * @param transactionHistory - Optional transaction history for context
   * @returns Array of pattern matches
   */
  public async detectPatterns(
    transaction: Transaction,
    customer: Customer,
    transactionHistory?: Transaction[]
  ): Promise<PatternMatch[]> {
    try {
      const matches: PatternMatch[] = [];

      for (const pattern of this.patterns.values()) {
        const match = this.evaluatePattern(pattern, transaction, customer, transactionHistory);
        if (match) {
          matches.push(match);
        }
      }

      return matches;
    } catch (error) {
      throw new PatternDetectionError(
        `Pattern detection failed: ${(error as Error).message}`
      );
    }
  }

  /**
   * Evaluate a specific pattern
   */
  private evaluatePattern(
    pattern: Pattern,
    transaction: Transaction,
    customer: Customer,
    transactionHistory?: Transaction[]
  ): PatternMatch | null {
    const matchedIndicators: string[] = [];
    let confidence = 0;

    switch (pattern.id) {
      case 'structuring':
        confidence = this.detectStructuring(transaction, transactionHistory, matchedIndicators);
        break;
      case 'round_tripping':
        confidence = this.detectRoundTripping(transaction, transactionHistory, matchedIndicators);
        break;
      case 'layering':
        confidence = this.detectLayering(transaction, transactionHistory, matchedIndicators);
        break;
      case 'velocity':
        confidence = this.detectVelocity(transaction, customer, transactionHistory, matchedIndicators);
        break;
      case 'dormancy_break':
        confidence = this.detectDormancyBreak(transaction, customer, transactionHistory, matchedIndicators);
        break;
    }

    if (confidence >= pattern.threshold) {
      return {
        pattern,
        confidence: Math.round(confidence * 100),
        matchedIndicators,
        transactions: [transaction.id],
      };
    }

    return null;
  }

  /**
   * Detect structuring pattern
   */
  private detectStructuring(
    transaction: Transaction,
    history: Transaction[] | undefined,
    indicators: string[]
  ): number {
    let confidence = 0;

    // Check if amount is just below threshold (e.g., $10,000)
    const threshold = 10000;
    if (transaction.amount > threshold * 0.8 && transaction.amount < threshold) {
      confidence += 0.4;
      indicators.push('amounts_below_threshold');
    }

    // Simulate checking for multiple similar transactions
    if (history && history.length > 5) {
      const recentSimilar = history.filter(t => 
        Math.abs(t.amount - transaction.amount) < threshold * 0.1
      );
      if (recentSimilar.length >= 3) {
        confidence += 0.4;
        indicators.push('multiple_small_transactions');
      }
    }

    return confidence;
  }

  /**
   * Detect round tripping pattern
   */
  private detectRoundTripping(
    transaction: Transaction,
    history: Transaction[] | undefined,
    indicators: string[]
  ): number {
    let confidence = 0;

    if (!history) return confidence;

    // Look for reciprocal transactions
    const reciprocal = history.find(t =>
      t.sender.accountId === transaction.receiver.accountId &&
      t.receiver.accountId === transaction.sender.accountId &&
      Math.abs(t.amount - transaction.amount) < transaction.amount * 0.1
    );

    if (reciprocal) {
      confidence += 0.6;
      indicators.push('reciprocal_transactions');

      // Check if same day
      const txDate = new Date(transaction.timestamp).toDateString();
      const reciprocalDate = new Date(reciprocal.timestamp).toDateString();
      if (txDate === reciprocalDate) {
        confidence += 0.2;
        indicators.push('same_day_reversal');
      }
    }

    return confidence;
  }

  /**
   * Detect layering pattern
   */
  private detectLayering(
    transaction: Transaction,
    history: Transaction[] | undefined,
    indicators: string[]
  ): number {
    let confidence = 0;

    // Simplified layering detection
    // In production, would analyze transaction chains
    if (history && history.length > 10) {
      confidence += 0.3;
      indicators.push('multiple_intermediaries');
    }

    // Check for cross-border
    if (transaction.sender.country !== transaction.receiver.country) {
      confidence += 0.2;
      indicators.push('cross_border_chains');
    }

    return confidence;
  }

  /**
   * Detect velocity pattern
   */
  private detectVelocity(
    transaction: Transaction,
    customer: Customer,
    history: Transaction[] | undefined,
    indicators: string[]
  ): number {
    let confidence = 0;

    if (!history) return confidence;

    // Check transaction frequency
    const last24Hours = Date.now() - (24 * 60 * 60 * 1000);
    const recentTxs = history.filter(t => 
      new Date(t.timestamp).getTime() > last24Hours
    );

    if (recentTxs.length > 10) {
      confidence += 0.5;
      indicators.push('high_frequency');
    }

    // Check if new account
    const accountAge = Date.now() - new Date(customer.accountCreatedAt).getTime();
    const accountAgeDays = accountAge / (1000 * 60 * 60 * 24);

    if (accountAgeDays < 30 && recentTxs.length > 5) {
      confidence += 0.3;
      indicators.push('new_account');
    }

    return confidence;
  }

  /**
   * Detect dormancy break pattern
   */
  private detectDormancyBreak(
    transaction: Transaction,
    customer: Customer,
    history: Transaction[] | undefined,
    indicators: string[]
  ): number {
    let confidence = 0;

    if (!history || history.length === 0) return confidence;

    // Simulate dormancy check
    // In production, would check actual transaction history
    const accountAge = Date.now() - new Date(customer.accountCreatedAt).getTime();
    const accountAgeDays = accountAge / (1000 * 60 * 60 * 24);

    if (accountAgeDays > 180 && history.length < 2) {
      confidence += 0.5;
      indicators.push('long_inactive_period');

      if (transaction.amount > 10000) {
        confidence += 0.3;
        indicators.push('sudden_large_transaction');
      }
    }

    return confidence;
  }

  /**
   * Add custom pattern
   * @param pattern - Pattern to add
   */
  public addPattern(pattern: Pattern): void {
    this.patterns.set(pattern.id, pattern);
  }

  /**
   * Get all patterns
   */
  public getPatterns(): Pattern[] {
    return Array.from(this.patterns.values());
  }

  /**
   * Get pattern by ID
   */
  public getPattern(patternId: string): Pattern | undefined {
    return this.patterns.get(patternId);
  }
}
