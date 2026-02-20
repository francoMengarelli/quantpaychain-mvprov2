"use strict";
/**
 * ISO 20022 Gateway
 * Main entry point for ISO 20022 message processing
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
exports.ISO20022Transformer = exports.ISO20022Validator = exports.ISO20022Parser = exports.ISO20022Gateway = void 0;
const parser_1 = require("./parser");
const validator_1 = require("./validator");
const transformer_1 = require("./transformer");
const winston_1 = require("winston");
class ISO20022Gateway {
    constructor() {
        this.parser = new parser_1.ISO20022Parser();
        this.validator = new validator_1.ISO20022Validator();
        this.transformer = new transformer_1.ISO20022Transformer();
        this.logger = (0, winston_1.createLogger)({
            level: 'info',
            format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.errors({ stack: true }), winston_1.format.json()),
            transports: [
                new winston_1.transports.Console({
                    format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.simple()),
                }),
            ],
        });
    }
    /**
     * Parse an ISO 20022 XML message
     * @param xmlString - The XML string to parse
     * @returns ParsedMessage
     */
    parse(xmlString) {
        this.logger.info('Parsing ISO 20022 message');
        try {
            const parsed = this.parser.parse(xmlString);
            this.logger.info(`Successfully parsed ${parsed.messageType} message`);
            return parsed;
        }
        catch (error) {
            this.logger.error('Failed to parse ISO 20022 message', { error });
            throw error;
        }
    }
    /**
     * Validate a parsed ISO 20022 message
     * @param message - The parsed message to validate
     * @returns ValidationResult
     */
    validate(message) {
        this.logger.info('Validating ISO 20022 message', { messageType: message.messageType });
        try {
            const result = this.validator.validate(message);
            this.logger.info('Validation complete', {
                isValid: result.isValid,
                errorCount: result.errors.length,
                warningCount: result.warnings.length,
            });
            return result;
        }
        catch (error) {
            this.logger.error('Validation failed', { error });
            throw error;
        }
    }
    /**
     * Transform ISO 20022 message to internal format
     * @param message - Parsed ISO 20022 message
     * @param options - Transformation options
     * @returns Array of internal payment objects
     */
    toInternal(message, options) {
        this.logger.info('Transforming ISO 20022 to internal format');
        try {
            const payments = this.transformer.toInternal(message, options);
            this.logger.info(`Transformed to ${payments.length} internal payment(s)`);
            return payments;
        }
        catch (error) {
            this.logger.error('Transformation to internal format failed', { error });
            throw error;
        }
    }
    /**
     * Transform internal format to ISO 20022 XML
     * @param payments - Array of internal payment objects
     * @param messageType - Target ISO 20022 message type
     * @param options - Transformation options
     * @returns ISO 20022 XML string
     */
    toISO20022(payments, messageType, options) {
        this.logger.info('Transforming internal format to ISO 20022', {
            messageType,
            paymentCount: payments.length,
        });
        try {
            const xml = this.transformer.toISO20022(payments, messageType, options);
            this.logger.info('Successfully transformed to ISO 20022 XML');
            return xml;
        }
        catch (error) {
            this.logger.error('Transformation to ISO 20022 failed', { error });
            throw error;
        }
    }
    /**
     * Process an ISO 20022 message end-to-end:
     * Parse -> Validate -> Transform to internal format
     * @param xmlString - The XML string to process
     * @param validateMessage - Whether to validate the message (default: true)
     * @param transformOptions - Transformation options
     * @returns Object containing parsed message, validation result, and internal payments
     */
    async process(xmlString, validateMessage = true, transformOptions) {
        this.logger.info('Processing ISO 20022 message');
        // Parse
        const parsed = this.parse(xmlString);
        // Validate (optional)
        let validation;
        if (validateMessage) {
            validation = this.validate(parsed);
            if (!validation.isValid) {
                this.logger.warn('Message validation failed but continuing processing', {
                    errors: validation.errors,
                });
            }
        }
        // Transform
        const payments = this.toInternal(parsed, transformOptions);
        this.logger.info('Message processing complete', {
            messageType: parsed.messageType,
            paymentCount: payments.length,
            isValid: validation?.isValid,
        });
        return {
            parsed,
            validation,
            payments,
        };
    }
}
exports.ISO20022Gateway = ISO20022Gateway;
// Re-export types and classes
__exportStar(require("./types"), exports);
__exportStar(require("./errors"), exports);
var parser_2 = require("./parser");
Object.defineProperty(exports, "ISO20022Parser", { enumerable: true, get: function () { return parser_2.ISO20022Parser; } });
var validator_2 = require("./validator");
Object.defineProperty(exports, "ISO20022Validator", { enumerable: true, get: function () { return validator_2.ISO20022Validator; } });
var transformer_2 = require("./transformer");
Object.defineProperty(exports, "ISO20022Transformer", { enumerable: true, get: function () { return transformer_2.ISO20022Transformer; } });
