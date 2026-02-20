"use strict";
/**
 * PQC Key Generator
 * Generates post-quantum cryptographic key pairs
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PQCKeyGenerator = void 0;
const libsodium_wrappers_1 = __importDefault(require("libsodium-wrappers"));
const uuid_1 = require("uuid");
const types_1 = require("./types");
const errors_1 = require("./errors");
class PQCKeyGenerator {
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
     * Generate a key pair for the specified algorithm
     * @param algorithm - PQC algorithm to use
     * @param keyType - Type of key (key_exchange, signature, encryption)
     * @param purpose - Purpose of the key
     * @returns KeyPair
     */
    async generateKeyPair(algorithm, keyType, purpose = 'general') {
        await this.initialize();
        try {
            let publicKey;
            let privateKey;
            switch (algorithm) {
                case types_1.PQCAlgorithm.ML_KEM_768:
                    // ML-KEM-768 (Kyber) - for key encapsulation
                    // Note: This is a simulation using classical crypto
                    // In production, use liboqs or similar PQC library
                    ({ publicKey, privateKey } = this.generateKyberKeyPair());
                    break;
                case types_1.PQCAlgorithm.ML_DSA_65:
                    // ML-DSA-65 (Dilithium) - for digital signatures
                    // Note: This is a simulation using classical crypto
                    ({ publicKey, privateKey } = this.generateDilithiumKeyPair());
                    break;
                case types_1.PQCAlgorithm.FALCON_512:
                    // Falcon-512 - for digital signatures
                    ({ publicKey, privateKey } = this.generateFalconKeyPair());
                    break;
                case types_1.PQCAlgorithm.CLASSICAL_X25519:
                    // Classical X25519 for comparison
                    ({ publicKey, privateKey } = libsodium_wrappers_1.default.crypto_box_keypair());
                    break;
                default:
                    throw new errors_1.PQCKeyGenerationError(`Unsupported algorithm: ${algorithm}`);
            }
            const metadata = {
                id: (0, uuid_1.v4)(),
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
        }
        catch (error) {
            throw new errors_1.PQCKeyGenerationError(`Failed to generate key pair: ${error.message}`);
        }
    }
    /**
     * Generate hybrid key pair (PQC + Classical)
     * @param purpose - Purpose of the key
     * @returns HybridKeyPair
     */
    async generateHybridKeyPair(purpose = 'general') {
        await this.initialize();
        const pqcKey = await this.generateKeyPair(types_1.PQCAlgorithm.ML_KEM_768, types_1.KeyType.KEY_EXCHANGE, purpose);
        const classicalKey = await this.generateKeyPair(types_1.PQCAlgorithm.CLASSICAL_X25519, types_1.KeyType.KEY_EXCHANGE, purpose);
        return {
            pqc: pqcKey,
            classical: classicalKey,
            algorithm: types_1.PQCAlgorithm.HYBRID_KYBER_X25519,
        };
    }
    /**
     * Simulate ML-KEM-768 (Kyber) key pair generation
     * Note: This uses classical crypto as a placeholder
     * In production, integrate with liboqs or similar
     */
    generateKyberKeyPair() {
        // Kyber-768 has:
        // - Public key: 1184 bytes
        // - Private key: 2400 bytes
        // For simulation, we use Box key pair (32 bytes each) and pad
        const { publicKey, privateKey } = libsodium_wrappers_1.default.crypto_box_keypair();
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
    generateDilithiumKeyPair() {
        // Dilithium3 has:
        // - Public key: 1952 bytes
        // - Private key: 4000 bytes
        const { publicKey, privateKey } = libsodium_wrappers_1.default.crypto_sign_keypair();
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
    generateFalconKeyPair() {
        // Falcon-512 has:
        // - Public key: 897 bytes
        // - Private key: 1281 bytes
        const { publicKey, privateKey } = libsodium_wrappers_1.default.crypto_sign_keypair();
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
    async generateSigningKeyPair(algorithm = types_1.PQCAlgorithm.ML_DSA_65) {
        return this.generateKeyPair(algorithm, types_1.KeyType.SIGNATURE, 'signing');
    }
    /**
     * Generate key exchange key pair (optimized for key exchange)
     * @param algorithm - Algorithm to use (defaults to ML-KEM-768)
     * @returns KeyPair
     */
    async generateKeyExchangeKeyPair(algorithm = types_1.PQCAlgorithm.ML_KEM_768) {
        return this.generateKeyPair(algorithm, types_1.KeyType.KEY_EXCHANGE, 'key_exchange');
    }
}
exports.PQCKeyGenerator = PQCKeyGenerator;
