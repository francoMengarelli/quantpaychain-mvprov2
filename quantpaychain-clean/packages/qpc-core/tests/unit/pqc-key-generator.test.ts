
/**
 * Unit tests for PQC Key Generator
 */

import { PQCKeyGenerator } from '../../core/pqc-layer/key-generator';
import { PQCAlgorithm, KeyType } from '../../core/pqc-layer/types';

describe('PQCKeyGenerator', () => {
  let generator: PQCKeyGenerator;

  beforeEach(() => {
    generator = new PQCKeyGenerator();
  });

  describe('generateKeyPair', () => {
    it('should generate ML-KEM-768 key pair', async () => {
      const keyPair = await generator.generateKeyPair(
        PQCAlgorithm.ML_KEM_768,
        KeyType.KEY_EXCHANGE
      );

      expect(keyPair).toHaveProperty('publicKey');
      expect(keyPair).toHaveProperty('privateKey');
      expect(keyPair.algorithm).toBe(PQCAlgorithm.ML_KEM_768);
      expect(keyPair.keyType).toBe(KeyType.KEY_EXCHANGE);
      expect(keyPair.publicKey.length).toBe(1184); // ML-KEM-768 public key size
      expect(keyPair.privateKey.length).toBe(2400); // ML-KEM-768 private key size
    });

    it('should generate ML-DSA-65 key pair', async () => {
      const keyPair = await generator.generateKeyPair(
        PQCAlgorithm.ML_DSA_65,
        KeyType.SIGNATURE
      );

      expect(keyPair).toHaveProperty('publicKey');
      expect(keyPair).toHaveProperty('privateKey');
      expect(keyPair.algorithm).toBe(PQCAlgorithm.ML_DSA_65);
      expect(keyPair.keyType).toBe(KeyType.SIGNATURE);
      expect(keyPair.publicKey.length).toBe(1952); // ML-DSA-65 public key size
      expect(keyPair.privateKey.length).toBe(4000); // ML-DSA-65 private key size
    });

    it('should generate classical X25519 key pair', async () => {
      const keyPair = await generator.generateKeyPair(
        PQCAlgorithm.CLASSICAL_X25519,
        KeyType.KEY_EXCHANGE
      );

      expect(keyPair).toHaveProperty('publicKey');
      expect(keyPair).toHaveProperty('privateKey');
      expect(keyPair.algorithm).toBe(PQCAlgorithm.CLASSICAL_X25519);
      expect(keyPair.publicKey.length).toBe(32);
      expect(keyPair.privateKey.length).toBe(32);
    });

    it('should include metadata in generated key pair', async () => {
      const keyPair = await generator.generateKeyPair(
        PQCAlgorithm.ML_KEM_768,
        KeyType.KEY_EXCHANGE,
        'test-purpose'
      );

      expect(keyPair.metadata).toHaveProperty('id');
      expect(keyPair.metadata).toHaveProperty('createdAt');
      expect(keyPair.metadata.purpose).toBe('test-purpose');
      expect(keyPair.metadata).toHaveProperty('version');
    });
  });

  describe('generateHybridKeyPair', () => {
    it('should generate hybrid key pair with PQC and classical keys', async () => {
      const hybridKeys = await generator.generateHybridKeyPair('hybrid-test');

      expect(hybridKeys).toHaveProperty('pqc');
      expect(hybridKeys).toHaveProperty('classical');
      expect(hybridKeys.algorithm).toBe(PQCAlgorithm.HYBRID_KYBER_X25519);
      expect(hybridKeys.pqc.algorithm).toBe(PQCAlgorithm.ML_KEM_768);
      expect(hybridKeys.classical.algorithm).toBe(PQCAlgorithm.CLASSICAL_X25519);
    });
  });

  describe('generateSigningKeyPair', () => {
    it('should generate signing key pair with ML-DSA-65 by default', async () => {
      const keyPair = await generator.generateSigningKeyPair();

      expect(keyPair.algorithm).toBe(PQCAlgorithm.ML_DSA_65);
      expect(keyPair.keyType).toBe(KeyType.SIGNATURE);
    });
  });

  describe('generateKeyExchangeKeyPair', () => {
    it('should generate key exchange key pair with ML-KEM-768 by default', async () => {
      const keyPair = await generator.generateKeyExchangeKeyPair();

      expect(keyPair.algorithm).toBe(PQCAlgorithm.ML_KEM_768);
      expect(keyPair.keyType).toBe(KeyType.KEY_EXCHANGE);
    });
  });
});
