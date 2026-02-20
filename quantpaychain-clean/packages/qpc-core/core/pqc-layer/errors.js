"use strict";
/**
 * Custom error classes for PQC Layer
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PQCKeyManagementError = exports.PQCVerificationError = exports.PQCSignatureError = exports.PQCDecryptionError = exports.PQCEncryptionError = exports.PQCKeyGenerationError = exports.PQCError = void 0;
class PQCError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PQCError';
        Object.setPrototypeOf(this, PQCError.prototype);
    }
}
exports.PQCError = PQCError;
class PQCKeyGenerationError extends PQCError {
    constructor(message) {
        super(message);
        this.name = 'PQCKeyGenerationError';
        Object.setPrototypeOf(this, PQCKeyGenerationError.prototype);
    }
}
exports.PQCKeyGenerationError = PQCKeyGenerationError;
class PQCEncryptionError extends PQCError {
    constructor(message) {
        super(message);
        this.name = 'PQCEncryptionError';
        Object.setPrototypeOf(this, PQCEncryptionError.prototype);
    }
}
exports.PQCEncryptionError = PQCEncryptionError;
class PQCDecryptionError extends PQCError {
    constructor(message) {
        super(message);
        this.name = 'PQCDecryptionError';
        Object.setPrototypeOf(this, PQCDecryptionError.prototype);
    }
}
exports.PQCDecryptionError = PQCDecryptionError;
class PQCSignatureError extends PQCError {
    constructor(message) {
        super(message);
        this.name = 'PQCSignatureError';
        Object.setPrototypeOf(this, PQCSignatureError.prototype);
    }
}
exports.PQCSignatureError = PQCSignatureError;
class PQCVerificationError extends PQCError {
    constructor(message) {
        super(message);
        this.name = 'PQCVerificationError';
        Object.setPrototypeOf(this, PQCVerificationError.prototype);
    }
}
exports.PQCVerificationError = PQCVerificationError;
class PQCKeyManagementError extends PQCError {
    constructor(message) {
        super(message);
        this.name = 'PQCKeyManagementError';
        Object.setPrototypeOf(this, PQCKeyManagementError.prototype);
    }
}
exports.PQCKeyManagementError = PQCKeyManagementError;
