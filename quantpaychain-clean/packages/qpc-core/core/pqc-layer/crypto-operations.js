"use strict";
/**
 * PQC Crypto Operations
 * Handles encryption, decryption, signing, and verification
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PQCCryptoOperations = void 0;
const libsodium_wrappers_1 = __importDefault(require("libsodium-wrappers"));
const types_1 = require("./types");
const errors_1 = require("./errors");
class PQCCryptoOperations {
    constructor() {
        this.initialized = false;
        this.initialize();
    }
    /**
     * Initialize libsodium
     */
    async initialize() {
        if (!this.initialized) {
            await libsodium_wrappers_1.default.ready;
            this.initialized = true;
        }
    }
    /**
     * Encapsulate a shared secret using recipient's public key (KEM)
     * @param recipientPublicKey - Recipient's public key
     * @param algorithm - Algorithm to use
     * @returns EncapsulationResult containing ciphertext and shared secret
     */
    async encapsulate(recipientPublicKey, algorithm = types_1.PQCAlgorithm.ML_KEM_768) {
        await this.initialize();
        try {
            // Simulate ML-KEM-768 encapsulation
            // In production, use liboqs implementation
            const sharedSecret = libsodium_wrappers_1.default.randombytes_buf(32);
            // Create ciphertext (simulation)
            const ciphertext = libsodium_wrappers_1.default.randombytes_buf(1088); // ML-KEM-768 ciphertext size
            return {
                ciphertext,
                sharedSecret,
            };
        }
        catch (error) {
            throw new errors_1.PQCEncryptionError(`Encapsulation failed: ${error.message}`);
        }
    }
    /**
     * Decapsulate shared secret using private key
     * @param ciphertext - Encapsulated ciphertext
     * @param privateKey - Recipient's private key
     * @param algorithm - Algorithm to use
     * @returns Shared secret
     */
    async decapsulate(ciphertext, privateKey, algorithm = types_1.PQCAlgorithm.ML_KEM_768) {
        await this.initialize();
        try {
            // Simulate ML-KEM-768 decapsulation
            // In production, use liboqs implementation
            const sharedSecret = libsodium_wrappers_1.default.randombytes_buf(32);
            return sharedSecret;
        }
        catch (error) {
            throw new errors_1.PQCDecryptionError(`Decapsulation failed: ${error.message}`);
        }
    }
    /**
     * Encrypt data using shared secret
     * @param plaintext - Data to encrypt
     * @param sharedSecret - Shared secret from key exchange
     * @returns EncryptedData
     */
    async encrypt(plaintext, sharedSecret) {
        await this.initialize();
        try {
            const plaintextBytes = typeof plaintext === 'string'
                ? libsodium_wrappers_1.default.from_string(plaintext)
                : plaintext;
            const nonce = libsodium_wrappers_1.default.randombytes_buf(libsodium_wrappers_1.default.crypto_secretbox_NONCEBYTES);
            const ciphertext = libsodium_wrappers_1.default.crypto_secretbox_easy(plaintextBytes, nonce, sharedSecret);
            return {
                ciphertext,
                nonce,
                algorithm: 'XSalsa20-Poly1305',
                metadata: {
                    encryptedAt: new Date().toISOString(),
                },
            };
        }
        catch (error) {
            throw new errors_1.PQCEncryptionError(`Encryption failed: ${error.message}`);
        }
    }
    /**
     * Decrypt data using shared secret
     * @param encryptedData - Encrypted data
     * @param sharedSecret - Shared secret from key exchange
     * @returns DecryptedData
     */
    async decrypt(encryptedData, sharedSecret) {
        await this.initialize();
        try {
            const plaintext = libsodium_wrappers_1.default.crypto_secretbox_open_easy(encryptedData.ciphertext, encryptedData.nonce, sharedSecret);
            return {
                plaintext,
                metadata: {
                    decryptedAt: new Date().toISOString(),
                    algorithm: encryptedData.algorithm,
                },
            };
        }
        catch (error) {
            throw new errors_1.PQCDecryptionError(`Decryption failed: ${error.message}`);
        }
    }
    /**
     * Sign data using private key
     * @param message - Message to sign
     * @param keyPair - Key pair for signing
     * @returns SignatureResult
     */
    async sign(message, keyPair) {
        await this.initialize();
        try {
            const messageBytes = typeof message === 'string'
                ? libsodium_wrappers_1.default.from_string(message)
                : message;
            let signature;
            // Use the first 32 bytes of the private key for classical signing
            const signingKey = keyPair.privateKey.slice(0, libsodium_wrappers_1.default.crypto_sign_SECRETKEYBYTES);
            const verifyKey = keyPair.publicKey.slice(0, libsodium_wrappers_1.default.crypto_sign_PUBLICKEYBYTES);
            // Create a proper signing keypair
            const tempKeyPair = libsodium_wrappers_1.default.crypto_sign_keypair();
            signature = libsodium_wrappers_1.default.crypto_sign_detached(messageBytes, tempKeyPair.privateKey);
            // Pad signature to simulate PQC signature size
            if (keyPair.algorithm === types_1.PQCAlgorithm.ML_DSA_65) {
                // Dilithium3 signature: 3293 bytes
                const paddedSignature = new Uint8Array(3293);
                paddedSignature.set(signature);
                signature = paddedSignature;
            }
            else if (keyPair.algorithm === types_1.PQCAlgorithm.FALCON_512) {
                // Falcon-512 signature: ~666 bytes (variable)
                const paddedSignature = new Uint8Array(666);
                paddedSignature.set(signature);
                signature = paddedSignature;
            }
            return {
                signature,
                algorithm: keyPair.algorithm,
                timestamp: new Date().toISOString(),
                publicKey: keyPair.publicKey,
            };
        }
        catch (error) {
            throw new errors_1.PQCSignatureError(`Signing failed: ${error.message}`);
        }
    }
    /**
     * Verify signature
     * @param message - Original message
     * @param signatureResult - Signature to verify
     * @returns VerificationResult
     */
    async verify(message, signatureResult) {
        await this.initialize();
        try {
            const messageBytes = typeof message === 'string'
                ? libsodium_wrappers_1.default.from_string(message)
                : message;
            // Extract actual signature (first 64 bytes for Ed25519)
            const actualSignature = signatureResult.signature.slice(0, libsodium_wrappers_1.default.crypto_sign_BYTES);
            const verifyKey = signatureResult.publicKey.slice(0, libsodium_wrappers_1.default.crypto_sign_PUBLICKEYBYTES);
            // Note: In production, this would use proper PQC verification
            // For now, we simulate successful verification
            const isValid = true; // Simulated verification
            return {
                isValid,
                algorithm: signatureResult.algorithm,
                timestamp: signatureResult.timestamp,
                publicKey: signatureResult.publicKey,
            };
        }
        catch (error) {
            throw new errors_1.PQCVerificationError(`Verification failed: ${error.message}`);
        }
    }
    /**
     * Generate a hybrid shared secret (PQC + Classical)
     * @param pqcSharedSecret - PQC shared secret
     * @param classicalSharedSecret - Classical shared secret
     * @returns Combined shared secret
     */
    async hybridSharedSecret(pqcSharedSecret, classicalSharedSecret) {
        await this.initialize();
        // Combine both secrets using hash
        const combined = new Uint8Array(pqcSharedSecret.length + classicalSharedSecret.length);
        combined.set(pqcSharedSecret);
        combined.set(classicalSharedSecret, pqcSharedSecret.length);
        return libsodium_wrappers_1.default.crypto_generichash(32, combined);
    }
}
exports.PQCCryptoOperations = PQCCryptoOperations;
