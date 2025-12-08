declare module 'libsodium-wrappers' {
  export const ready: Promise<void>;
  
  export interface KeyPair {
    publicKey: Uint8Array;
    privateKey: Uint8Array;
    keyType: string;
  }
  
  export interface CryptoBox {
    ciphertext: Uint8Array;
    mac: Uint8Array;
  }
  
  export interface StateAddress {
    name: string;
  }
  
  // Crypto functions
  export function crypto_sign_keypair(): KeyPair;
  export function crypto_sign_detached(message: Uint8Array, privateKey: Uint8Array): Uint8Array;
  export function crypto_sign_verify_detached(signature: Uint8Array, message: Uint8Array, publicKey: Uint8Array): boolean;
  
  export function crypto_box_keypair(): KeyPair;
  export function crypto_box_easy(message: Uint8Array, nonce: Uint8Array, publicKey: Uint8Array, privateKey: Uint8Array): Uint8Array;
  export function crypto_box_open_easy(ciphertext: Uint8Array, nonce: Uint8Array, publicKey: Uint8Array, privateKey: Uint8Array): Uint8Array;
  
  export function crypto_secretbox_easy(message: Uint8Array, nonce: Uint8Array, key: Uint8Array): Uint8Array;
  export function crypto_secretbox_open_easy(ciphertext: Uint8Array, nonce: Uint8Array, key: Uint8Array): Uint8Array;
  
  export function crypto_generichash(hash_length: number, message: Uint8Array, key?: Uint8Array): Uint8Array;
  export function crypto_pwhash(keyLength: number, password: Uint8Array, salt: Uint8Array, opsLimit: number, memLimit: number, algorithm: number): Uint8Array;
  
  // Random data generation
  export function randombytes_buf(length: number): Uint8Array;
  
  // Encoding utilities
  export function to_hex(data: Uint8Array): string;
  export function from_hex(hex: string): Uint8Array;
  export function to_base64(data: Uint8Array): string;
  export function from_base64(base64: string): Uint8Array;
  export function to_string(data: Uint8Array): string;
  export function from_string(str: string): Uint8Array;
  
  // Constants
  export const crypto_box_NONCEBYTES: number;
  export const crypto_box_PUBLICKEYBYTES: number;
  export const crypto_box_SECRETKEYBYTES: number;
  export const crypto_secretbox_KEYBYTES: number;
  export const crypto_secretbox_NONCEBYTES: number;
  export const crypto_sign_PUBLICKEYBYTES: number;
  export const crypto_sign_SECRETKEYBYTES: number;
  export const crypto_sign_BYTES: number;
  export const crypto_generichash_BYTES: number;
  export const crypto_pwhash_SALTBYTES: number;
  export const crypto_pwhash_OPSLIMIT_INTERACTIVE: number;
  export const crypto_pwhash_MEMLIMIT_INTERACTIVE: number;
  export const crypto_pwhash_ALG_DEFAULT: number;
}
