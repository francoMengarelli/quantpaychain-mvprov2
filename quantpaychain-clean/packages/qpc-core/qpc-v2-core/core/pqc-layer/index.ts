
/**
 * PQC Layer
 * Main entry point for Post-Quantum Cryptography operations
 */

import { PQCKeyGenerator } from './key-generator';
import { PQCCryptoOperations } from './crypto-operations';
import { PQCKeyManager } from './key-manager';
import { PQCContractManager } from './contract-manager';
import {
  KeyPair,
  PQCAlgorithm,
  KeyType,
  PQCConfig,
  EncapsulationResult,
  SignatureResult,
  VerificationResult,
  EncryptedData,
  DecryptedData,
} from './types';
import { createLogger, format, transports } from 'winston';

export class PQCLayer {
  private keyGenerator: PQCKeyGenerator;
  private cryptoOps: PQCCryptoOperations;
  private keyManager: PQCKeyManager;
  private contractManager: PQCContractManager;
  private config: PQCConfig;
  private logger: any;

  constructor(config?: Partial<PQCConfig>) {
    this.config = {
      defaultAlgorithm: config?.defaultAlgorithm || PQCAlgorithm.ML_KEM_768,
      enableHybridMode: config?.enableHybridMode !== undefined ? config.enableHybridMode : true,
      keyRotationEnabled: config?.keyRotationEnabled !== undefined ? config.keyRotationEnabled : true,
      keyRotationPeriodDays: config?.keyRotationPeriodDays || 90,
      enableKeyCache: config?.enableKeyCache !== undefined ? config.enableKeyCache : true,
    };

    this.keyGenerator = new PQCKeyGenerator();
    this.cryptoOps = new PQCCryptoOperations();
    this.keyManager = new PQCKeyManager();
    this.contractManager = new PQCContractManager();

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

    this.logger.info('PQC Layer initialized', { config: this.config });
  }

  // ========== Key Generation ==========

  /**
   * Generate a new key pair
   * @param algorithm - PQC algorithm to use
   * @param keyType - Type of key
   * @param purpose - Purpose of the key
   * @returns KeyPair
   */
  public async generateKeyPair(
    algorithm?: PQCAlgorithm,
    keyType: KeyType = KeyType.KEY_EXCHANGE,
    purpose: string = 'general'
  ): Promise<KeyPair> {
    const algo = algorithm || this.config.defaultAlgorithm;
    this.logger.info('Generating key pair', { algorithm: algo, keyType, purpose });
    return this.keyGenerator.generateKeyPair(algo, keyType, purpose);
  }

  /**
   * Generate and store a key pair
   * @param algorithm - PQC algorithm to use
   * @param keyType - Type of key
   * @param purpose - Purpose of the key
   * @returns Key ID
   */
  public async generateAndStoreKeyPair(
    algorithm?: PQCAlgorithm,
    keyType: KeyType = KeyType.KEY_EXCHANGE,
    purpose: string = 'general'
  ): Promise<string> {
    const algo = algorithm || this.config.defaultAlgorithm;
    this.logger.info('Generating and storing key pair', { algorithm: algo, keyType, purpose });
    
    return this.keyManager.generateAndStoreKey(
      algo,
      keyType,
      purpose,
      this.config.keyRotationEnabled ? {
        rotationPeriodDays: this.config.keyRotationPeriodDays,
        gracePeriodDays: 7,
        algorithm: algo,
        autoRotate: true,
      } : undefined
    );
  }

  // ========== Encryption / Decryption ==========

  /**
   * Encrypt data using recipient's public key
   * @param plaintext - Data to encrypt
   * @param recipientPublicKey - Recipient's public key
   * @returns Encrypted data with encapsulation
   */
  public async encrypt(
    plaintext: Uint8Array | string,
    recipientPublicKey: Uint8Array
  ): Promise<{ encapsulation: EncapsulationResult; encryptedData: EncryptedData }> {
    this.logger.info('Encrypting data');
    
    // Encapsulate shared secret
    const encapsulation = await this.cryptoOps.encapsulate(recipientPublicKey);
    
    // Encrypt data with shared secret
    const encryptedData = await this.cryptoOps.encrypt(plaintext, encapsulation.sharedSecret);
    
    return { encapsulation, encryptedData };
  }

  /**
   * Decrypt data using private key
   * @param encapsulatedCiphertext - Encapsulated ciphertext
   * @param encryptedData - Encrypted data
   * @param privateKey - Recipient's private key
   * @returns Decrypted data
   */
  public async decrypt(
    encapsulatedCiphertext: Uint8Array,
    encryptedData: EncryptedData,
    privateKey: Uint8Array
  ): Promise<DecryptedData> {
    this.logger.info('Decrypting data');
    
    // Decapsulate shared secret
    const sharedSecret = await this.cryptoOps.decapsulate(encapsulatedCiphertext, privateKey);
    
    // Decrypt data
    return this.cryptoOps.decrypt(encryptedData, sharedSecret);
  }

  // ========== Digital Signatures ==========

  /**
   * Sign a message
   * @param message - Message to sign
   * @param keyPair - Key pair for signing
   * @returns Signature result
   */
  public async sign(message: Uint8Array | string, keyPair: KeyPair): Promise<SignatureResult> {
    this.logger.info('Signing message', { algorithm: keyPair.algorithm });
    return this.cryptoOps.sign(message, keyPair);
  }

  /**
   * Verify a signature
   * @param message - Original message
   * @param signatureResult - Signature to verify
   * @returns Verification result
   */
  public async verify(
    message: Uint8Array | string,
    signatureResult: SignatureResult
  ): Promise<VerificationResult> {
    this.logger.info('Verifying signature', { algorithm: signatureResult.algorithm });
    return this.cryptoOps.verify(message, signatureResult);
  }

  // ========== Key Management ==========

  /**
   * Get key manager instance
   */
  public getKeyManager(): PQCKeyManager {
    return this.keyManager;
  }

  /**
   * Get contract manager instance
   */
  public getContractManager(): PQCContractManager {
    return this.contractManager;
  }

  /**
   * Rotate keys automatically based on policy
   */
  public async autoRotateKeys(): Promise<void> {
    if (this.config.keyRotationEnabled) {
      this.logger.info('Auto-rotating keys');
      const rotations = await this.keyManager.autoRotateKeys();
      this.logger.info(`Rotated ${rotations.length} key(s)`, { rotations });
    }
  }

  /**
   * Get configuration
   */
  public getConfig(): PQCConfig {
    return { ...this.config };
  }
}

// Re-export types and classes
export * from './types';
export * from './errors';
export { PQCKeyGenerator } from './key-generator';
export { PQCCryptoOperations } from './crypto-operations';
export { PQCKeyManager } from './key-manager';
export { PQCContractManager } from './contract-manager';
