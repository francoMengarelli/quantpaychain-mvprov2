"use strict";
/**
 * ISO 20022 Message Validator
 * Validates ISO 20022 messages against schemas and business rules
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ISO20022Validator = void 0;
const ajv_1 = __importDefault(require("ajv"));
const types_1 = require("./types");
const errors_1 = require("./errors");
class ISO20022Validator {
    constructor() {
        this.ajv = new ajv_1.default({ allErrors: true });
        this.schemas = new Map();
        this.initializeSchemas();
    }
    /**
     * Validate a parsed ISO 20022 message
     * @param message - The parsed message to validate
     * @returns ValidationResult
     */
    validate(message) {
        const errors = [];
        const warnings = [];
        // Schema validation
        const schemaValidator = this.schemas.get(message.messageType);
        if (schemaValidator) {
            const valid = schemaValidator(message.data);
            if (!valid && schemaValidator.errors) {
                errors.push(...schemaValidator.errors.map((err) => ({
                    code: 'SCHEMA_VALIDATION',
                    message: `${err.instancePath} ${err.message}`,
                    path: err.instancePath,
                    severity: 'error',
                })));
            }
        }
        // Business rule validation
        const businessRuleErrors = this.validateBusinessRules(message);
        errors.push(...businessRuleErrors);
        // Check for warnings
        const warningMessages = this.checkWarnings(message);
        warnings.push(...warningMessages);
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
        };
    }
    /**
     * Validate and throw if invalid
     * @param message - The parsed message to validate
     * @throws ISO20022ValidationError if validation fails
     */
    validateOrThrow(message) {
        const result = this.validate(message);
        if (!result.isValid) {
            throw new errors_1.ISO20022ValidationError('Message validation failed', result.errors);
        }
    }
    /**
     * Initialize validation schemas for different message types
     */
    initializeSchemas() {
        // PAIN.001 Schema
        const pain001Schema = {
            type: 'object',
            required: ['header', 'paymentInstructions'],
            properties: {
                header: {
                    type: 'object',
                    required: ['messageId', 'creationDateTime'],
                    properties: {
                        messageId: { type: 'string', minLength: 1, maxLength: 35 },
                        creationDateTime: { type: 'string' },
                        numberOfTransactions: { type: 'string' },
                        controlSum: { type: 'number' },
                    },
                },
                paymentInstructions: {
                    type: 'array',
                    minItems: 1,
                    items: {
                        type: 'object',
                        required: ['paymentInformationId', 'paymentMethod', 'debtor', 'debtorAccount', 'creditTransactions'],
                        properties: {
                            paymentInformationId: { type: 'string', minLength: 1, maxLength: 35 },
                            paymentMethod: { type: 'string' },
                            creditTransactions: {
                                type: 'array',
                                minItems: 1,
                            },
                        },
                    },
                },
            },
        };
        this.schemas.set(types_1.ISO20022MessageType.PAIN_001, this.ajv.compile(pain001Schema));
        // Additional schemas can be added for PACS.008 and CAMT.053
    }
    /**
     * Validate business rules
     */
    validateBusinessRules(message) {
        const errors = [];
        switch (message.messageType) {
            case types_1.ISO20022MessageType.PAIN_001:
                errors.push(...this.validatePAIN001BusinessRules(message.data));
                break;
            // Add cases for other message types
        }
        return errors;
    }
    /**
     * Validate PAIN.001 specific business rules
     */
    validatePAIN001BusinessRules(message) {
        const errors = [];
        // Rule: Control sum must match sum of all transaction amounts
        const declaredControlSum = message.header.controlSum;
        if (declaredControlSum !== undefined) {
            let calculatedSum = 0;
            for (const pmtInf of message.paymentInstructions) {
                for (const tx of pmtInf.creditTransactions) {
                    calculatedSum += tx.amount.value;
                }
            }
            if (Math.abs(calculatedSum - declaredControlSum) > 0.01) {
                errors.push({
                    code: 'CONTROL_SUM_MISMATCH',
                    message: `Control sum mismatch: declared ${declaredControlSum}, calculated ${calculatedSum}`,
                    path: '/header/controlSum',
                    severity: 'error',
                });
            }
        }
        // Rule: Number of transactions must match actual count
        const declaredTxCount = message.header.numberOfTransactions;
        if (declaredTxCount !== undefined) {
            let actualCount = 0;
            for (const pmtInf of message.paymentInstructions) {
                actualCount += pmtInf.creditTransactions.length;
            }
            if (parseInt(declaredTxCount) !== actualCount) {
                errors.push({
                    code: 'TRANSACTION_COUNT_MISMATCH',
                    message: `Transaction count mismatch: declared ${declaredTxCount}, actual ${actualCount}`,
                    path: '/header/numberOfTransactions',
                    severity: 'error',
                });
            }
        }
        // Rule: All amounts must be positive
        for (let i = 0; i < message.paymentInstructions.length; i++) {
            const pmtInf = message.paymentInstructions[i];
            for (let j = 0; j < pmtInf.creditTransactions.length; j++) {
                const tx = pmtInf.creditTransactions[j];
                if (tx.amount.value <= 0) {
                    errors.push({
                        code: 'INVALID_AMOUNT',
                        message: `Amount must be positive: ${tx.amount.value}`,
                        path: `/paymentInstructions/${i}/creditTransactions/${j}/amount`,
                        severity: 'error',
                    });
                }
            }
        }
        // Rule: Currency codes must be valid (ISO 4217)
        const validCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'CNY'];
        for (let i = 0; i < message.paymentInstructions.length; i++) {
            const pmtInf = message.paymentInstructions[i];
            for (let j = 0; j < pmtInf.creditTransactions.length; j++) {
                const tx = pmtInf.creditTransactions[j];
                if (!validCurrencies.includes(tx.amount.currency)) {
                    errors.push({
                        code: 'INVALID_CURRENCY',
                        message: `Invalid currency code: ${tx.amount.currency}`,
                        path: `/paymentInstructions/${i}/creditTransactions/${j}/amount/currency`,
                        severity: 'error',
                    });
                }
            }
        }
        return errors;
    }
    /**
     * Check for warning conditions
     */
    checkWarnings(message) {
        const warnings = [];
        switch (message.messageType) {
            case types_1.ISO20022MessageType.PAIN_001:
                warnings.push(...this.checkPAIN001Warnings(message.data));
                break;
        }
        return warnings;
    }
    /**
     * Check PAIN.001 warnings
     */
    checkPAIN001Warnings(message) {
        const warnings = [];
        // Warning: Large transaction amounts
        for (let i = 0; i < message.paymentInstructions.length; i++) {
            const pmtInf = message.paymentInstructions[i];
            for (let j = 0; j < pmtInf.creditTransactions.length; j++) {
                const tx = pmtInf.creditTransactions[j];
                if (tx.amount.value > 1000000) {
                    warnings.push({
                        code: 'LARGE_AMOUNT',
                        message: `Large transaction amount detected: ${tx.amount.value} ${tx.amount.currency}`,
                        path: `/paymentInstructions/${i}/creditTransactions/${j}/amount`,
                        severity: 'warning',
                    });
                }
            }
        }
        // Warning: Missing optional but recommended fields
        if (!message.header.initiatingParty) {
            warnings.push({
                code: 'MISSING_RECOMMENDED_FIELD',
                message: 'Initiating party information is recommended',
                path: '/header/initiatingParty',
                severity: 'warning',
            });
        }
        return warnings;
    }
}
exports.ISO20022Validator = ISO20022Validator;
