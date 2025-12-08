
/**
 * Custom error classes for PQC Layer
 */

export class PQCError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PQCError';
    Object.setPrototypeOf(this, PQCError.prototype);
  }
}

export class PQCKeyGenerationError extends PQCError {
  constructor(message: string) {
    super(message);
    this.name = 'PQCKeyGenerationError';
    Object.setPrototypeOf(this, PQCKeyGenerationError.prototype);
  }
}

export class PQCEncryptionError extends PQCError {
  constructor(message: string) {
    super(message);
    this.name = 'PQCEncryptionError';
    Object.setPrototypeOf(this, PQCEncryptionError.prototype);
  }
}

export class PQCDecryptionError extends PQCError {
  constructor(message: string) {
    super(message);
    this.name = 'PQCDecryptionError';
    Object.setPrototypeOf(this, PQCDecryptionError.prototype);
  }
}

export class PQCSignatureError extends PQCError {
  constructor(message: string) {
    super(message);
    this.name = 'PQCSignatureError';
    Object.setPrototypeOf(this, PQCSignatureError.prototype);
  }
}

export class PQCVerificationError extends PQCError {
  constructor(message: string) {
    super(message);
    this.name = 'PQCVerificationError';
    Object.setPrototypeOf(this, PQCVerificationError.prototype);
  }
}

export class PQCKeyManagementError extends PQCError {
  constructor(message: string) {
    super(message);
    this.name = 'PQCKeyManagementError';
    Object.setPrototypeOf(this, PQCKeyManagementError.prototype);
  }
}
