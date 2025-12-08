
/**
 * Post-Quantum Cryptography Types and Interfaces
 * Defines structures for PQC operations including ML-KEM-768 and ML-DSA-65
 */

export enum PQCAlgorithm {
  ML_KEM_768 = 'ML-KEM-768', // Kyber-768 (NIST approved)
  ML_DSA_65 = 'ML-DSA-65',   // Dilithium3 (NIST approved)
  FALCON_512 = 'FALCON-512', // Falcon-512 (NIST approved)
  HYBRID_KYBER_X25519 = 'HYBRID-KYBER-X25519', // Hybrid mode
  CLASSICAL_X25519 = 'CLASSICAL-X25519', // Classical fallback
}

export enum KeyType {
  KEY_EXCHANGE = 'key_exchange',
  SIGNATURE = 'signature',
  ENCRYPTION = 'encryption',
}

export interface KeyPair {
  publicKey: Uint8Array;
  privateKey: Uint8Array;
  algorithm: PQCAlgorithm;
  keyType: KeyType;
  metadata: KeyMetadata;
}

export interface KeyMetadata {
  id: string;
  createdAt: string;
  expiresAt?: string;
  purpose: string;
  version: string;
}

export interface EncapsulationResult {
  ciphertext: Uint8Array;
  sharedSecret: Uint8Array;
}

export interface SignatureResult {
  signature: Uint8Array;
  algorithm: PQCAlgorithm;
  timestamp: string;
  publicKey: Uint8Array;
}

export interface VerificationResult {
  isValid: boolean;
  algorithm: PQCAlgorithm;
  timestamp?: string;
  publicKey?: Uint8Array;
}

export interface EncryptedData {
  ciphertext: Uint8Array;
  nonce: Uint8Array;
  algorithm: string;
  metadata: {
    encryptedAt: string;
    keyId?: string;
  };
}

export interface DecryptedData {
  plaintext: Uint8Array;
  metadata: {
    decryptedAt: string;
    algorithm: string;
  };
}

export interface Contract {
  id: string;
  content: string;
  parties: ContractParty[];
  signatures: ContractSignature[];
  createdAt: string;
  expiresAt?: string;
  status: ContractStatus;
}

export enum ContractStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  SIGNED = 'signed',
  EXECUTED = 'executed',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
}

export interface ContractParty {
  id: string;
  name: string;
  publicKey: Uint8Array;
  role: string;
}

export interface ContractSignature {
  partyId: string;
  signature: Uint8Array;
  algorithm: PQCAlgorithm;
  timestamp: string;
  publicKey: Uint8Array;
}

export interface KeyRotationPolicy {
  rotationPeriodDays: number;
  gracePeriodDays: number;
  algorithm: PQCAlgorithm;
  autoRotate: boolean;
}

export interface KeyStorage {
  id: string;
  keyPair: KeyPair;
  rotationPolicy?: KeyRotationPolicy;
  previousKeys?: KeyPair[];
}

export interface HybridKeyPair {
  pqc: KeyPair;
  classical: KeyPair;
  algorithm: PQCAlgorithm.HYBRID_KYBER_X25519;
}

export interface PQCConfig {
  defaultAlgorithm: PQCAlgorithm;
  enableHybridMode: boolean;
  keyRotationEnabled: boolean;
  keyRotationPeriodDays: number;
  enableKeyCache: boolean;
}
