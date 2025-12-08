
/**
 * PQC Key Manager
 * Manages key lifecycle including storage, rotation, and retrieval
 */

import { v4 as uuidv4 } from 'uuid';
import {
  KeyPair,
  KeyStorage,
  KeyRotationPolicy,
  PQCAlgorithm,
  KeyType,
} from './types';
import { PQCKeyGenerator } from './key-generator';
import { PQCKeyManagementError } from './errors';

export class PQCKeyManager {
  private keyStore: Map<string, KeyStorage>;
  private keyGenerator: PQCKeyGenerator;

  constructor() {
    this.keyStore = new Map();
    this.keyGenerator = new PQCKeyGenerator();
  }

  /**
   * Generate and store a new key pair
   * @param algorithm - PQC algorithm to use
   * @param keyType - Type of key
   * @param purpose - Purpose of the key
   * @param rotationPolicy - Optional rotation policy
   * @returns Key ID
   */
  public async generateAndStoreKey(
    algorithm: PQCAlgorithm,
    keyType: KeyType,
    purpose: string = 'general',
    rotationPolicy?: KeyRotationPolicy
  ): Promise<string> {
    try {
      const keyPair = await this.keyGenerator.generateKeyPair(algorithm, keyType, purpose);
      
      const keyStorage: KeyStorage = {
        id: keyPair.metadata.id,
        keyPair,
        rotationPolicy,
        previousKeys: [],
      };

      this.keyStore.set(keyStorage.id, keyStorage);
      return keyStorage.id;
    } catch (error) {
      throw new PQCKeyManagementError(
        `Failed to generate and store key: ${(error as Error).message}`
      );
    }
  }

  /**
   * Retrieve a key pair by ID
   * @param keyId - Key ID
   * @returns KeyPair
   */
  public getKey(keyId: string): KeyPair {
    const keyStorage = this.keyStore.get(keyId);
    if (!keyStorage) {
      throw new PQCKeyManagementError(`Key not found: ${keyId}`);
    }
    return keyStorage.keyPair;
  }

  /**
   * Retrieve public key by ID
   * @param keyId - Key ID
   * @returns Public key
   */
  public getPublicKey(keyId: string): Uint8Array {
    const keyPair = this.getKey(keyId);
    return keyPair.publicKey;
  }

  /**
   * Delete a key pair
   * @param keyId - Key ID
   */
  public deleteKey(keyId: string): void {
    if (!this.keyStore.delete(keyId)) {
      throw new PQCKeyManagementError(`Key not found: ${keyId}`);
    }
  }

  /**
   * List all stored keys
   * @returns Array of key IDs with metadata
   */
  public listKeys(): Array<{ id: string; algorithm: PQCAlgorithm; keyType: KeyType; createdAt: string }> {
    const keys: Array<{ id: string; algorithm: PQCAlgorithm; keyType: KeyType; createdAt: string }> = [];
    
    for (const [id, storage] of this.keyStore.entries()) {
      keys.push({
        id,
        algorithm: storage.keyPair.algorithm,
        keyType: storage.keyPair.keyType,
        createdAt: storage.keyPair.metadata.createdAt,
      });
    }
    
    return keys;
  }

  /**
   * Rotate a key (generate new key and archive old one)
   * @param keyId - Key ID to rotate
   * @returns New key ID
   */
  public async rotateKey(keyId: string): Promise<string> {
    const oldKeyStorage = this.keyStore.get(keyId);
    if (!oldKeyStorage) {
      throw new PQCKeyManagementError(`Key not found for rotation: ${keyId}`);
    }

    try {
      // Generate new key with same parameters
      const oldKeyPair = oldKeyStorage.keyPair;
      const newKeyPair = await this.keyGenerator.generateKeyPair(
        oldKeyPair.algorithm,
        oldKeyPair.keyType,
        oldKeyPair.metadata.purpose
      );

      // Create new storage with old key archived
      const newKeyStorage: KeyStorage = {
        id: newKeyPair.metadata.id,
        keyPair: newKeyPair,
        rotationPolicy: oldKeyStorage.rotationPolicy,
        previousKeys: [oldKeyPair, ...(oldKeyStorage.previousKeys || [])],
      };

      // Store new key and remove old key
      this.keyStore.set(newKeyStorage.id, newKeyStorage);
      this.keyStore.delete(keyId);

      return newKeyStorage.id;
    } catch (error) {
      throw new PQCKeyManagementError(
        `Key rotation failed: ${(error as Error).message}`
      );
    }
  }

