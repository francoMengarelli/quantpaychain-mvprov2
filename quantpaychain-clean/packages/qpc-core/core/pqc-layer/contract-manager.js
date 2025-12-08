"use strict";
/**
 * PQC Contract Manager
 * Manages digital contract signing and verification using post-quantum signatures
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PQCContractManager = void 0;
const uuid_1 = require("uuid");
const types_1 = require("./types");
const crypto_operations_1 = require("./crypto-operations");
const errors_1 = require("./errors");
class PQCContractManager {
    constructor() {
        this.contracts = new Map();
        this.cryptoOps = new crypto_operations_1.PQCCryptoOperations();
    }
    /**
     * Create a new contract
     * @param content - Contract content
     * @param parties - Contract parties
     * @param expiresAt - Optional expiration date
     * @returns Contract ID
     */
    createContract(content, parties, expiresAt) {
        const contractId = (0, uuid_1.v4)();
        const contract = {
            id: contractId,
            content,
            parties: parties.map(p => ({
                ...p,
                id: (0, uuid_1.v4)(),
            })),
            signatures: [],
            createdAt: new Date().toISOString(),
            expiresAt,
            status: types_1.ContractStatus.DRAFT,
        };
        this.contracts.set(contractId, contract);
        return contractId;
    }
    /**
     * Get contract by ID
     * @param contractId - Contract ID
     * @returns Contract
     */
    getContract(contractId) {
        const contract = this.contracts.get(contractId);
        if (!contract) {
            throw new errors_1.PQCSignatureError(`Contract not found: ${contractId}`);
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
    async signContract(contractId, partyId, keyPair) {
        const contract = this.getContract(contractId);
        // Verify party is authorized
        const party = contract.parties.find(p => p.id === partyId);
        if (!party) {
            throw new errors_1.PQCSignatureError(`Party not authorized to sign: ${partyId}`);
        }
        // Check if already signed
        const existingSignature = contract.signatures.find(s => s.partyId === partyId);
        if (existingSignature) {
            throw new errors_1.PQCSignatureError(`Party has already signed: ${partyId}`);
        }
        // Check if contract is expired
        if (contract.expiresAt && new Date(contract.expiresAt) < new Date()) {
            throw new errors_1.PQCSignatureError('Contract has expired');
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
            const contractSignature = {
                partyId,
                signature: signatureResult.signature,
                algorithm: signatureResult.algorithm,
                timestamp: signatureResult.timestamp,
                publicKey: signatureResult.publicKey,
            };
            contract.signatures.push(contractSignature);
            // Update contract status
            if (contract.status === types_1.ContractStatus.DRAFT) {
                contract.status = types_1.ContractStatus.PENDING;
            }
            // Check if all parties have signed
            if (contract.signatures.length === contract.parties.length) {
                contract.status = types_1.ContractStatus.SIGNED;
            }
            this.contracts.set(contractId, contract);
            return partyId;
        }
        catch (error) {
            throw new errors_1.PQCSignatureError(`Failed to sign contract: ${error.message}`);
        }
    }
    /**
     * Verify all signatures on a contract
     * @param contractId - Contract ID
     * @returns Verification results for each signature
     */
    async verifyContract(contractId) {
        const contract = this.getContract(contractId);
        const results = [];
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
                const verificationResult = await this.cryptoOps.verify(signaturePayload, signature);
                results.push({
                    partyId: signature.partyId,
                    isValid: verificationResult.isValid,
                });
            }
            catch (error) {
                results.push({
                    partyId: signature.partyId,
                    isValid: false,
                    error: error.message,
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
    async executeContract(contractId) {
        const contract = this.getContract(contractId);
        if (contract.status !== types_1.ContractStatus.SIGNED) {
            throw new errors_1.PQCSignatureError('Contract must be fully signed before execution');
        }
        // Verify all signatures
        const verifications = await this.verifyContract(contractId);
        const allValid = verifications.every(v => v.isValid);
        if (!allValid) {
            throw new errors_1.PQCSignatureError('Contract verification failed');
        }
        contract.status = types_1.ContractStatus.EXECUTED;
        this.contracts.set(contractId, contract);
        return true;
    }
    /**
     * Revoke a contract
     * @param contractId - Contract ID
     * @param reason - Reason for revocation
     */
    revokeContract(contractId, reason) {
        const contract = this.getContract(contractId);
        if (contract.status === types_1.ContractStatus.EXECUTED) {
            throw new errors_1.PQCSignatureError('Cannot revoke executed contract');
        }
        contract.status = types_1.ContractStatus.REVOKED;
        this.contracts.set(contractId, contract);
    }
    /**
     * List all contracts
     * @param status - Optional status filter
     * @returns Array of contracts
     */
    listContracts(status) {
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
    getSigningProgress(contractId) {
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
    exportContract(contractId) {
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
exports.PQCContractManager = PQCContractManager;
