"use strict";
/**
 * PQC Key Manager
 * Manages key lifecycle including storage, rotation, and retrieval
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PQCKeyManager = void 0;
const key_generator_1 = require("./key-generator");
const errors_1 = require("./errors");
class PQCKeyManager {
    constructor() {
        this.keyStore = new Map();
        this.keyGenerator = new key_generator_1.PQCKeyGenerator();
    }
    /**
     * Generate and store a new key pair
     * @param algorithm - PQC algorithm to use
     * @param keyType - Type of key
     * @param purpose - Purpose of the key
     * @param rotationPolicy - Optional rotation policy
     * @returns Key ID
     */
    async generateAndStoreKey(algorithm, keyType, purpose = 'general', rotationPolicy) {
        try {
            const keyPair = await this.keyGenerator.generateKeyPair(algorithm, keyType, purpose);
            const keyStorage = {
                id: keyPair.metadata.id,
                keyPair,
                rotationPolicy,
                previousKeys: [],
            };
            this.keyStore.set(keyStorage.id, keyStorage);
            return keyStorage.id;
        }
        catch (error) {
            throw new errors_1.PQCKeyManagementError(`Failed to generate and store key: ${error.message}`);
        }
    }
    /**
     * Retrieve a key pair by ID
     * @param keyId - Key ID
     * @returns KeyPair
     */
    getKey(keyId) {
        const keyStorage = this.keyStore.get(keyId);
        if (!keyStorage) {
            throw new errors_1.PQCKeyManagementError(`Key not found: ${keyId}`);
        }
        return keyStorage.keyPair;
    }
    /**
     * Retrieve public key by ID
     * @param keyId - Key ID
     * @returns Public key
     */
    getPublicKey(keyId) {
        const keyPair = this.getKey(keyId);
        return keyPair.publicKey;
    }
    /**
     * Delete a key pair
     * @param keyId - Key ID
     */
    deleteKey(keyId) {
        if (!this.keyStore.delete(keyId)) {
            throw new errors_1.PQCKeyManagementError(`Key not found: ${keyId}`);
        }
    }
    /**
     * List all stored keys
     * @returns Array of key IDs with metadata
     */
    listKeys() {
        const keys = [];
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
    async rotateKey(keyId) {
        const oldKeyStorage = this.keyStore.get(keyId);
        if (!oldKeyStorage) {
            throw new errors_1.PQCKeyManagementError(`Key not found for rotation: ${keyId}`);
        }
        try {
            // Generate new key with same parameters
            const oldKeyPair = oldKeyStorage.keyPair;
            const newKeyPair = await this.keyGenerator.generateKeyPair(oldKeyPair.algorithm, oldKeyPair.keyType, oldKeyPair.metadata.purpose);
            // Create new storage with old key archived
            const newKeyStorage = {
                id: newKeyPair.metadata.id,
                keyPair: newKeyPair,
                rotationPolicy: oldKeyStorage.rotationPolicy,
                previousKeys: [oldKeyPair, ...(oldKeyStorage.previousKeys || [])],
            };
            // Store new key and remove old key
            this.keyStore.set(newKeyStorage.id, newKeyStorage);
            this.keyStore.delete(keyId);
            return newKeyStorage.id;
        }
        catch (error) {
            throw new errors_1.PQCKeyManagementError(`Key rotation failed: ${error.message}`);
        }
    }
    /**
     * Check if a key needs rotation based on its policy
     * @param keyId - Key ID
     * @returns True if key should be rotated
     */
    shouldRotateKey(keyId) {
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
    async autoRotateKeys() {
        const rotations = [];
        for (const [keyId, storage] of this.keyStore.entries()) {
            if (storage.rotationPolicy?.autoRotate && this.shouldRotateKey(keyId)) {
                try {
                    const newKeyId = await this.rotateKey(keyId);
                    rotations.push({ oldKeyId: keyId, newKeyId });
                }
                catch (error) {
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
    exportKey(keyId) {
        const keyStorage = this.keyStore.get(keyId);
        if (!keyStorage) {
            throw new errors_1.PQCKeyManagementError(`Key not found: ${keyId}`);
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
    importKey(serializedKey) {
        try {
            const data = JSON.parse(serializedKey);
            const keyStorage = {
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
        }
        catch (error) {
            throw new errors_1.PQCKeyManagementError(`Failed to import key: ${error.message}`);
        }
    }
    /**
     * Clear all keys (use with caution!)
     */
    clearAllKeys() {
        this.keyStore.clear();
    }
    /**
     * Get key count
     */
    getKeyCount() {
        return this.keyStore.size;
    }
}
exports.PQCKeyManager = PQCKeyManager;
