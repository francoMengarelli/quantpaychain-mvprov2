"use strict";
/**
 * AML Rules Engine
 * Configurable rules engine for compliance checks
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AMLRulesEngine = void 0;
const types_1 = require("./types");
class AMLRulesEngine {
    constructor() {
        this.rules = new Map();
        this.initializeDefaultRules();
    }
    /**
     * Initialize default AML rules
     */
    initializeDefaultRules() {
        const defaultRules = [
            {
                id: 'large_transaction',
                name: 'Large Transaction Alert',
                description: 'Flag transactions above $50,000',
                enabled: true,
                conditions: [
                    {
                        field: 'amount',
                        operator: 'greater_than',
                        value: 50000,
                    },
                ],
                action: {
                    type: 'flag',
                    severity: types_1.RiskLevel.HIGH,
                    message: 'Large transaction requires review',
                },
                priority: 8,
            },
            {
                id: 'high_risk_country',
                name: 'High Risk Country',
                description: 'Flag transactions involving high-risk countries',
                enabled: true,
                conditions: [
                    {
                        field: 'receiver.country',
                        operator: 'equals',
                        value: ['HIGHRISK1', 'HIGHRISK2'],
                    },
                ],
                action: {
                    type: 'review',
                    severity: types_1.RiskLevel.HIGH,
                    message: 'Transaction involves high-risk country',
                },
                priority: 9,
            },
            {
                id: 'suspicious_description',
                name: 'Suspicious Description Keywords',
                description: 'Flag transactions with suspicious keywords',
                enabled: true,
                conditions: [
                    {
                        field: 'description',
                        operator: 'contains',
                        value: ['cash', 'bitcoin', 'crypto', 'offshore'],
                    },
                ],
                action: {
                    type: 'flag',
                    severity: types_1.RiskLevel.MEDIUM,
                    message: 'Suspicious keywords detected in description',
                },
                priority: 6,
            },
            {
                id: 'rapid_succession',
                name: 'Rapid Transaction Succession',
                description: 'Flag multiple transactions in short time',
                enabled: true,
                conditions: [
                    {
                        field: 'transactionCount24h',
                        operator: 'greater_than',
                        value: 10,
                    },
                ],
                action: {
                    type: 'flag',
                    severity: types_1.RiskLevel.MEDIUM,
                    message: 'Unusual transaction frequency detected',
                },
                priority: 7,
            },
        ];
        for (const rule of defaultRules) {
            this.rules.set(rule.id, rule);
        }
    }
    /**
     * Evaluate all rules for a transaction
     * @param transaction - Transaction to evaluate
     * @param customer - Customer information
     * @param context - Additional context
     * @returns Array of triggered rules with actions
     */
    evaluateRules(transaction, customer, context) {
        const results = [];
        // Get enabled rules sorted by priority
        const enabledRules = Array.from(this.rules.values())
            .filter(rule => rule.enabled)
            .sort((a, b) => b.priority - a.priority);
        for (const rule of enabledRules) {
            const matched = this.evaluateRule(rule, transaction, customer, context);
            if (matched) {
                results.push({
                    rule,
                    matched: true,
                    action: rule.action,
                });
            }
        }
        return results;
    }
    /**
     * Evaluate a single rule
     */
    evaluateRule(rule, transaction, customer, context) {
        // All conditions must be met (AND logic)
        for (const condition of rule.conditions) {
            if (!this.evaluateCondition(condition, transaction, customer, context)) {
                return false;
            }
        }
        return true;
    }
    /**
     * Evaluate a single condition
     */
    evaluateCondition(condition, transaction, customer, context) {
        const fieldValue = this.getFieldValue(condition.field, transaction, customer, context);
        switch (condition.operator) {
            case 'equals':
                if (Array.isArray(condition.value)) {
                    return condition.value.includes(fieldValue);
                }
                return fieldValue === condition.value;
            case 'greater_than':
                return typeof fieldValue === 'number' && fieldValue > condition.value;
            case 'less_than':
                return typeof fieldValue === 'number' && fieldValue < condition.value;
            case 'contains':
                if (typeof fieldValue !== 'string')
                    return false;
                if (Array.isArray(condition.value)) {
                    return condition.value.some(keyword => fieldValue.toLowerCase().includes(keyword.toLowerCase()));
                }
                return fieldValue.toLowerCase().includes(String(condition.value).toLowerCase());
            case 'matches_pattern':
                if (typeof fieldValue !== 'string')
                    return false;
                const pattern = new RegExp(condition.value);
                return pattern.test(fieldValue);
            default:
                return false;
        }
    }
    /**
     * Get field value from transaction/customer data
     */
    getFieldValue(field, transaction, customer, context) {
        // Handle nested fields (e.g., "receiver.country")
        const parts = field.split('.');
        let value;
        if (parts[0] === 'customer') {
            value = customer;
            for (let i = 1; i < parts.length; i++) {
                value = value?.[parts[i]];
            }
        }
        else if (parts[0] === 'context') {
            value = context;
            for (let i = 1; i < parts.length; i++) {
                value = value?.[parts[i]];
            }
        }
        else {
            value = transaction;
            for (const part of parts) {
                value = value?.[part];
            }
        }
        return value;
    }
    /**
     * Add a custom rule
     * @param rule - Rule to add
     */
    addRule(rule) {
        this.rules.set(rule.id, rule);
    }
    /**
     * Update an existing rule
     * @param ruleId - Rule ID
     * @param updates - Fields to update
     */
    updateRule(ruleId, updates) {
        const rule = this.rules.get(ruleId);
        if (!rule) {
            throw new Error(`Rule not found: ${ruleId}`);
        }
        this.rules.set(ruleId, { ...rule, ...updates });
    }
    /**
     * Delete a rule
     * @param ruleId - Rule ID
     */
    deleteRule(ruleId) {
        this.rules.delete(ruleId);
    }
    /**
     * Enable/disable a rule
     * @param ruleId - Rule ID
     * @param enabled - Enable or disable
     */
    setRuleEnabled(ruleId, enabled) {
        const rule = this.rules.get(ruleId);
        if (!rule) {
            throw new Error(`Rule not found: ${ruleId}`);
        }
        rule.enabled = enabled;
        this.rules.set(ruleId, rule);
    }
    /**
     * Get all rules
     */
    getRules() {
        return Array.from(this.rules.values());
    }
    /**
     * Get rule by ID
     */
    getRule(ruleId) {
        return this.rules.get(ruleId);
    }
}
exports.AMLRulesEngine = AMLRulesEngine;
