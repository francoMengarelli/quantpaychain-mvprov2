
/**
 * PQC Wrappers
 * Simplified functions wrapping the QPC v2 Core classes
 */

import { PQCLayer } from '@/qpc-v2-core/core/pqc-layer';
import { PQCAlgorithm, KeyType } from '@/qpc-v2-core/core/pqc-layer/types';

// Create singleton instance
const pqcLayer = new PQCLayer({
  enableHybridMode: true,
  keyRotationEnabled: true,
});

/**
 * Generate a PQC key pair
 */
export async function generatePQCKeyPair(algorithm: string = 'kyber768') {
  // Use the default ML-KEM-768 algorithm
  return pqcLayer.generateKeyPair(PQCAlgorithm.ML_KEM_768, KeyType.KEY_EXCHANGE);
}

/**
 * Generate a hybrid PQC key pair (same as regular for now since core defaults to hybrid mode)
 */
export async function generateHybridKeyPair(algorithm: string = 'kyber768') {
  return pqcLayer.generateKeyPair(PQCAlgorithm.HYBRID_KYBER_X25519, KeyType.KEY_EXCHANGE);
}

/**
 * Encrypt data using PQC
 */
export async function encryptPQC(data: string, publicKey: Uint8Array | string) {
  const dataBuffer = typeof data === 'string' ? Buffer.from(data, 'utf-8') : Buffer.from(data);
  const keyBuffer = typeof publicKey === 'string' ? Buffer.from(publicKey, 'base64') : publicKey;
  
  return pqcLayer.encrypt(dataBuffer, keyBuffer);
}

/**
 * Decrypt data using PQC
 */
export async function decryptPQC(encryptedPayload: any, privateKey: Uint8Array | string) {
  const keyBuffer = typeof privateKey === 'string' ? Buffer.from(privateKey, 'base64') : privateKey;
  
  // Extract encapsulation and encrypted data from payload
  const { encapsulation, encryptedData } = encryptedPayload;
  
  return pqcLayer.decrypt(
    encapsulation.ciphertext,
    encryptedData,
    keyBuffer
  );
}

/**
 * Sign data using PQC
 */
export async function signPQC(data: string, keyPair: any) {
  const dataBuffer = typeof data === 'string' ? Buffer.from(data, 'utf-8') : Buffer.from(data);
  
  return pqcLayer.sign(dataBuffer, keyPair);
}

/**
 * Verify a PQC signature
 */
export async function verifyPQC(data: string, signatureResult: any) {
  const dataBuffer = typeof data === 'string' ? Buffer.from(data, 'utf-8') : Buffer.from(data);
  
  return pqcLayer.verify(dataBuffer, signatureResult);
}
