
/**
 * ISO20022 Wrappers
 * Simplified functions wrapping the QPC v2 Core classes
 */

import { ISO20022Gateway, ISO20022MessageType } from '@/qpc-v2-core/core/iso20022-gateway';

// Create singleton instance
const gateway = new ISO20022Gateway();

/**
 * Parse an ISO 20022 XML message
 */
export async function parseISO20022Message(xml: string) {
  return gateway.parse(xml);
}

/**
 * Validate an ISO 20022 message
 */
export async function validateISO20022Message(message: any) {
  return gateway.validate(message);
}

/**
 * Transform ISO 20022 message to blockchain format
 */
export async function transformToBlockchain(xml: string, options?: any) {
  return gateway.toInternal(gateway.parse(xml), options);
}

/**
 * Create a pain.001 payment initiation message
 */
export async function createPain001Message(paymentData: any) {
  return gateway.toISO20022(paymentData, ISO20022MessageType.PAIN_001);
}
