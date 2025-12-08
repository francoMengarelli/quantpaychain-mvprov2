"use strict";
/**
 * Custom error classes for ISO 20022 Gateway
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ISO20022TransformationError = exports.ISO20022ValidationError = exports.ISO20022ParserError = exports.ISO20022Error = void 0;
class ISO20022Error extends Error {
    constructor(message) {
        super(message);
        this.name = 'ISO20022Error';
        Object.setPrototypeOf(this, ISO20022Error.prototype);
    }
}
exports.ISO20022Error = ISO20022Error;
class ISO20022ParserError extends ISO20022Error {
    constructor(message) {
        super(message);
        this.name = 'ISO20022ParserError';
        Object.setPrototypeOf(this, ISO20022ParserError.prototype);
    }
}
exports.ISO20022ParserError = ISO20022ParserError;
class ISO20022ValidationError extends ISO20022Error {
    constructor(message, errors = []) {
        super(message);
        this.name = 'ISO20022ValidationError';
        this.validationErrors = errors;
        Object.setPrototypeOf(this, ISO20022ValidationError.prototype);
    }
}
exports.ISO20022ValidationError = ISO20022ValidationError;
class ISO20022TransformationError extends ISO20022Error {
    constructor(message) {
        super(message);
        this.name = 'ISO20022TransformationError';
        Object.setPrototypeOf(this, ISO20022TransformationError.prototype);
    }
}
exports.ISO20022TransformationError = ISO20022TransformationError;
