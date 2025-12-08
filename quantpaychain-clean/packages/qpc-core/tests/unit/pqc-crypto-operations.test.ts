
/**
 * Unit tests for PQC Crypto Operations
 */

import { PQCCryptoOperations } from '../../core/pqc-layer/crypto-operations';
import { PQCKeyGenerator } from '../../core/pqc-layer/key-generator';
import { PQCAlgorithm, KeyType } from '../../core/pqc-layer/types';

describe('PQCCryptoOperations', () => {
  let cryptoOps: PQCCryptoOperations;
  let keyGenerator: PQCKeyGenerator;

  beforeEach(() => {
    cryptoOps = new PQCCryptoOperations();
    keyGenerator = new PQCKeyGenerator();
  });

  describe('encapsulate and decapsulate', () => {
    it('should encapsulate and decapsulate shared secret', async () => {
      const keyPair = await keyGenerator.generateKeyPair(
        PQCAlgorithm.ML_KEM_768,
        KeyType.KEY_EXCHANGE
      );

      const encapsulation = await cryptoOps.encapsulate(keyPair.publicKey);

      expect(encapsulation).toHaveProperty('ciphertext');
      expect(encapsulation).toHaveProperty('sharedSecret');
      expect(encapsulation.ciphertext.length).toBe(1088); // ML-KEM-768 ciphertext size
      expect(encapsulation.sharedSecret.length).toBe(32);

      const decapsulatedSecret = await cryptoOps.decapsulate(
        encapsulation.ciphertext,
        keyPair.privateKey
      );

      expect(decapsulatedSecret.length).toBe(32);
    });
  });

  describe('encrypt and decrypt', () => {
    it('should encrypt and decrypt data', async () => {
      const plaintext = 'Hello, Quantum World!';
      const sharedSecret = new Uint8Array(32); // Simulate shared secret

      const encrypted = await cryptoOps.encrypt(plaintext, sharedSecret);

      expect(encrypted).toHaveProperty('ciphertext');
      expect(encrypted).toHaveProperty('nonce');
      expect(encrypted).toHaveProperty('algorithm');
      expect(encrypted).toHaveProperty('metadata');

      const decrypted = await cryptoOps.decrypt(encrypted, sharedSecret);

      expect(decrypted).toHaveProperty('plaintext');
      expect(decrypted).toHaveProperty('metadata');
      
      const decoder = new TextDecoder();
      expect(decoder.decode(decrypted.plaintext)).toBe(plaintext);
    });

    it('should encrypt Uint8Array data', async () => {
      const encoder = new TextEncoder();
      const plaintext = encoder.encode('Binary data test');
      const sharedSecret = new Uint8Array(32);

      const encrypted = await cryptoOps.encrypt(plaintext, sharedSecret);
      const decrypted = await cryptoOps.decrypt(encrypted, sharedSecret);

      expect(decrypted.plaintext).toEqual(plaintext);
    });
  });

  describe('sign and verify', () => {
    it('should sign and verify a message', async () => {
      const keyPair = await keyGenerator.generateKeyPair(
        PQCAlgorithm.ML_DSA_65,
        KeyType.SIGNATURE
      );

      const message = 'This is a test message';
      const signature = await cryptoOps.sign(message, keyPair);

      expect(signature).toHaveProperty('signature');
      expect(signature).toHaveProperty('algorithm');
      expect(signature).toHaveProperty('timestamp');
      expect(signature).toHaveProperty('publicKey');
      expect(signature.algorithm).toBe(PQCAlgorithm.ML_DSA_65);

      const verification = await cryptoOps.verify(message, signature);

      expect(verification.isValid).toBe(true);
      expect(verification.algorithm).toBe(PQCAlgorithm.ML_DSA_65);
    });

    it('should produce different signatures for different messages', async () => {
      const keyPair = await keyGenerator.generateKeyPair(
        PQCAlgorithm.ML_DSA_65,
        KeyType.SIGNATURE
      );

      const signature1 = await cryptoOps.sign('Message 1', keyPair);
      const signature2 = await cryptoOps.sign('Message 2', keyPair);

      expect(signature1.signature).not.toEqual(signature2.signature);
    });
  });

  describe('hybridSharedSecret', () => {
    it('should combine PQC and classical shared secrets', async () => {
      const pqcSecret = new Uint8Array(32);
      const classicalSecret = new Uint8Array(32);

      const combined = await cryptoOps.hybridSharedSecret(pqcSecret, classicalSecret);

      expect(combined.length).toBe(32);
      expect(combined).toBeInstanceOf(Uint8Array);
    });
  });
});
