"use strict";
/**
 * AI Risk Scorer
 * Calculates risk scores for transactions using AI-powered algorithms
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIRiskScorer = void 0;
const types_1 = require("./types");
const errors_1 = require("./errors");
class AIRiskScorer {
    constructor(config) {
        this.config = config;
    }
    /**
     * Assess risk for a transaction
     * @param transaction - Transaction to assess
     * @param customer - Customer information
     * @returns RiskAssessment
     */
    async assessRisk(transaction, customer) {
        try {
            const factors = [];
            // 1. Transaction amount risk
            const amountRisk = this.assessAmountRisk(transaction);
            if (amountRisk.impact > 0) {
                factors.push(amountRisk);
            }
            // 2. Geographic risk
            const geoRisk = this.assessGeographicRisk(transaction, customer);
            if (geoRisk.impact > 0) {
                factors.push(geoRisk);
            }
            // 3. Frequency risk
            const frequencyRisk = this.assessFrequencyRisk(transaction, customer);
            if (frequencyRisk.impact > 0) {
                factors.push(frequencyRisk);
            }
            // 4. Customer profile risk
            const profileRisk = this.assessCustomerProfileRisk(customer);
            if (profileRisk.impact > 0) {
                factors.push(profileRisk);
            }
            // 5. Behavioral risk
            const behaviorRisk = this.assessBehavioralRisk(transaction, customer);
            if (behaviorRisk.impact > 0) {
                factors.push(behaviorRisk);
            }
            // Calculate overall risk score
            const riskScore = this.calculateOverallRiskScore(factors);
            const riskLevel = this.determineRiskLevel(riskScore);
            const recommendation = this.determineRecommendation(riskScore);
            return {
                transactionId: transaction.id,
                customerId: customer.id,
                riskLevel,
                riskScore,
                factors,
                flags: [],
                recommendation,
                assessedAt: new Date().toISOString(),
                assessedBy: 'ai',
            };
        }
        catch (error) {
            throw new errors_1.RiskAssessmentError(`Risk assessment failed: ${error.message}`);
        }
    }
    /**
     * Assess risk based on transaction amount
     */
    assessAmountRisk(transaction) {
        let impact = 0;
        let description = '';
        const amount = transaction.amount;
        const thresholds = this.config.transactionThresholds;
        if (amount >= thresholds.high) {
            impact = 80;
            description = `Very high transaction amount: ${amount} ${transaction.currency}`;
        }
        else if (amount >= thresholds.medium) {
            impact = 50;
            description = `High transaction amount: ${amount} ${transaction.currency}`;
        }
        else if (amount >= thresholds.low) {
            impact = 25;
            description = `Moderate transaction amount: ${amount} ${transaction.currency}`;
        }
        else {
            impact = 5;
            description = `Normal transaction amount: ${amount} ${transaction.currency}`;
        }
        return {
            type: 'amount',
            description,
            impact,
            weight: 0.3,
        };
    }
    /**
     * Assess geographic risk
     */
    assessGeographicRisk(transaction, customer) {
        let impact = 0;
        let description = '';
        const senderCountry = transaction.sender.country || customer.address?.country;
        const receiverCountry = transaction.receiver.country;
        const highRiskCountries = this.config.highRiskCountries;
        if (senderCountry && highRiskCountries.includes(senderCountry)) {
            impact += 60;
            description += `Sender from high-risk country: ${senderCountry}. `;
        }
        if (receiverCountry && highRiskCountries.includes(receiverCountry)) {
            impact += 60;
            description += `Receiver in high-risk country: ${receiverCountry}. `;
        }
        // Cross-border transaction
        if (senderCountry && receiverCountry && senderCountry !== receiverCountry) {
            impact += 15;
            description += 'Cross-border transaction. ';
        }
        return {
            type: 'geographic',
            description: description || 'No geographic risk detected',
            impact: Math.min(impact, 100),
            weight: 0.25,
        };
    }
    /**
     * Assess frequency risk (simplified - would need transaction history)
     */
    assessFrequencyRisk(transaction, customer) {
        // Simulate frequency analysis
        // In production, this would analyze transaction history
        const randomFrequency = Math.random();
        let impact = 0;
        let description = '';
        if (randomFrequency > 0.9) {
            impact = 70;
            description = 'Unusually high transaction frequency detected';
        }
        else if (randomFrequency > 0.7) {
            impact = 40;
            description = 'Above average transaction frequency';
        }
        else {
            impact = 10;
            description = 'Normal transaction frequency';
        }
        return {
            type: 'frequency',
            description,
            impact,
            weight: 0.2,
        };
    }
    /**
     * Assess customer profile risk
     */
    assessCustomerProfileRisk(customer) {
        let impact = 0;
        let description = '';
        // Check account age
        const accountAge = Date.now() - new Date(customer.accountCreatedAt).getTime();
        const accountAgeDays = accountAge / (1000 * 60 * 60 * 24);
        if (accountAgeDays < 7) {
            impact += 50;
            description += 'Very new account (< 7 days). ';
        }
        else if (accountAgeDays < 30) {
            impact += 30;
            description += 'New account (< 30 days). ';
        }
        // Check missing information
        if (!customer.address) {
            impact += 20;
            description += 'Missing address information. ';
        }
        if (!customer.identification) {
            impact += 30;
            description += 'Missing identification. ';
        }
        return {
            type: 'customer_profile',
            description: description || 'Customer profile appears normal',
            impact: Math.min(impact, 100),
            weight: 0.15,
        };
    }
    /**
     * Assess behavioral risk
     */
    assessBehavioralRisk(transaction, customer) {
        // Simulate behavioral analysis using AI patterns
        let impact = 0;
        let description = '';
        // Check for structured transactions (just below reporting threshold)
        if (transaction.amount > this.config.transactionThresholds.low * 0.9 &&
            transaction.amount < this.config.transactionThresholds.low) {
            impact += 40;
            description += 'Possible structuring behavior detected. ';
        }
        // Check transaction description for suspicious keywords
        const suspiciousKeywords = ['cash', 'urgent', 'secret', 'offshore', 'anonymous'];
        const desc = (transaction.description || '').toLowerCase();
        const hasSuspiciousKeyword = suspiciousKeywords.some(keyword => desc.includes(keyword));
        if (hasSuspiciousKeyword) {
            impact += 50;
            description += 'Suspicious keywords in description. ';
        }
        return {
            type: 'behavioral',
            description: description || 'No behavioral anomalies detected',
            impact: Math.min(impact, 100),
            weight: 0.1,
        };
    }
    /**
     * Calculate overall risk score from factors
     */
    calculateOverallRiskScore(factors) {
        let weightedSum = 0;
        let totalWeight = 0;
        for (const factor of factors) {
            weightedSum += factor.impact * factor.weight;
            totalWeight += factor.weight;
        }
        return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
    }
    /**
     * Determine risk level from score
     */
    determineRiskLevel(riskScore) {
        if (riskScore >= 75)
            return types_1.RiskLevel.CRITICAL;
        if (riskScore >= 50)
            return types_1.RiskLevel.HIGH;
        if (riskScore >= 25)
            return types_1.RiskLevel.MEDIUM;
        return types_1.RiskLevel.LOW;
    }
    /**
     * Determine recommendation from risk score
     */
    determineRecommendation(riskScore) {
        if (riskScore >= this.config.autoRejectionThreshold) {
            return types_1.TransactionStatus.REJECTED;
        }
        if (riskScore >= this.config.autoApprovalThreshold) {
            return types_1.TransactionStatus.PENDING_REVIEW;
        }
        return types_1.TransactionStatus.APPROVED;
    }
}
exports.AIRiskScorer = AIRiskScorer;