  /**
   * Check if a key needs rotation based on its policy
   * @param keyId - Key ID
   * @returns True if key should be rotated
   */
  public shouldRotateKey(keyId: string): boolean {
    const keyStorage = this.keyStore.get(keyId);
    if (!keyStorage || !keyStorage.rotationPolicy) {
      return false;
    }

    const createdAt = new Date(keyStorage.keyPair.metadata.createdAt);
    const now = new Date();
    const daysSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

    return daysSinceCreation >= keyStorage.rotationPolicy.rotationPeriodDays;
  }

  /**
   * Auto-rotate keys that need rotation
   * @returns Array of rotated key IDs (old ID -> new ID)
   */
  public async autoRotateKeys(): Promise<Array<{ oldKeyId: string; newKeyId: string }>> {
    const rotations: Array<{ oldKeyId: string; newKeyId: string }> = [];

    for (const [keyId, storage] of this.keyStore.entries()) {
      if (storage.rotationPolicy?.autoRotate && this.shouldRotateKey(keyId)) {
        try {
          const newKeyId = await this.rotateKey(keyId);
          rotations.push({ oldKeyId: keyId, newKeyId });
        } catch (error) {
          // Log error but continue with other keys
          console.error(`Failed to rotate key ${keyId}:`, error);
        }
      }
    }

    return rotations;
  }

  /**
   * Export key pair (for backup purposes)
   * @param keyId - Key ID
   * @returns Serialized key pair
   */
  public exportKey(keyId: string): string {
    const keyStorage = this.keyStore.get(keyId);
    if (!keyStorage) {
      throw new PQCKeyManagementError(`Key not found: ${keyId}`);
    }

    return JSON.stringify({
      id: keyStorage.id,
      keyPair: {
        publicKey: Array.from(keyStorage.keyPair.publicKey),
        privateKey: Array.from(keyStorage.keyPair.privateKey),
        algorithm: keyStorage.keyPair.algorithm,
        keyType: keyStorage.keyPair.keyType,
        metadata: keyStorage.keyPair.metadata,
      },
      rotationPolicy: keyStorage.rotationPolicy,
    });
  }

  /**
   * Import key pair (from backup)
   * @param serializedKey - Serialized key pair
   * @returns Key ID
   */
  public importKey(serializedKey: string): string {
    try {
      const data = JSON.parse(serializedKey);
      
      const keyStorage: KeyStorage = {
        id: data.id,
        keyPair: {
          publicKey: new Uint8Array(data.keyPair.publicKey),
          privateKey: new Uint8Array(data.keyPair.privateKey),
          algorithm: data.keyPair.algorithm,
          keyType: data.keyPair.keyType,
          metadata: data.keyPair.metadata,
        },
        rotationPolicy: data.rotationPolicy,
        previousKeys: [],
      };

      this.keyStore.set(keyStorage.id, keyStorage);
      return keyStorage.id;
    } catch (error) {
      throw new PQCKeyManagementError(
        `Failed to import key: ${(error as Error).message}`
      );
    }
  }

  /**
   * Clear all keys (use with caution!)
   */
  public clearAllKeys(): void {
    this.keyStore.clear();
  }

  /**
   * Get key count
   */
  public getKeyCount(): number {
    return this.keyStore.size;
  }
}
