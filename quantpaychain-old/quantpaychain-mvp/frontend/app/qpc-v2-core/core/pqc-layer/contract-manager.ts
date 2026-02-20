
/**
 * PQC Contract Manager
 * Manages digital contract signing and verification using post-quantum signatures
 */

import { v4 as uuidv4 } from 'uuid';
import {
  Contract,
  ContractParty,
  ContractSignature,
  ContractStatus,
  KeyPair,
} from './types';
import { PQCCryptoOperations } from './crypto-operations';
import { PQCSignatureError } from './errors';

export class PQCContractManager {
  private contracts: Map<string, Contract>;
  private cryptoOps: PQCCryptoOperations;

  constructor() {
    this.contracts = new Map();
    this.cryptoOps = new PQCCryptoOperations();
  }

  /**
   * Create a new contract
   * @param content - Contract content
   * @param parties - Contract parties
   * @param expiresAt - Optional expiration date
   * @returns Contract ID
   */
  public createContract(
    content: string,
    parties: Omit<ContractParty, 'id'>[],
    expiresAt?: string
  ): string {
    const contractId = uuidv4();
    
    const contract: Contract = {
      id: contractId,
      content,
      parties: parties.map(p => ({
        ...p,
        id: uuidv4(),
      })),
      signatures: [],
      createdAt: new Date().toISOString(),
      expiresAt,
      status: ContractStatus.DRAFT,
    };

    this.contracts.set(contractId, contract);
    return contractId;
  }

  /**
   * Get contract by ID
   * @param contractId - Contract ID
   * @returns Contract
   */
  public getContract(contractId: string): Contract {
    const contract = this.contracts.get(contractId);
    if (!contract) {
      throw new PQCSignatureError(`Contract not found: ${contractId}`);
    }
    return contract;
  }

  /**
   * Sign a contract
   * @param contractId - Contract ID
   * @param partyId - Party ID signing the contract
   * @param keyPair - Key pair for signing
   * @returns Signature ID
   */
  public async signContract(
    contractId: string,
    partyId: string,
    keyPair: KeyPair
  ): Promise<string> {
    const contract = this.getContract(contractId);

    // Verify party is authorized
    const party = contract.parties.find(p => p.id === partyId);
    if (!party) {
      throw new PQCSignatureError(`Party not authorized to sign: ${partyId}`);
    }

    // Check if already signed
    const existingSignature = contract.signatures.find(s => s.partyId === partyId);
    if (existingSignature) {
      throw new PQCSignatureError(`Party has already signed: ${partyId}`);
    }

    // Check if contract is expired
    if (contract.expiresAt && new Date(contract.expiresAt) < new Date()) {
      throw new PQCSignatureError('Contract has expired');
    }

    try {
      // Create signature payload (contract content + metadata)
      const signaturePayload = JSON.stringify({
        contractId: contract.id,
        content: contract.content,
        partyId,
        timestamp: new Date().toISOString(),
      });

      // Sign the contract
      const signatureResult = await this.cryptoOps.sign(signaturePayload, keyPair);

      // Add signature to contract
      const contractSignature: ContractSignature = {
        partyId,
        signature: signatureResult.signature,
        algorithm: signatureResult.algorithm,
        timestamp: signatureResult.timestamp,
        publicKey: signatureResult.publicKey,
      };

      contract.signatures.push(contractSignature);

      // Update contract status
      if (contract.status === ContractStatus.DRAFT) {
        contract.status = ContractStatus.PENDING;
      }

      // Check if all parties have signed
      if (contract.signatures.length === contract.parties.length) {
        contract.status = ContractStatus.SIGNED;
      }

      this.contracts.set(contractId, contract);

      return partyId;
    } catch (error) {
      throw new PQCSignatureError(
        `Failed to sign contract: ${(error as Error).message}`
      );
    }
  }

  /**
   * Verify all signatures on a contract
   * @param contractId - Contract ID
   * @returns Verification results for each signature
   */
  public async verifyContract(
    contractId: string
  ): Promise<Array<{ partyId: string; isValid: boolean; error?: string }>> {
    const contract = this.getContract(contractId);
    const results: Array<{ partyId: string; isValid: boolean; error?: string }> = [];

    for (const signature of contract.signatures) {
      try {
        // Recreate signature payload
        const signaturePayload = JSON.stringify({
          contractId: contract.id,
          content: contract.content,
          partyId: signature.partyId,
          timestamp: signature.timestamp,
        });

        // Verify signature
        const verificationResult = await this.cryptoOps.verify(
          signaturePayload,
          signature
        );

        results.push({
          partyId: signature.partyId,
          isValid: verificationResult.isValid,
        });
      } catch (error) {
        results.push({
          partyId: signature.partyId,
          isValid: false,
          error: (error as Error).message,
        });
      }
    }

    return results;
  }

  /**
   * Execute a contract (mark as executed after all signatures are verified)
   * @param contractId - Contract ID
   * @returns True if executed successfully
   */
  public async executeContract(contractId: string): Promise<boolean> {
    const contract = this.getContract(contractId);

    if (contract.status !== ContractStatus.SIGNED) {
      throw new PQCSignatureError('Contract must be fully signed before execution');
    }

    // Verify all signatures
    const verifications = await this.verifyContract(contractId);
    const allValid = verifications.every(v => v.isValid);

    if (!allValid) {
      throw new PQCSignatureError('Contract verification failed');
    }

    contract.status = ContractStatus.EXECUTED;
    this.contracts.set(contractId, contract);

    return true;
  }

  /**
   * Revoke a contract
   * @param contractId - Contract ID
   * @param reason - Reason for revocation
   */
  public revokeContract(contractId: string, reason: string): void {
    const contract = this.getContract(contractId);

    if (contract.status === ContractStatus.EXECUTED) {
      throw new PQCSignatureError('Cannot revoke executed contract');
    }

    contract.status = ContractStatus.REVOKED;
    this.contracts.set(contractId, contract);
  }

  /**
   * List all contracts
   * @param status - Optional status filter
   * @returns Array of contracts
   */
  public listContracts(status?: ContractStatus): Contract[] {
    const allContracts = Array.from(this.contracts.values());
    
    if (status) {
      return allContracts.filter(c => c.status === status);
    }
    
    return allContracts;
  }

  /**
   * Get contract signing progress
   * @param contractId - Contract ID
   * @returns Signing progress information
   */
  public getSigningProgress(contractId: string): {
    totalParties: number;
    signedParties: number;
    pendingParties: Array<{ id: string; name: string }>;
  } {
    const contract = this.getContract(contractId);
    const signedPartyIds = new Set(contract.signatures.map(s => s.partyId));
    const pendingParties = contract.parties.filter(p => !signedPartyIds.has(p.id));

    return {
      totalParties: contract.parties.length,
      signedParties: contract.signatures.length,
      pendingParties: pendingParties.map(p => ({ id: p.id, name: p.name })),
    };
  }

  /**
   * Export contract (for archival)
   * @param contractId - Contract ID
   * @returns Serialized contract
   */
  public exportContract(contractId: string): string {
    const contract = this.getContract(contractId);
    
    return JSON.stringify({
      ...contract,
      parties: contract.parties.map(p => ({
        ...p,
        publicKey: Array.from(p.publicKey),
      })),
      signatures: contract.signatures.map(s => ({
        ...s,
        signature: Array.from(s.signature),
        publicKey: Array.from(s.publicKey),
      })),
    });
  }
}
