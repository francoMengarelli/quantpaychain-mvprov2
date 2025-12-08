
/**
 * ISO 20022 Gateway
 * Main entry point for ISO 20022 message processing
 */

import { ISO20022Parser } from './parser';
import { ISO20022Validator } from './validator';
import { ISO20022Transformer, InternalPayment } from './transformer';
import {
  ParsedMessage,
  ValidationResult,
  ISO20022MessageType,
  TransformationOptions,
} from './types';
import { createLogger, format, transports } from 'winston';

export class ISO20022Gateway {
  private parser: ISO20022Parser;
  private validator: ISO20022Validator;
  private transformer: ISO20022Transformer;
  private logger: any;

  constructor() {
    this.parser = new ISO20022Parser();
    this.validator = new ISO20022Validator();
    this.transformer = new ISO20022Transformer();
    
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
  }

  /**
   * Parse an ISO 20022 XML message
   * @param xmlString - The XML string to parse
   * @returns ParsedMessage
   */
  public parse(xmlString: string): ParsedMessage {
    this.logger.info('Parsing ISO 20022 message');
    try {
      const parsed = this.parser.parse(xmlString);
      this.logger.info(`Successfully parsed ${parsed.messageType} message`);
      return parsed;
    } catch (error) {
      this.logger.error('Failed to parse ISO 20022 message', { error });
      throw error;
    }
  }

  /**
   * Validate a parsed ISO 20022 message
   * @param message - The parsed message to validate
   * @returns ValidationResult
   */
  public validate(message: ParsedMessage): ValidationResult {
    this.logger.info('Validating ISO 20022 message', { messageType: message.messageType });
    try {
      const result = this.validator.validate(message);
      this.logger.info('Validation complete', {
        isValid: result.isValid,
        errorCount: result.errors.length,
        warningCount: result.warnings.length,
      });
      return result;
    } catch (error) {
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
  public toInternal(
    message: ParsedMessage,
    options?: TransformationOptions
  ): InternalPayment[] {
    this.logger.info('Transforming ISO 20022 to internal format');
    try {
      const payments = this.transformer.toInternal(message, options);
      this.logger.info(`Transformed to ${payments.length} internal payment(s)`);
      return payments;
    } catch (error) {
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
  public toISO20022(
    payments: InternalPayment[],
    messageType?: ISO20022MessageType,
    options?: TransformationOptions
  ): string {
    this.logger.info('Transforming internal format to ISO 20022', {
      messageType,
      paymentCount: payments.length,
    });
    try {
      const xml = this.transformer.toISO20022(payments, messageType, options);
      this.logger.info('Successfully transformed to ISO 20022 XML');
      return xml;
    } catch (error) {
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
  public async process(
    xmlString: string,
    validateMessage: boolean = true,
    transformOptions?: TransformationOptions
  ): Promise<{
    parsed: ParsedMessage;
    validation?: ValidationResult;
    payments: InternalPayment[];
  }> {
    this.logger.info('Processing ISO 20022 message');

    // Parse
    const parsed = this.parse(xmlString);

    // Validate (optional)
    let validation: ValidationResult | undefined;
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

// Re-export types and classes
export * from './types';
export * from './errors';
export { ISO20022Parser } from './parser';
export { ISO20022Validator } from './validator';
export { ISO20022Transformer } from './transformer';
export type { InternalPayment } from './transformer';
