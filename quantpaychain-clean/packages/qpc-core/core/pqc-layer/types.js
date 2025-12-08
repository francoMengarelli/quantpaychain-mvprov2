"use strict";
/**
 * Post-Quantum Cryptography Types and Interfaces
 * Defines structures for PQC operations including ML-KEM-768 and ML-DSA-65
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractStatus = exports.KeyType = exports.PQCAlgorithm = void 0;
var PQCAlgorithm;
(function (PQCAlgorithm) {
    PQCAlgorithm["ML_KEM_768"] = "ML-KEM-768";
    PQCAlgorithm["ML_DSA_65"] = "ML-DSA-65";
    PQCAlgorithm["FALCON_512"] = "FALCON-512";
    PQCAlgorithm["HYBRID_KYBER_X25519"] = "HYBRID-KYBER-X25519";
    PQCAlgorithm["CLASSICAL_X25519"] = "CLASSICAL-X25519";
})(PQCAlgorithm || (exports.PQCAlgorithm = PQCAlgorithm = {}));
var KeyType;
(function (KeyType) {
    KeyType["KEY_EXCHANGE"] = "key_exchange";
    KeyType["SIGNATURE"] = "signature";
    KeyType["ENCRYPTION"] = "encryption";
})(KeyType || (exports.KeyType = KeyType = {}));
var ContractStatus;
(function (ContractStatus) {
    ContractStatus["DRAFT"] = "draft";
    ContractStatus["PENDING"] = "pending";
    ContractStatus["SIGNED"] = "signed";
    ContractStatus["EXECUTED"] = "executed";
    ContractStatus["EXPIRED"] = "expired";
    ContractStatus["REVOKED"] = "revoked";
})(ContractStatus || (exports.ContractStatus = ContractStatus = {}));
