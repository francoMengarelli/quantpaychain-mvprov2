"use strict";
/**
 * PQC Layer
 * Main entry point for Post-Quantum Cryptography operations
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
exports.PQCContractManager = exports.PQCKeyManager = exports.PQCCryptoOperations = exports.PQCKeyGenerator = exports.PQCLayer = void 0;
const key_generator_1 = require("./key-generator");
const crypto_operations_1 = require("./crypto-operations");
const key_manager_1 = require("./key-manager");
const contract_manager_1 = require("./contract-manager");
const types_1 = require("./types");
const winston_1 = require("winston");
class PQCLayer {
    constructor(config) {
        this.config = {
            defaultAlgorithm: config?.defaultAlgorithm || types_1.PQCAlgorithm.ML_KEM_768,
            enableHybridMode: config?.enableHybridMode !== undefined ? config.enableHybridMode : true,
            keyRotationEnabled: config?.keyRotationEnabled !== undefined ? config.keyRotationEnabled : true,
            keyRotationPeriodDays: config?.keyRotationPeriodDays || 90,
            enableKeyCache: config?.enableKeyCache !== undefined ? config.enableKeyCache : true,
        };
        this.keyGenerator = new key_generator_1.PQCKeyGenerator();
        this.cryptoOps = new crypto_operations_1.PQCCryptoOperations();
        this.keyManager = new key_manager_1.PQCKeyManager();
        this.contractManager = new contract_manager_1.PQCContractManager();
        this.logger = (0, winston_1.createLogger)({
            level: 'info',
            format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.errors({ stack: true }), winston_1.format.json()),
            transports: [
                new winston_1.transports.Console({
                    format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.simple()),
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
    async generateKeyPair(algorithm, keyType = types_1.KeyType.KEY_EXCHANGE, purpose = 'general') {
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
    async generateAndStoreKeyPair(algorithm, keyType = types_1.KeyType.KEY_EXCHANGE, purpose = 'general') {
        const algo = algorithm || this.config.defaultAlgorithm;
        this.logger.info('Generating and storing key pair', { algorithm: algo, keyType, purpose });
        return this.keyManager.generateAndStoreKey(algo, keyType, purpose, this.config.keyRotationEnabled ? {
            rotationPeriodDays: this.config.keyRotationPeriodDays,
            gracePeriodDays: 7,
            algorithm: algo,
            autoRotate: true,
        } : undefined);
    }
    // ========== Encryption / Decryption ==========
    /**
     * Encrypt data using recipient's public key
     * @param plaintext - Data to encrypt
     * @param recipientPublicKey - Recipient's public key
     * @returns Encrypted data with encapsulation
     */
    async encrypt(plaintext, recipientPublicKey) {
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
    async decrypt(encapsulatedCiphertext, encryptedData, privateKey) {
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
    async sign(message, keyPair) {
        this.logger.info('Signing message', { algorithm: keyPair.algorithm });
        return this.cryptoOps.sign(message, keyPair);
    }
    /**
     * Verify a signature
     * @param message - Original message
     * @param signatureResult - Signature to verify
     * @returns Verification result
     */
    async verify(message, signatureResult) {
        this.logger.info('Verifying signature', { algorithm: signatureResult.algorithm });
        return this.cryptoOps.verify(message, signatureResult);
    }
    // ========== Key Management ==========
    /**
     * Get key manager instance
     */
    getKeyManager() {
        return this.keyManager;
    }
    /**
     * Get contract manager instance
     */
    getContractManager() {
        return this.contractManager;
    }
    /**
     * Rotate keys automatically based on policy
     */
    async autoRotateKeys() {
        if (this.config.keyRotationEnabled) {
            this.logger.info('Auto-rotating keys');
            const rotations = await this.keyManager.autoRotateKeys();
            this.logger.info(`Rotated ${rotations.length} key(s)`, { rotations });
        }
    }
    /**
     * Get configuration
     */
    getConfig() {
        return { ...this.config };
    }
}
exports.PQCLayer = PQCLayer;
// Re-export types and classes
__exportStar(require("./types"), exports);
__exportStar(require("./errors"), exports);
var key_generator_2 = require("./key-generator");
Object.defineProperty(exports, "PQCKeyGenerator", { enumerable: true, get: function () { return key_generator_2.PQCKeyGenerator; } });
var crypto_operations_2 = require("./crypto-operations");
Object.defineProperty(exports, "PQCCryptoOperations", { enumerable: true, get: function () { return crypto_operations_2.PQCCryptoOperations; } });
var key_manager_2 = require("./key-manager");
Object.defineProperty(exports, "PQCKeyManager", { enumerable: true, get: function () { return key_manager_2.PQCKeyManager; } });
var contract_manager_2 = require("./contract-manager");
Object.defineProperty(exports, "PQCContractManager", { enumerable: true, get: function () { return contract_manager_2.PQCContractManager; } });
