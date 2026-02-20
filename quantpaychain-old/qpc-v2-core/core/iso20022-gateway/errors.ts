
/**
 * Custom error classes for ISO 20022 Gateway
 */

export class ISO20022Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ISO20022Error';
    Object.setPrototypeOf(this, ISO20022Error.prototype);
  }
}

export class ISO20022ParserError extends ISO20022Error {
  constructor(message: string) {
    super(message);
    this.name = 'ISO20022ParserError';
    Object.setPrototypeOf(this, ISO20022ParserError.prototype);
  }
}

export class ISO20022ValidationError extends ISO20022Error {
  public validationErrors: Array<{ code: string; message: string; path?: string }>;

  constructor(message: string, errors: Array<{ code: string; message: string; path?: string }> = []) {
    super(message);
    this.name = 'ISO20022ValidationError';
    this.validationErrors = errors;
    Object.setPrototypeOf(this, ISO20022ValidationError.prototype);
  }
}

export class ISO20022TransformationError extends ISO20022Error {
  constructor(message: string) {
    super(message);
    this.name = 'ISO20022TransformationError';
    Object.setPrototypeOf(this, ISO20022TransformationError.prototype);
  }
}
