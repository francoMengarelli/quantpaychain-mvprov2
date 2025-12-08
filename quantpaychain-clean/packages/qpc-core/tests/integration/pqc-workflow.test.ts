
/**
 * Integration tests for PQC Layer workflow
 */

import { PQCLayer } from '../../core/pqc-layer';
import { PQCAlgorithm, KeyType, ContractStatus } from '../../core/pqc-layer/types';

describe('PQCLayer Integration', () => {
  let pqcLayer: PQCLayer;

  beforeEach(() => {
    pqcLayer = new PQCLayer({
      defaultAlgorithm: PQCAlgorithm.ML_KEM_768,
      enableHybridMode: true,
      keyRotationEnabled: false, // Disable for tests
    });
  });

  describe('Complete encryption/decryption workflow', () => {
    it('should encrypt and decrypt data end-to-end', async () => {
      // Generate key pair for recipient
      const recipientKeyId = await pqcLayer.generateAndStoreKeyPair(
        PQCAlgorithm.ML_KEM_768,
        KeyType.KEY_EXCHANGE,
        'test-encryption'
      );

      const keyManager = pqcLayer.getKeyManager();
      const recipientKeys = keyManager.getKey(recipientKeyId);

      // Encrypt message
      const plaintext = 'Secret quantum-resistant message';
      const { encapsulation, encryptedData } = await pqcLayer.encrypt(
        plaintext,
        recipientKeys.publicKey
      );

      // Decrypt message
      const decrypted = await pqcLayer.decrypt(
        encapsulation.ciphertext,
        encryptedData,
        recipientKeys.privateKey
      );

      const decoder = new TextDecoder();
      const decryptedText = decoder.decode(decrypted.plaintext);

      expect(decryptedText).toBe(plaintext);
    });
  });

  describe('Complete digital contract signing workflow', () => {
    it('should create, sign, and verify a contract', async () => {
      const contractManager = pqcLayer.getContractManager();

      // Generate signing keys for two parties
      const party1Keys = await pqcLayer.generateKeyPair(
        PQCAlgorithm.ML_DSA_65,
        KeyType.SIGNATURE,
        'party1-signing'
      );

      const party2Keys = await pqcLayer.generateKeyPair(
        PQCAlgorithm.ML_DSA_65,
        KeyType.SIGNATURE,
        'party2-signing'
      );

      // Create contract
      const contractId = contractManager.createContract(
        'This is a quantum-resistant digital contract agreement.',
        [
          {
            name: 'Alice Corporation',
            publicKey: party1Keys.publicKey,
            role: 'buyer',
          },
          {
            name: 'Bob Industries',
            publicKey: party2Keys.publicKey,
            role: 'seller',
          },
        ]
      );

      const contract = contractManager.getContract(contractId);
      expect(contract.status).toBe(ContractStatus.DRAFT);

      // First party signs
      const party1Id = contract.parties[0].id;
      await contractManager.signContract(contractId, party1Id, party1Keys);

      let updatedContract = contractManager.getContract(contractId);
      expect(updatedContract.status).toBe(ContractStatus.PENDING);
      expect(updatedContract.signatures).toHaveLength(1);

      // Second party signs
      const party2Id = contract.parties[1].id;
      await contractManager.signContract(contractId, party2Id, party2Keys);

      updatedContract = contractManager.getContract(contractId);
      expect(updatedContract.status).toBe(ContractStatus.SIGNED);
      expect(updatedContract.signatures).toHaveLength(2);

      // Verify all signatures
      const verifications = await contractManager.verifyContract(contractId);
      expect(verifications).toHaveLength(2);
      expect(verifications.every(v => v.isValid)).toBe(true);

      // Execute contract
      const executed = await contractManager.executeContract(contractId);
      expect(executed).toBe(true);

      const finalContract = contractManager.getContract(contractId);
      expect(finalContract.status).toBe(ContractStatus.EXECUTED);
    });
  });

  describe('Key management workflow', () => {
    it('should manage key lifecycle', async () => {
      const keyManager = pqcLayer.getKeyManager();

      // Generate and store key
      const keyId = await keyManager.generateAndStoreKey(
        PQCAlgorithm.ML_KEM_768,
        KeyType.KEY_EXCHANGE,
        'test-key'
      );

      // Retrieve key
      const key = keyManager.getKey(keyId);
      expect(key).toBeDefined();
      expect(key.algorithm).toBe(PQCAlgorithm.ML_KEM_768);

      // List keys
      const keys = keyManager.listKeys();
      expect(keys.length).toBeGreaterThan(0);
      expect(keys.some(k => k.id === keyId)).toBe(true);

      // Export key
      const exported = keyManager.exportKey(keyId);
      expect(exported).toBeTruthy();

      // Delete key
      keyManager.deleteKey(keyId);
      expect(() => keyManager.getKey(keyId)).toThrow();

      // Import key back
      const importedKeyId = keyManager.importKey(exported);
      const importedKey = keyManager.getKey(importedKeyId);
      expect(importedKey.algorithm).toBe(PQCAlgorithm.ML_KEM_768);
    });
  });
});
