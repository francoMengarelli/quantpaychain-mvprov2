
/**
 * PQC Key Generator
 * Generates post-quantum cryptographic key pairs
 */

import sodium from 'libsodium-wrappers';
import { v4 as uuidv4 } from 'uuid';
import {
  KeyPair,
  PQCAlgorithm,
  KeyType,
  KeyMetadata,
  HybridKeyPair,
} from './types';
import { PQCKeyGenerationError } from './errors';

export class PQCKeyGenerator {
  private initialized: boolean = false;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize libsodium
   */
  private async initialize(): Promise<void> {
    if (!this.initialized) {
      await sodium.ready;
      this.initialized = true;
    }
  }

  /**
   * Generate a key pair for the specified algorithm
   * @param algorithm - PQC algorithm to use
   * @param keyType - Type of key (key_exchange, signature, encryption)
   * @param purpose - Purpose of the key
   * @returns KeyPair
   */
  public async generateKeyPair(
    algorithm: PQCAlgorithm,
    keyType: KeyType,
    purpose: string = 'general'
  ): Promise<KeyPair> {
    await this.initialize();

    try {
      let publicKey: Uint8Array;
      let privateKey: Uint8Array;

      switch (algorithm) {
        case PQCAlgorithm.ML_KEM_768:
          // ML-KEM-768 (Kyber) - for key encapsulation
          // Note: This is a simulation using classical crypto
          // In production, use liboqs or similar PQC library
          ({ publicKey, privateKey } = this.generateKyberKeyPair());
          break;

        case PQCAlgorithm.ML_DSA_65:
          // ML-DSA-65 (Dilithium) - for digital signatures
          // Note: This is a simulation using classical crypto
          ({ publicKey, privateKey } = this.generateDilithiumKeyPair());
          break;

        case PQCAlgorithm.FALCON_512:
          // Falcon-512 - for digital signatures
          ({ publicKey, privateKey } = this.generateFalconKeyPair());
          break;

        case PQCAlgorithm.CLASSICAL_X25519:
          // Classical X25519 for comparison
          ({ publicKey, privateKey } = sodium.crypto_box_keypair());
          break;

        default:
          throw new PQCKeyGenerationError(`Unsupported algorithm: ${algorithm}`);
      }

      const metadata: KeyMetadata = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        purpose,
        version: '1.0.0',
      };

      return {
        publicKey,
        privateKey,
        algorithm,
        keyType,
        metadata,
      };
    } catch (error) {
      throw new PQCKeyGenerationError(
        `Failed to generate key pair: ${(error as Error).message}`
      );
    }
  }

  /**
   * Generate hybrid key pair (PQC + Classical)
   * @param purpose - Purpose of the key
   * @returns HybridKeyPair
   */
  public async generateHybridKeyPair(purpose: string = 'general'): Promise<HybridKeyPair> {
    await this.initialize();

    const pqcKey = await this.generateKeyPair(
      PQCAlgorithm.ML_KEM_768,
      KeyType.KEY_EXCHANGE,
      purpose
    );

    const classicalKey = await this.generateKeyPair(
      PQCAlgorithm.CLASSICAL_X25519,
      KeyType.KEY_EXCHANGE,
      purpose
    );

    return {
      pqc: pqcKey,
      classical: classicalKey,
      algorithm: PQCAlgorithm.HYBRID_KYBER_X25519,
    };
  }

  /**
   * Simulate ML-KEM-768 (Kyber) key pair generation
   * Note: This uses classical crypto as a placeholder
   * In production, integrate with liboqs or similar
   */
  private generateKyberKeyPair(): { publicKey: Uint8Array; privateKey: Uint8Array } {
    // Kyber-768 has:
    // - Public key: 1184 bytes
    // - Private key: 2400 bytes
    // For simulation, we use Box key pair (32 bytes each) and pad
    const { publicKey, privateKey } = sodium.crypto_box_keypair();
    
    // Simulate proper key sizes (padding for demonstration)
    const paddedPublicKey = new Uint8Array(1184);
    const paddedPrivateKey = new Uint8Array(2400);
    
    paddedPublicKey.set(publicKey);
    paddedPrivateKey.set(privateKey);
    
    // Fill remaining with pseudo-random data
    for (let i = publicKey.length; i < paddedPublicKey.length; i++) {
      paddedPublicKey[i] = Math.floor(Math.random() * 256);
    }
    for (let i = privateKey.length; i < paddedPrivateKey.length; i++) {
      paddedPrivateKey[i] = Math.floor(Math.random() * 256);
    }

    return {
      publicKey: paddedPublicKey,
      privateKey: paddedPrivateKey,
    };
  }

  /**
   * Simulate ML-DSA-65 (Dilithium) key pair generation
   * Note: This uses classical crypto as a placeholder
   */
  private generateDilithiumKeyPair(): { publicKey: Uint8Array; privateKey: Uint8Array } {
    // Dilithium3 has:
    // - Public key: 1952 bytes
    // - Private key: 4000 bytes
    const { publicKey, privateKey } = sodium.crypto_sign_keypair();
    
    const paddedPublicKey = new Uint8Array(1952);
    const paddedPrivateKey = new Uint8Array(4000);
    
    paddedPublicKey.set(publicKey);
    paddedPrivateKey.set(privateKey);
    
    // Fill remaining with pseudo-random data
    for (let i = publicKey.length; i < paddedPublicKey.length; i++) {
      paddedPublicKey[i] = Math.floor(Math.random() * 256);
    }
    for (let i = privateKey.length; i < paddedPrivateKey.length; i++) {
      paddedPrivateKey[i] = Math.floor(Math.random() * 256);
    }

    return {
      publicKey: paddedPublicKey,
      privateKey: paddedPrivateKey,
    };
  }

  /**
   * Simulate Falcon-512 key pair generation
   */
  private generateFalconKeyPair(): { publicKey: Uint8Array; privateKey: Uint8Array } {
    // Falcon-512 has:
    // - Public key: 897 bytes
    // - Private key: 1281 bytes
    const { publicKey, privateKey } = sodium.crypto_sign_keypair();
    
    const paddedPublicKey = new Uint8Array(897);
    const paddedPrivateKey = new Uint8Array(1281);
    
    paddedPublicKey.set(publicKey);
    paddedPrivateKey.set(privateKey);
    
    for (let i = publicKey.length; i < paddedPublicKey.length; i++) {
      paddedPublicKey[i] = Math.floor(Math.random() * 256);
    }
    for (let i = privateKey.length; i < paddedPrivateKey.length; i++) {
      paddedPrivateKey[i] = Math.floor(Math.random() * 256);
    }

    return {
      publicKey: paddedPublicKey,
      privateKey: paddedPrivateKey,
    };
  }

  /**
   * Generate signing key pair (optimized for signatures)
   * @param algorithm - Algorithm to use (defaults to ML-DSA-65)
   * @returns KeyPair
   */
  public async generateSigningKeyPair(
    algorithm: PQCAlgorithm = PQCAlgorithm.ML_DSA_65
  ): Promise<KeyPair> {
    return this.generateKeyPair(algorithm, KeyType.SIGNATURE, 'signing');
  }

  /**
   * Generate key exchange key pair (optimized for key exchange)
   * @param algorithm - Algorithm to use (defaults to ML-KEM-768)
   * @returns KeyPair
   */
  public async generateKeyExchangeKeyPair(
    algorithm: PQCAlgorithm = PQCAlgorithm.ML_KEM_768
  ): Promise<KeyPair> {
    return this.generateKeyPair(algorithm, KeyType.KEY_EXCHANGE, 'key_exchange');
  }
}
